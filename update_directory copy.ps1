# Save as update_directory.ps1
$projectRoot = Resolve-Path "."
$outputFile = "./.notes/directory_structure.md"
$excludedDirs = @("node_modules", ".git", "dist", "build", ".next")

# Generate formatted directory tree, skipping excluded folders
function Get-FormattedDirectory {
    param (
        [string]$path,
        [int]$indent = 0
    )

    $indentString = "    " * $indent
    $content = ""

    Get-ChildItem -Path $path -Force | Sort-Object PSIsContainer, Name | ForEach-Object {
        if ($_.PSIsContainer) {
            if ($excludedDirs -notcontains $_.Name) {
                $content += "$indentString- **$($_.Name)/**`n"
                $content += Get-FormattedDirectory -path $_.FullName -indent ($indent + 1)
            }
        } else {
            $content += "$indentString- $($_.Name)`n"
        }
    }

    return $content
}

# Generate markdown content
$markdownContent = @"
# 📁 Project Directory Structure

> Auto-generated on $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")

\`\`\`
$(Get-FormattedDirectory -path $projectRoot)
\`\`\`
"@ -replace '\\`', '`'  # Fix markdown escaping

# Ensure output directory exists
$outputDir = Split-Path -Path $outputFile -Parent
if (-not (Test-Path $outputDir)) {
    New-Item -ItemType Directory -Path $outputDir | Out-Null
}

# Output to file
$markdownContent | Out-File -FilePath $outputFile -Encoding UTF8

Write-Host "Directory structure updated in $outputFile"
