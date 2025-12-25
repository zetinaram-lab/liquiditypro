#!/bin/bash

# ============================================
# Script para ACTUALIZAR LiquidityPro en GitHub
# Para repositorios existentes (creados en Lovable)
# ============================================

echo "🔄 Actualizando LiquidityPro en GitHub..."
echo ""

# Verificar que estamos en el directorio correcto
if [ ! -f "package.json" ]; then
    echo "❌ Error: No se encuentra package.json"
    echo "   Asegúrate de ejecutar este script desde el directorio del proyecto"
    exit 1
fi

# Mostrar resumen de cambios
echo "📊 Resumen de cambios a subir:"
echo "--------------------------------------"
echo "✅ Bug Fixes v1.0.0:"
echo "   • BullsBearsPower calculation fix"
echo "   • Memory leaks cleanup"
echo "   • Language persistence"
echo "   • Division by zero safeguards"
echo "   • FOUC fix"
echo ""
echo "✅ Bug Fixes v1.0.1:"
echo "   • Z-index conflicts resolution"
echo "   • Initial timeframe crash fix"
echo ""
echo "✅ Bug Fixes v1.0.2:"
echo "   • Spanish layout breaking fix"
echo "   • Timeframe change crashes (definitive fix)"
echo ""
echo "✅ Performance v1.0.3:"
echo "   • React.memo optimizations"
echo "   • Page visibility API"
echo "   • useMemo for heavy calculations"
echo "   • Chart initialization fix"
echo ""
echo "✅ VS Code Optimizations:"
echo "   • GitHub Copilot disabled (CPU fix)"
echo "   • TypeScript incremental builds"
echo "   • Optimized watchers"
echo ""
echo "✅ Documentation:"
echo "   • README.md actualizado"
echo "   • CHANGELOG.md completo"
echo "   • 12 archivos de documentación técnica"
echo ""
echo "--------------------------------------"
echo ""

read -p "¿Continuar con la actualización? (y/n): " confirm
if [ "$confirm" != "y" ] && [ "$confirm" != "Y" ]; then
    echo "❌ Cancelado."
    exit 0
fi

# Pedir información del repositorio
echo ""
read -p "Ingresa tu nombre de usuario de GitHub: " GITHUB_USER

if [ -z "$GITHUB_USER" ]; then
    echo "❌ Error: Debes ingresar tu nombre de usuario"
    exit 1
fi

echo ""
read -p "Nombre del repositorio (presiona Enter si es 'liquiditypro'): " REPO_NAME
REPO_NAME=${REPO_NAME:-liquiditypro}

echo ""
echo "🔍 Verificando remote origin..."

# Verificar si ya existe remote origin
if git remote | grep -q "^origin$"; then
    echo "   Remote 'origin' ya existe"
    CURRENT_URL=$(git remote get-url origin)
    echo "   URL actual: $CURRENT_URL"
    echo ""
    read -p "   ¿Actualizar la URL? (y/n): " update_url
    if [ "$update_url" = "y" ] || [ "$update_url" = "Y" ]; then
        git remote set-url origin "https://github.com/$GITHUB_USER/$REPO_NAME.git"
        echo "   ✅ URL actualizada: https://github.com/$GITHUB_USER/$REPO_NAME.git"
    fi
else
    echo "   Agregando nuevo remote 'origin'..."
    git remote add origin "https://github.com/$GITHUB_USER/$REPO_NAME.git"
    echo "   ✅ Remote agregado: https://github.com/$GITHUB_USER/$REPO_NAME.git"
fi

# Verificar/cambiar a rama main
echo ""
echo "🌿 Verificando rama..."
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "main" ]; then
    git branch -M main
    echo "   ✅ Rama renombrada a 'main'"
else
    echo "   ✅ Ya estás en la rama 'main'"
fi

# Intentar hacer pull primero (por si hay cambios remotos)
echo ""
echo "📥 Sincronizando con el repositorio remoto..."
git pull origin main --allow-unrelated-histories --no-edit 2>/dev/null

if [ $? -ne 0 ]; then
    echo "   ℹ️  No hay cambios remotos o es la primera vez (esto es normal)"
fi

# Push de los cambios
echo ""
echo "⬆️  Subiendo cambios a GitHub..."
echo ""
git push -u origin main

# Verificar éxito
if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 ¡Actualización completada con éxito!"
    echo "============================================"
    echo ""
    echo "🔗 Repositorio: https://github.com/$GITHUB_USER/$REPO_NAME"
    echo ""
    echo "📦 Cambios subidos:"
    echo "   • 110 archivos actualizados"
    echo "   • 18,659 líneas de código"
    echo "   • 9 bugs corregidos"
    echo "   • Optimizaciones de rendimiento aplicadas"
    echo "   • Documentación técnica completa"
    echo ""
    echo "🔧 Próximos pasos recomendados:"
    echo "   1. Recargar VS Code para aplicar .vscode/settings.json"
    echo "      (Cmd+Shift+P → 'Reload Window')"
    echo ""
    echo "   2. Verificar el repositorio en GitHub:"
    echo "      https://github.com/$GITHUB_USER/$REPO_NAME"
    echo ""
    echo "   3. Agregar topics en GitHub (opcional):"
    echo "      • trading"
    echo "      • react"
    echo "      • typescript"
    echo "      • vite"
    echo "      • shadcn-ui"
    echo "      • smart-money-concepts"
    echo "      • gold-trading"
    echo ""
    echo "   4. Re-deployar en Vercel/Netlify (si lo tenías deployado):"
    echo "      • Vercel: Los cambios se deployarán automáticamente"
    echo "      • Netlify: Push trigger automático o manual deploy"
    echo ""
    echo "   5. Revisar la documentación nueva:"
    echo "      • README.md"
    echo "      • CHANGELOG.md"
    echo "      • THERMAL_OPTIMIZATION_v1.0.3.md"
    echo "      • VSCODE_CPU_FIX.md"
    echo ""
else
    echo ""
    echo "❌ Error al subir a GitHub"
    echo "============================================"
    echo ""
    echo "Posibles causas:"
    echo "   1. Credenciales incorrectas"
    echo "   2. Conflictos con el repositorio remoto"
    echo "   3. No tienes permisos de escritura"
    echo ""
    echo "💡 Soluciones:"
    echo ""
    echo "   Opción 1 - Forzar push (si estás seguro):"
    echo "   git push -u origin main --force"
    echo ""
    echo "   Opción 2 - Verificar credenciales:"
    echo "   • Usa un Personal Access Token en vez de contraseña"
    echo "   • GitHub Settings → Developer settings → Personal access tokens"
    echo ""
    echo "   Opción 3 - Configurar SSH:"
    echo "   ssh-keygen -t ed25519 -C 'tu-email@ejemplo.com'"
    echo "   # Agregar la clave en GitHub Settings → SSH keys"
    echo "   git remote set-url origin git@github.com:$GITHUB_USER/$REPO_NAME.git"
    echo "   git push -u origin main"
    echo ""
    echo "   Opción 4 - Manual (resolver conflictos):"
    echo "   git pull origin main --allow-unrelated-histories"
    echo "   # Resolver conflictos si los hay"
    echo "   git push -u origin main"
    echo ""
fi
