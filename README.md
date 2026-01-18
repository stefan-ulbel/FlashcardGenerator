# Flashcard Generator

LLM-powered adaptive flashcard generator that automatically creates flashcards from uploaded documents (PDF, MD, TXT).

## Quick Start

### Prerequisites

- Node.js 24.12
- Google Gemini API Key (required)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd FlashcardGenerator
```

2. Install dependencies:
   
   This project uses a monorepo structure with separate `package.json` files in the root, `backend/`, and `frontend/` directories. You need to install dependencies in each folder:
   
```bash
# Install root dependencies (concurrently for running both servers)
npm install

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install

# Return to root directory
cd ..
```

3. Configure API Key:
   - Open `backend/.env`
   - Replace `GEMINI_API_KEY` with your own key
   - Get your API key from [Google AI Studio](https://makersuite.google.com/app/apikey)

4. Start everything:
```bash
npm run dev
```

This starts both backend and frontend servers:
- Backend on `http://localhost:3000`
- Frontend on `http://localhost:5173` (or similar)

## API Endpoints

- `POST /generate-quiz` - Generate multiple-choice quiz from uploaded files
- `POST /generate-single-question` - Generate question-answer flashcards
- `GET /health` - Health check


## Tech Stack

- **Backend**: Node.js, TypeScript, Google Gemini API
- **Frontend**: Vue 3, TypeScript, Tailwind CSS, Vite

## Authors

Martin Weber, Dominic Leidenfrost, Raoul Wograndl, Antoine Origer, Stefan Ulbel


