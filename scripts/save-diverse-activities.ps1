$ErrorActionPreference = 'Stop'
$projectRoot = Split-Path -Parent $PSScriptRoot
$destination = Join-Path $projectRoot 'output/characters/diverse-activities'
New-Item -ItemType Directory -Force -Path $destination | Out-Null
$generatedRoot = 'C:\Users\KOCK MING TAI\.codex\generated_images\01a111e0-0987-7ee3-8d3d-9bd848ba156f'
$files = @{
    'mochi-move-v1.png' = 'exec-be37c976-3f1e-4f75-b1a1-2c49eb52dfab.png'
    'chonk-move-v1.png' = 'exec-b24dc305-3cb7-448a-8b26-c232172ec718.png'
    'mochi-cozy-v1.png' = 'exec-99bd84be-5f44-49a3-b583-80ccaa5a7094.png'
    'chonk-cozy-v1.png' = 'exec-7cbf6c75-2ef9-4238-8694-fcf1f4a290d0.png'
    'mochi-little-adventures-v1.png' = 'exec-b21051c2-b037-4640-bd8b-2d3bcf5d8b7b.png'
    'chonk-little-adventures-v1.png' = 'exec-887dec0c-2df7-4ea0-8ee8-b4d9d6c3537a.png'
}
Add-Type -AssemblyName System.Drawing
foreach ($name in $files.Keys) {
    $target = Join-Path $destination $name
    Copy-Item -LiteralPath (Join-Path $generatedRoot $files[$name]) -Destination $target -Force
    $bitmap = [Drawing.Bitmap]::FromFile($target)
    try {
        Write-Output "$name : $($bitmap.Width)x$($bitmap.Height), $($bitmap.PixelFormat), corner alpha=$($bitmap.GetPixel(0,0).A)"
    } finally { $bitmap.Dispose() }
}
