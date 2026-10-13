$ErrorActionPreference = 'Stop'
$projectRoot = Split-Path -Parent $PSScriptRoot
$destination = Join-Path $projectRoot 'output/characters/gym-equipment'
New-Item -ItemType Directory -Force -Path $destination | Out-Null
$generatedRoot = 'C:\Users\KOCK MING TAI\.codex\generated_images\01a111e0-0987-7ee3-8d3d-9bd848ba156f'
$files = @{
    'mochi-weights-v1.png' = 'exec-97aa1b99-a3fa-4672-8b31-044a201e6c79.png'
    'chonk-weights-v1.png' = 'exec-bdd79a62-530c-4ba2-b01e-761b5d2a3390.png'
    'mochi-machines-v1.png' = 'exec-2435afc2-75b0-415e-bda9-5c31a3266bf4.png'
    'chonk-machines-v1.png' = 'exec-59e4f24e-cf7d-4b38-9195-d54bc5cbce79.png'
    'mochi-cardio-v1.png' = 'exec-2a257d72-58a3-433d-8518-fa911cf5b6e6.png'
    'chonk-functional-v1.png' = 'exec-2ea448d9-9403-4b10-88ec-caff1b7f5dae.png'
}
Add-Type -AssemblyName System.Drawing
foreach ($name in $files.Keys) {
    $target = Join-Path $destination $name
    Copy-Item -LiteralPath (Join-Path $generatedRoot $files[$name]) -Destination $target -Force
    $bitmap = [Drawing.Bitmap]::FromFile($target)
    try { Write-Output "$name : $($bitmap.Width)x$($bitmap.Height), alpha=$($bitmap.GetPixel(0,0).A)" }
    finally { $bitmap.Dispose() }
}
