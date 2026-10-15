<#
.SYNOPSIS
    Everything Antigravity Installer for Windows (PowerShell)
    Authored by Sanish Gyawali

.DESCRIPTION
    Installs Everything Antigravity skills, rules, and templates into either:
    1. Global Antigravity Config (~/.gemini/config/skills/)
    2. Local Project / Workspace (.agents/skills/, .agents/rules/, GEMINI.md)

.PARAMETER Global
    Install skills globally into ~/.gemini/config/skills/ for all Antigravity sessions.

.PARAMETER Workspace
    Install into the specified project root directory.

.EXAMPLE
    .\install.ps1 -Global
    .\install.ps1 -Workspace "C:\Projects\MyAwesomeApp"
#>

[CmdletBinding(DefaultParameterSetName = "Interactive")]
param (
    [Parameter(ParameterSetName = "GlobalMode")]
    [switch]$Global,

    [Parameter(ParameterSetName = "WorkspaceMode")]
    [string]$Workspace
)

$ErrorActionPreference = "Stop"

function Write-Header {
    Write-Host ""
    Write-Host "============================================================" -ForegroundColor Cyan
    Write-Host "             🚀 EVERYTHING ANTIGRAVITY INSTALLER             " -ForegroundColor Yellow
    Write-Host "           High-Performance Agent Engineering Suite         " -ForegroundColor Green
    Write-Host "                   Authored by Sanish Gyawali               " -ForegroundColor Gray
    Write-Host "============================================================" -ForegroundColor Cyan
    Write-Host ""
}

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$RepoRoot = Split-Path -Parent $ScriptDir
$SourceSkills = Join-Path $RepoRoot "skills"
$SourceRules = Join-Path $RepoRoot "rules"
$SourceGemini = Join-Path $RepoRoot "templates\GEMINI.md"

if (-not (Test-Path $SourceSkills)) {
    Write-Error "Source skills directory not found at: $SourceSkills"
    exit 1
}

Write-Header

if ($PSCmdlet.ParameterSetName -eq "Interactive") {
    Write-Host "Choose installation target:" -ForegroundColor White
    Write-Host " [1] Global    - Install 300+ skills into ~/.gemini/config/skills/ (Available across all sessions)" -ForegroundColor Cyan
    Write-Host " [2] Workspace - Install into current project (.agents/skills, .agents/rules, GEMINI.md)" -ForegroundColor Cyan
    Write-Host " [3] Both      - Install Globally and into the current directory" -ForegroundColor Cyan
    Write-Host " [Q] Quit" -ForegroundColor Gray
    Write-Host ""
    
    $choice = Read-Host "Select option [1-3, Q]"
    switch ($choice.Trim().ToUpper()) {
        "1" { $Global = $true }
        "2" { $Workspace = (Get-Location).Path }
        "3" { $Global = $true; $Workspace = (Get-Location).Path }
        default { Write-Host "Installation cancelled." -ForegroundColor Yellow; exit 0 }
    }
}

if ($Global) {
    $GlobalDir = Join-Path $HOME ".gemini\config\skills"
    Write-Host "📦 Installing skills globally to: " -NoNewline -ForegroundColor White
    Write-Host $GlobalDir -ForegroundColor Cyan

    if (-not (Test-Path $GlobalDir)) {
        New-Item -ItemType Directory -Path $GlobalDir -Force | Out-Null
    }

    $skills = Get-ChildItem -Path $SourceSkills -Directory
    $count = 0
    foreach ($skill in $skills) {
        $dest = Join-Path $GlobalDir $skill.Name
        Copy-Item -Path $skill.FullName -Destination $dest -Recurse -Force
        $count++
    }

    Write-Host "✅ Successfully installed $count skills globally into Antigravity!" -ForegroundColor Green
}

if ($Workspace) {
    if (-not (Test-Path $Workspace)) {
        Write-Error "Target workspace path does not exist: $Workspace"
        exit 1
    }

    Write-Host "📁 Setting up workspace at: " -NoNewline -ForegroundColor White
    Write-Host $Workspace -ForegroundColor Cyan

    $AgentsDir = Join-Path $Workspace ".agents"
    $TargetSkills = Join-Path $AgentsDir "skills"
    $TargetRules = Join-Path $AgentsDir "rules"
    $TargetGemini = Join-Path $Workspace "GEMINI.md"

    New-Item -ItemType Directory -Path $TargetSkills -Force | Out-Null
    New-Item -ItemType Directory -Path $TargetRules -Force | Out-Null

    Write-Host "   Copying modular skills..." -ForegroundColor Gray
    Copy-Item -Path "$SourceSkills\*" -Destination $TargetSkills -Recurse -Force

    Write-Host "   Copying stack rules..." -ForegroundColor Gray
    Copy-Item -Path "$SourceRules\*" -Destination $TargetRules -Recurse -Force

    if (-not (Test-Path $TargetGemini)) {
        Write-Host "   Creating root GEMINI.md directives..." -ForegroundColor Gray
        Copy-Item -Path $SourceGemini -Destination $TargetGemini -Force
    } else {
        Write-Host "   ⚠️ GEMINI.md already exists in workspace root (skipping overwrite)." -ForegroundColor Yellow
    }

    Write-Host "✅ Successfully configured workspace for Everything Antigravity!" -ForegroundColor Green
}

Write-Host ""
Write-Host "🎉 Installation complete! Start or restart Antigravity to use your new capabilities." -ForegroundColor Yellow
Write-Host ""
