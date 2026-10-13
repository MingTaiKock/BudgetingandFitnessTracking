$ErrorActionPreference = 'Stop'
$projectRoot = Split-Path -Parent $PSScriptRoot
$destination = Join-Path $projectRoot 'output/characters/animation-keyposes'
New-Item -ItemType Directory -Force -Path $destination | Out-Null
$generatedRoot = 'C:\Users\KOCK MING TAI\.codex\generated_images\01a111e0-0987-7ee3-8d3d-9bd848ba156f'
$files = @{
    'mochi-cheer-six-frames-v1.png' = 'exec-94ee37df-4b0b-47f1-86ce-5cdda6f83f94.png'
    'chonk-wave-six-frames-v1.png' = 'exec-922008e7-d3f6-4d3c-8926-29d26fb6b07d.png'
}
Add-Type -AssemblyName System.Drawing
foreach ($name in $files.Keys) {
    $target = Join-Path $destination $name
    Copy-Item -LiteralPath (Join-Path $generatedRoot $files[$name]) -Destination $target -Force
    $bitmap = [Drawing.Bitmap]::FromFile($target)
    try {
        Write-Output "$name : $($bitmap.Width)x$($bitmap.Height), $($bitmap.PixelFormat), corner alpha=$($bitmap.GetPixel(0,0).A)"
        if ($bitmap.Width -ne 1536 -or $bitmap.Height -ne 1024) { throw 'Unexpected dimensions; update layout notes before using this sheet.' }
    } finally { $bitmap.Dispose() }
}
