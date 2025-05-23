Write-Host "🧹 Limpando node_modules, cache e builds..."

# Apagar pastas comuns
$foldersToDelete = @("node_modules", "dist", "build", ".next", ".expo", ".turbo", ".vite", ".cache")
foreach ($folder in $foldersToDelete) {
    if (Test-Path $folder) {
        Remove-Item -Recurse -Force $folder
        Write-Host "✅ Removido: $folder"
    }
}

# Apagar arquivos de lock
$filesToDelete = @("package-lock.json", "yarn.lock", "pnpm-lock.yaml")
foreach ($file in $filesToDelete) {
    if (Test-Path $file) {
        Remove-Item $file -Force
        Write-Host "✅ Removido: $file"
    }
}

# Reinstalar dependências
if (Test-Path "package.json") {
    Write-Host "`n📦 Instalando dependências..."
    if (Test-Path "yarn.lock") {
        yarn install
    } elseif (Test-Path "pnpm-lock.yaml") {
        pnpm install
    } else {
        npm install
    }
} else {
    Write-Host "⚠️ Nenhum package.json encontrado."
}

Write-Host "`n🚀 Limpeza concluída!"
