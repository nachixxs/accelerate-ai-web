# Prepara un worktree nuevo de este repo (sesión de Claude Desktop o `git worktree add` a mano).
# - Copia del checkout principal los archivos ignorados que lista .worktreeinclude (hoy, CLAUDE.md),
#   si no llegaron ya.
# - Instala las dependencias del lockfile: cada worktree tiene su node_modules, no se comparte.
# Uso, desde la raíz del worktree: pwsh scripts/setup-worktree.ps1
$ErrorActionPreference = 'Stop'
Set-Location (git rev-parse --show-toplevel)

# La primera entrada de `git worktree list` es siempre el checkout principal.
$principal = (git worktree list --porcelain | Select-Object -First 1) -replace '^worktree ', ''
Get-Content .worktreeinclude | Where-Object { $_ -and -not $_.StartsWith('#') } | ForEach-Object {
	$origen = Join-Path $principal $_
	if (-not (Test-Path $_) -and (Test-Path $origen)) {
		Copy-Item $origen $_
		Write-Host "Copiado del checkout principal: $_"
	}
}

npm ci
exit $LASTEXITCODE
