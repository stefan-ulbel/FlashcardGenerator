# Test Files for Prompting Evaluation

## Quick Start

### 1. Put your PDF files here
Copy your sample PDF files into this folder.

### 2. Generate flashcards using the test script

**Quiz mode (multiple choice):**
```powershell
.\test-files\generate-test.ps1 -PdfPath ".\test-files\your-file.pdf" -Mode quiz
```

**Single question mode (Q&A):**
```powershell
.\test-files\generate-test.ps1 -PdfPath ".\test-files\your-file.pdf" -Mode single
```

**With topic hint:**
```powershell
.\test-files\generate-test.ps1 -PdfPath ".\test-files\your-file.pdf" -Topic "Machine Learning" -Mode quiz
```

### 3. Evaluate the output
- Generated JSON is saved to `test-files\output_*.json`
- Use `evaluation-template.md` to score quality
- Copy template for each test run

## Files
- `generate-test.ps1` - Script to generate and save flashcards
- `evaluation-template.md` - Template for quality scoring
- `output_*.json` - Generated flashcard outputs (auto-created)
