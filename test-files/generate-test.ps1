# Flashcard Generation Test Script
# Run from the project root directory

param(
    [Parameter(Mandatory = $true)]
    [string]$PdfPath,
    
    [Parameter(Mandatory = $false)]
    [string]$Topic = "",
    
    [Parameter(Mandatory = $false)]
    [int]$NumQuestions = 5,
    
    [Parameter(Mandatory = $false)]
    [ValidateSet("quiz", "single")]
    [string]$Mode = "quiz"
)

$baseUrl = "http://localhost:3000"

# Verify the file exists
if (-not (Test-Path $PdfPath)) {
    Write-Error "File not found: $PdfPath"
    exit 1
}

# Get absolute path
$absolutePath = (Resolve-Path $PdfPath).Path

# Get just the filename for output naming
$fileName = [System.IO.Path]::GetFileNameWithoutExtension($PdfPath)
$timestamp = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"

# Determine endpoint
if ($Mode -eq "quiz") {
    $endpoint = "$baseUrl/generate-quiz"
}
else {
    $endpoint = "$baseUrl/generate-single-question"
}

Write-Host "====================================" -ForegroundColor Cyan
Write-Host "Flashcard Generation Test" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan
Write-Host "Mode: $Mode"
Write-Host "PDF: $absolutePath"
Write-Host "Topic: $(if ($Topic) { $Topic } else { '(none)' })"
if ($Mode -eq "quiz") { Write-Host "Questions: $NumQuestions" }
Write-Host ""

Write-Host "Generating flashcards..." -ForegroundColor Yellow

try {
    # Build curl arguments
    $curlArgs = @(
        "-s",
        "-X", "POST",
        "-F", "file=@$absolutePath"
    )
    
    if ($Topic) {
        $curlArgs += @("-F", "topic=$Topic")
    }
    
    if ($Mode -eq "quiz") {
        $curlArgs += @("-F", "numQuestions=$NumQuestions")
    }
    
    $curlArgs += $endpoint
    
    # Make the API request using curl.exe (not PowerShell alias)
    $jsonResponse = & curl.exe @curlArgs
    
    if ($LASTEXITCODE -ne 0) {
        throw "curl command failed"
    }
    
    # Save raw JSON to file
    $outputFile = "test-files\output_${Mode}_${fileName}_${timestamp}.json"
    $jsonResponse | Out-File -FilePath $outputFile -Encoding utf8
    
    # Parse JSON for display
    $response = $jsonResponse | ConvertFrom-Json
    
    Write-Host ""
    Write-Host "SUCCESS!" -ForegroundColor Green
    Write-Host "Output saved to: $outputFile" -ForegroundColor Green
    Write-Host ""
    Write-Host "====================================" -ForegroundColor Cyan
    Write-Host "GENERATED FLASHCARDS:" -ForegroundColor Cyan
    Write-Host "====================================" -ForegroundColor Cyan
    Write-Host ""
    
    # Display the cards in a readable format
    if ($Mode -eq "quiz") {
        $cardNum = 1
        foreach ($q in $response.questions) {
            Write-Host "--- Card $cardNum ---" -ForegroundColor Magenta
            Write-Host "Q: $($q.question)" -ForegroundColor White
            Write-Host ""
            $optionNum = 1
            foreach ($opt in $q.options) {
                $prefix = if ($optionNum - 1 -eq $q.correctAnswer) { "[CORRECT] " } else { "          " }
                $color = if ($optionNum - 1 -eq $q.correctAnswer) { "Green" } else { "Gray" }
                Write-Host "${prefix}$optionNum. $opt" -ForegroundColor $color
                $optionNum++
            }
            Write-Host ""
            $cardNum++
        }
    }
    else {
        $cardNum = 1
        foreach ($card in $response.cards) {
            Write-Host "--- Card $cardNum ---" -ForegroundColor Magenta
            Write-Host "Q: $($card.question)" -ForegroundColor White
            Write-Host "A: $($card.answer)" -ForegroundColor Green
            Write-Host ""
            $cardNum++
        }
    }
    
    Write-Host "====================================" -ForegroundColor Cyan
    Write-Host "Now evaluate using: test-files\evaluation-template.md" -ForegroundColor Yellow
    
}
catch {
    Write-Error "Failed to generate flashcards: $_"
    exit 1
}

