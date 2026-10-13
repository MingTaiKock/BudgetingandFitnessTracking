Add-Type -AssemblyName System.Drawing

$project = Split-Path -Parent $PSScriptRoot
$source = Join-Path $project 'assets/references/hamsters-cutouts.png'
$destination = Join-Path $project 'public/characters'
New-Item -ItemType Directory -Path $destination -Force | Out-Null

$sheet = [System.Drawing.Bitmap]::new($source)
try {
  # These rectangles preserve the artist's shapes, expressions, and relative proportions.
  $characters = @(
    @{ Name = 'chonk'; X = 175; Y = 75; Width = 990; Height = 565 },
    @{ Name = 'mochi'; X = 1165; Y = 205; Width = 900; Height = 415 }
  )
  foreach ($character in $characters) {
    $bounds = [System.Drawing.Rectangle]::new($character.X, $character.Y, $character.Width, $character.Height)
    $crop = $sheet.Clone($bounds, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    try {
      $path = Join-Path $destination ($character.Name + '.png')
      $crop.Save($path, [System.Drawing.Imaging.ImageFormat]::Png)
      Write-Output $path
    } finally {
      $crop.Dispose()
    }
  }
} finally {
  $sheet.Dispose()
}
