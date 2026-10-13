param([Parameter(ValueFromRemainingArguments = $true)][string[]]$RiveArgs)
$ErrorActionPreference = 'Stop'
$projectRoot = Split-Path -Parent $PSScriptRoot
$toolHome = Join-Path $projectRoot '.tools/rive'
$exe = Join-Path $toolHome 'bin/rive.exe'
if (-not (Test-Path -LiteralPath $exe)) { throw 'Run scripts/install-rive-local.ps1 first.' }
$previousHome = $env:RIVE_HOME
try {
    $env:RIVE_HOME = $toolHome
    & $exe @RiveArgs
    $riveExitCode = $LASTEXITCODE
} finally {
    $env:RIVE_HOME = $previousHome
}
exit $riveExitCode
