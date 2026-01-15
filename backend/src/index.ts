import http from 'http'
import { createRequire } from 'module'
import path from 'path'
import dotenv from 'dotenv'
// @ts-ignore - prompting.js is a JavaScript file without type definitions
import { generateQuiz, generateSingleQuestion } from '../../prompting/prompting.js'

dotenv.config()

const require = createRequire(import.meta.url)
const busboy = require('busboy')

const PORT = process.env.PORT || 3000

// Helper function to parse JSON body
function parseBody(req: http.IncomingMessage): Promise<any> {
  return new Promise((resolve, reject) => {
    let body = ''
    req.on('data', (chunk: Buffer) => {
      body += chunk.toString()
    })
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {})
      } catch (error) {
        reject(error)
      }
    })
    req.on('error', reject)
  })
}

// Helper function to parse multipart/form-data
interface ParsedMultipart {
  fields: Record<string, string>
  files: Array<{
    filename: string
    mimetype: string
    size: number
    content: Buffer
  }>
}

function parseMultipart(req: http.IncomingMessage): Promise<ParsedMultipart> {
  return new Promise((resolve, reject) => {
    const contentType = req.headers['content-type'] || ''
    if (!contentType.includes('multipart/form-data')) {
      reject(new Error('Content-Type must be multipart/form-data'))
      return
    }

    const bb = busboy({ headers: req.headers })
    const fields: Record<string, string> = {}
    const files: ParsedMultipart['files'] = []

    bb.on('field', (name: string, value: string) => {
      fields[name] = value
    })

    bb.on('file', (name: string, file: NodeJS.ReadableStream, info: { filename: string; encoding: string; mimeType: string }) => {
      const { filename, mimeType } = info
      const allowedExtensions = ['.pdf', '.md', '.txt']
      const ext = path.extname(filename).toLowerCase()

      if (!allowedExtensions.includes(ext)) {
        file.resume()
        reject(new Error(`File type not allowed. Only ${allowedExtensions.join(', ')} are allowed.`))
        return
      }

      // Read file content into memory (no disk storage for GDPR compliance)
      const chunks: Buffer[] = []
      let size = 0

      file.on('data', (chunk: Buffer) => {
        chunks.push(chunk)
        size += chunk.length
      })

      file.on('end', () => {
        // File content is in memory, will be discarded after processing
        files.push({
          filename,
          mimetype: mimeType,
          size,
          content: Buffer.concat(chunks),
        })
      })
    })

    bb.on('finish', () => {
      resolve({ fields, files })
    })

    bb.on('error', reject)
    req.pipe(bb)
  })
}

// Helper function to send JSON response
function sendJSON(res: http.ServerResponse, statusCode: number, data: any) {
  res.writeHead(statusCode, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify(data))
}

const server = http.createServer(async (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  // Handle OPTIONS request
  if (req.method === 'OPTIONS') {
    res.writeHead(200)
    res.end()
    return
  }

  const url = new URL(req.url || '/', `http://${req.headers.host}`)
  const path = url.pathname

  // Health endpoint
  if (path === '/health' && req.method === 'GET') {
    sendJSON(res, 200, { status: 'ok' })
    return
  }

  // Generate quiz endpoint
  if (path === '/generate-quiz' && req.method === 'POST') {
    try {
      const contentType = req.headers['content-type'] || ''
      let topic: string
      let numQuestions = 5
      let files: ParsedMultipart['files'] = []

      if (contentType.includes('multipart/form-data')) {
        const parsed = await parseMultipart(req)
        topic = parsed.fields.topic || parsed.fields['topic']
        numQuestions = parsed.fields.numQuestions
          ? parseInt(parsed.fields.numQuestions, 10)
          : 5
        files = parsed.files
      } else {
        // Handle JSON body
        const body = await parseBody(req)
        topic = body.topic
        numQuestions = body.numQuestions || 5
      }

      if (!topic && files.length === 0) {
        sendJSON(res, 400, { error: 'Topic is required or at least one file must be provided' })
        return
      }

      // Call the Gemini API to generate quiz
      try {
        const questions = await generateQuiz(files, topic || '', numQuestions)
        
        const quiz = {
          id: `quiz-${Date.now()}`,
          topic: topic || 'Document-based quiz',
          numQuestions: questions.length,
          filesUploaded: files.length,
          questions,
          createdAt: new Date().toISOString(),
        }

        sendJSON(res, 200, quiz)
      } catch (error: any) {
        console.error('Error generating quiz:', error)
        sendJSON(res, 500, {
          error: error.message || 'Failed to generate quiz',
        })
      }
    } catch (error: any) {
      sendJSON(res, 400, {
        error: error.message || 'Invalid request body',
      })
    }
    return
  }

  // Generate single question endpoint
  if (path === '/generate-single-question' && req.method === 'POST') {
    try {
      const contentType = req.headers['content-type'] || ''
      let topic: string
      let files: ParsedMultipart['files'] = []

      if (contentType.includes('multipart/form-data')) {
        const parsed = await parseMultipart(req)
        topic = parsed.fields.topic || parsed.fields['topic'] || ''
        files = parsed.files
      } else {
        // Handle JSON body
        const body = await parseBody(req)
        topic = body.topic || ''
      }

      if (files.length === 0) {
        sendJSON(res, 400, { error: 'At least one file must be provided' })
        return
      }

      // Call the Gemini API to generate single question flashcards
      try {
        const cards = await generateSingleQuestion(files, topic)
        
        const result = {
          id: `single-question-${Date.now()}`,
          topic: topic || 'Document-based flashcards',
          filesUploaded: files.length,
          cards,
          createdAt: new Date().toISOString(),
        }

        sendJSON(res, 200, result)
      } catch (error: any) {
        console.error('Error generating single question:', error)
        sendJSON(res, 500, {
          error: error.message || 'Failed to generate single question flashcards',
        })
      }
    } catch (error: any) {
      sendJSON(res, 400, {
        error: error.message || 'Invalid request body',
      })
    }
    return
  }

  // 404
  sendJSON(res, 404, { error: 'Not found' })
})

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
  console.log(`Health: GET http://localhost:${PORT}/health`)
})
