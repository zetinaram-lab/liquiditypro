#!/bin/bash

# ============================================
# Script para subir LiquidityPro a GitHub
# ============================================

echo "🚀 Subiendo LiquidityPro a GitHub..."
echo ""

# Paso 1: Crear el repositorio en GitHub
echo "📝 Paso 1: Crear repositorio en GitHub"
echo "--------------------------------------"
echo "Ve a: https://github.com/new"
echo ""
echo "Configuración recomendada:"
echo "  • Repository name: liquiditypro"
echo "  • Description: Professional Gold Trading Dashboard with Smart Money Concepts - React + TypeScript + Vite"
echo "  • Visibility: Public (o Private si prefieres)"
echo "  • ❌ NO inicialices con README, .gitignore, o license (ya los tenemos)"
echo ""
read -p "¿Ya creaste el repositorio? (presiona Enter cuando esté listo)"

# Paso 2: Pedir el nombre de usuario de GitHub
echo ""
echo "📋 Paso 2: Información de GitHub"
echo "--------------------------------------"
read -p "Ingresa tu nombre de usuario de GitHub: " GITHUB_USER

# Paso 3: Agregar remote
echo ""
echo "🔗 Paso 3: Conectando con GitHub..."
git remote add origin https://github.com/$GITHUB_USER/liquiditypro.git
echo "✅ Remote agregado: https://github.com/$GITHUB_USER/liquiditypro.git"

# Paso 4: Cambiar rama a main (si es necesario)
echo ""
echo "🌿 Paso 4: Verificando rama..."
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "main" ]; then
  git branch -M main
  echo "✅ Rama renombrada a 'main'"
else
  echo "✅ Ya estás en la rama 'main'"
fi

# Paso 5: Push a GitHub
echo ""
echo "⬆️  Paso 5: Subiendo a GitHub..."
git push -u origin main

# Verificar si fue exitoso
if [ $? -eq 0 ]; then
  echo ""
  echo "🎉 ¡Éxito! Tu proyecto está en GitHub"
  echo "--------------------------------------"
  echo "🔗 Repositorio: https://github.com/$GITHUB_USER/liquiditypro"
  echo ""
  echo "📋 Próximos pasos:"
  echo "  1. Edita el README.md en GitHub si quieres añadir más info"
  echo "  2. Agrega topics/tags: trading, react, typescript, vite, shadcn-ui"
  echo "  3. Considera añadir un screenshot del dashboard"
  echo "  4. Opcional: Despliega en Vercel o Netlify"
  echo ""
else
  echo ""
  echo "❌ Error al subir a GitHub"
  echo "--------------------------------------"
  echo "Posibles causas:"
  echo "  1. Credenciales incorrectas"
  echo "  2. El repositorio no existe"
  echo "  3. No tienes permisos"
  echo ""
  echo "💡 Solución manual:"
  echo "  git remote remove origin"
  echo "  git remote add origin https://github.com/$GITHUB_USER/liquiditypro.git"
  echo "  git push -u origin main"
fi
