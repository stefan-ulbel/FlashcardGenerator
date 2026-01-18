# Backend

Simple Node.js Backend für den Flashcard Generator.

## Setup

```bash
# Dependencies installieren
npm install

# Development Server starten (mit Hot Reload)
npm run dev

# Production Build
npm run build
npm start
```

## Endpoints

- `GET /health` - Health Check
- `POST /generate-quiz` - Generate a quiz
- `POST /generate-single-question` - Generate single question flashcards using singleQuestionPrompt

## Usage

### Health Check
```bash
curl http://localhost:3000/health
```

**Response:**
```json
{
  "status": "ok"
}
```

### Generate Quiz

#### Mit JSON Body
```bash
curl -X POST http://localhost:3000/generate-quiz \
  -H "Content-Type: application/json" \
  -d '{"topic": "JavaScript"}'
```

**Request Body:**
```json
{
  "topic": "JavaScript"
}
```

#### Mit Datei-Upload (PDF, MD, TXT)
```bash
curl -X POST http://localhost:3000/generate-quiz \
  -F "topic=JavaScript" \
  -F "file=@/path/to/document.pdf"
```

**Form Data:**
- `topic` (required): Das Thema für das Quiz
- `file` (optional): Datei(en) im Format PDF, MD oder TXT

**Response:**
```json
{
  "id": "quiz-1234567890",
  "filesUploaded": 1,
  "questions": [
    {
      "id": "q-1",
      "question": "Sample question 1 about JavaScript?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": 0
    }
  ],
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

### Generate Single Question

Generates single question flashcards using the `singleQuestionPrompt` from the main method.

#### Mit Datei-Upload (PDF, MD, TXT)
```bash
curl -X POST http://localhost:3000/generate-single-question \
  -F "topic=JavaScript" \
  -F "file=@/path/to/document.pdf"
```

**Form Data:**
- `topic` (optional): Das Thema für die Flashcards
- `file` (required): Datei(en) im Format PDF, MD oder TXT

#### Mit JSON Body
```bash
curl -X POST http://localhost:3000/generate-single-question \
  -H "Content-Type: application/json" \
  -d '{"topic": "JavaScript"}'
```

**Note:** JSON requests require files to be sent via multipart/form-data. For JSON-only requests, files must be provided via multipart.

**Response:**
```json
{
  "id": "single-question-1234567890",
  "topic": "JavaScript",
  "filesUploaded": 1,
  "cards": [
    {
      "id": "q-1",
      "question": "What is a closure in JavaScript?",
      "answer": "A closure is a function that has access to variables in its outer (enclosing) lexical scope, even after the outer function has returned."
    }
  ],
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

**Note:** This endpoint uses `singleQuestionPrompt` and `singleQuestionSchema` format. Each card contains a question and a single answer (not multiple choice).

## Data Privacy / GDPR Compliance

**Wichtig:** Der Backend-Server speichert keine Dateien oder Daten auf der Festplatte. Alle hochgeladenen Dateien werden ausschließlich im Arbeitsspeicher verarbeitet und nach der Verarbeitung automatisch verworfen. Dies gewährleistet GDPR-Konformität.

- Dateien werden nur temporär im RAM gehalten
- Keine dauerhafte Speicherung auf der Festplatte
- Daten werden nach der Request-Verarbeitung automatisch gelöscht (Garbage Collection)

## Environment Variables

Optional `.env` Datei:

```
PORT=3000
```
