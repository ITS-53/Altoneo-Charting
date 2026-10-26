#Requires -Version 5.1
<#
.SYNOPSIS
    Mode démo Altoneo-Charting : lance la documentation Storybook en local.

.DESCRIPTION
    Vérifie l'environnement (Node/npm), installe les dépendances si nécessaire,
    puis démarre Storybook. Deux modes :
      - dev (par défaut) : rechargement à chaud, idéal pour bidouiller les composants ;
      - statique (-Static) : build de production servi en local, c'est exactement
        ce que verront les gens sur la démo publique.

.PARAMETER Port
    Port d'écoute. 6006 par défaut.

.PARAMETER Static
    Construit le Storybook (storybook-static/) et le sert au lieu du serveur de dev.

.PARAMETER Reinstall
    Force une réinstallation propre des dépendances.

.PARAMETER NoOpen
    N'ouvre pas le navigateur automatiquement.

.EXAMPLE
    .\demo.ps1
    Démo en mode dev sur http://localhost:6006

.EXAMPLE
    .\demo.ps1 -Static -Port 8080
    Build de production servi sur http://localhost:8080
#>
[CmdletBinding()]
param(
    [ValidateRange(1024, 65535)]
    [int]$Port = 6006,

    [switch]$Static,
    [switch]$Reinstall,
    [switch]$NoOpen
)

$ErrorActionPreference = 'Stop'
Set-Location -LiteralPath $PSScriptRoot

$MinNodeMajor = 22

function Write-Step { param([string]$Message) Write-Host "==> $Message" -ForegroundColor Cyan }
function Write-Ok   { param([string]$Message) Write-Host "    $Message" -ForegroundColor DarkGray }
function Write-Warn { param([string]$Message) Write-Host "  ! $Message" -ForegroundColor Yellow }

function Fail {
    param([string]$Message, [string]$Hint)
    Write-Host ""
    Write-Host "  X $Message" -ForegroundColor Red
    if ($Hint) { Write-Host "    $Hint" -ForegroundColor Yellow }
    Write-Host ""
    exit 1
}

Write-Host ""
Write-Host "  Altoneo-Charting - mode demo" -ForegroundColor White
Write-Host "  ----------------------------" -ForegroundColor DarkGray
Write-Host ""

# --- 1. Environnement --------------------------------------------------------

Write-Step "Vérification de l'environnement"

if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Fail "Node.js est introuvable." "Installez la version LTS depuis https://nodejs.org puis rouvrez ce terminal."
}
if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
    Fail "npm est introuvable." "Il est fourni avec Node.js — réinstallez Node.js depuis https://nodejs.org."
}

$nodeVersion = (& node -v).Trim()
$nodeMajor = [int](($nodeVersion -replace '^v', '').Split('.')[0])
if ($nodeMajor -lt $MinNodeMajor) {
    Fail "Node $nodeVersion est trop ancien (Storybook 10 et Vite 8 demandent Node $MinNodeMajor+)." "Mettez à jour depuis https://nodejs.org."
}
Write-Ok "Node $nodeVersion / npm $((& npm -v).Trim())"

if (-not (Test-Path -LiteralPath 'package.json')) {
    Fail "package.json introuvable dans $PSScriptRoot." "Placez demo.ps1 à la racine du dépôt Altoneo-Charting."
}

# --- 2. Port libre ? ---------------------------------------------------------

if (Get-Command Get-NetTCPConnection -ErrorAction SilentlyContinue) {
    $busy = Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue
    if ($busy) {
        $owner = (Get-Process -Id $busy[0].OwningProcess -ErrorAction SilentlyContinue).ProcessName
        $who = if ($owner) { " par le processus '$owner'" } else { "" }
        Fail "Le port $Port est déjà utilisé$who." "Fermez ce processus, ou relancez sur un autre port : .\demo.ps1 -Port 6007"
    }
}

# --- 3. Dépendances ----------------------------------------------------------

$needInstall = $Reinstall.IsPresent -or -not (Test-Path -LiteralPath 'node_modules')

if (-not $needInstall -and (Test-Path -LiteralPath 'package-lock.json')) {
    # npm dépose une copie du lock dans node_modules : si l'original est plus
    # récent, c'est que les dépendances ont bougé depuis la dernière install.
    $stamp = 'node_modules\.package-lock.json'
    if (-not (Test-Path -LiteralPath $stamp) -or
        (Get-Item 'package-lock.json').LastWriteTimeUtc -gt (Get-Item $stamp).LastWriteTimeUtc) {
        Write-Warn "package-lock.json a changé depuis la dernière installation."
        $needInstall = $true
    }
}

if ($needInstall) {
    Write-Step "Installation des dépendances (une à deux minutes la première fois)"

    if ($Reinstall -and (Test-Path -LiteralPath 'node_modules')) {
        Write-Ok "Suppression de node_modules..."
        Remove-Item -LiteralPath 'node_modules' -Recurse -Force
    }

    if (Test-Path -LiteralPath 'package-lock.json') {
        & npm ci --no-audit --no-fund
        if ($LASTEXITCODE -ne 0) {
            Write-Warn "npm ci a échoué (lock désynchronisé ?), bascule sur npm install."
            & npm install --no-audit --no-fund
        }
    }
    else {
        & npm install --no-audit --no-fund
    }

    if ($LASTEXITCODE -ne 0) {
        Fail "L'installation des dépendances a échoué." "Regardez le message npm ci-dessus. Sur un réseau d'entreprise, un proxy npm est souvent en cause."
    }
}
else {
    Write-Step "Dépendances déjà installées"
    Write-Ok "Utilisez -Reinstall pour repartir de zéro."
}

# --- 4. Lancement ------------------------------------------------------------

$url = "http://localhost:$Port"

if ($Static) {
    Write-Step "Build statique du Storybook"
    & npm run build-storybook
    if ($LASTEXITCODE -ne 0) { Fail "Le build Storybook a échoué." }

    Write-Host ""
    Write-Step "Démo statique servie sur $url"
    Write-Ok "Ctrl+C pour arrêter."
    Write-Host ""

    if (-not $NoOpen) {
        Start-Job -ScriptBlock { Start-Sleep -Seconds 2; Start-Process $using:url } | Out-Null
    }

    & node 'scripts\serve-storybook-static.mjs' --port $Port
}
else {
    Write-Host ""
    Write-Step "Démarrage de Storybook sur $url"
    Write-Ok "Rechargement à chaud actif — Ctrl+C pour arrêter."
    Write-Host ""

    $sbArgs = @('run', 'storybook', '--', '--port', "$Port")
    if ($NoOpen) { $sbArgs += '--no-open' }
    & npm @sbArgs
}
