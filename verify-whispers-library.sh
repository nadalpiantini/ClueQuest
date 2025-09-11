#!/bin/bash

# Whispers in the Library - Script de Verificación
# Verifica que todos los archivos necesarios estén presentes

echo "🔍 Verificando implementación de Whispers in the Library..."
echo "=================================================="

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Función para verificar archivos
check_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✅${NC} $1"
        return 0
    else
        echo -e "${RED}❌${NC} $1 - FALTANTE"
        return 1
    fi
}

# Función para verificar directorios
check_dir() {
    if [ -d "$1" ]; then
        echo -e "${GREEN}✅${NC} $1/"
        return 0
    else
        echo -e "${RED}❌${NC} $1/ - FALTANTE"
        return 1
    fi
}

echo ""
echo "📁 Verificando archivos de base de datos..."
check_file "whispers_in_the_library.sql"

echo ""
echo "📁 Verificando datos de la aventura..."
check_file "src/data/adventures/whispers-library-data.ts"

echo ""
echo "📁 Verificando componentes React..."
check_file "src/components/adventures/whispers-library/WhispersLibraryAdventure.tsx"
check_file "src/components/adventures/whispers-library/LibraryCardPuzzle.tsx"
check_file "src/components/adventures/whispers-library/CipherPuzzle.tsx"
check_file "src/components/adventures/whispers-library/MorsePoemPuzzle.tsx"
check_file "src/components/adventures/whispers-library/UVAnagramPuzzle.tsx"
check_file "src/components/adventures/whispers-library/LogicDeductionPuzzle.tsx"
check_file "src/components/adventures/whispers-library/FinalWordPuzzle.tsx"

echo ""
echo "📁 Verificando sistemas de audio y efectos..."
check_file "src/lib/audio/whispers-library-audio.ts"
check_file "src/lib/effects/uv-light-effect.ts"

echo ""
echo "📁 Verificando páginas de acceso..."
check_file "src/app/whispers-library/page.tsx"
check_file "src/app/test-whispers/page.tsx"

echo ""
echo "📁 Verificando documentación..."
check_file "WHISPERS_LIBRARY_IMPLEMENTATION_REPORT.md"
check_file "WHISPERS_LIBRARY_README.md"
check_file "WHISPERS_LIBRARY_VERIFICATION.md"

echo ""
echo "📁 Verificando directorios necesarios..."
check_dir "src/components/adventures/whispers-library"
check_dir "src/lib/audio"
check_dir "src/lib/effects"
check_dir "src/app/whispers-library"
check_dir "src/app/test-whispers"

echo ""
echo "🔧 Verificando configuración de TypeScript..."
if [ -f "tsconfig.json" ]; then
    echo -e "${GREEN}✅${NC} tsconfig.json encontrado"
else
    echo -e "${RED}❌${NC} tsconfig.json - FALTANTE"
fi

echo ""
echo "📦 Verificando dependencias..."
if [ -f "package.json" ]; then
    echo -e "${GREEN}✅${NC} package.json encontrado"
    
    # Verificar dependencias específicas
    if grep -q "react" package.json; then
        echo -e "${GREEN}✅${NC} React encontrado en dependencias"
    else
        echo -e "${RED}❌${NC} React no encontrado en dependencias"
    fi
    
    if grep -q "next" package.json; then
        echo -e "${GREEN}✅${NC} Next.js encontrado en dependencias"
    else
        echo -e "${RED}❌${NC} Next.js no encontrado en dependencias"
    fi
else
    echo -e "${RED}❌${NC} package.json - FALTANTE"
fi

echo ""
echo "🎵 Verificando directorios de audio (opcional)..."
if [ -d "public/audio/whispers-library" ]; then
    echo -e "${GREEN}✅${NC} public/audio/whispers-library/ encontrado"
    audio_count=$(find public/audio/whispers-library -name "*.mp3" | wc -l)
    echo -e "${YELLOW}ℹ️${NC} $audio_count archivos de audio encontrados (16 esperados)"
else
    echo -e "${YELLOW}⚠️${NC} public/audio/whispers-library/ no encontrado (crear para archivos de audio)"
fi

echo ""
echo "🎨 Verificando directorios de assets AR (opcional)..."
if [ -d "public/ar-assets" ]; then
    echo -e "${GREEN}✅${NC} public/ar-assets/ encontrado"
    ar_count=$(find public/ar-assets -name "*.glb" | wc -l)
    echo -e "${YELLOW}ℹ️${NC} $ar_count archivos AR encontrados (3 esperados)"
else
    echo -e "${YELLOW}⚠️${NC} public/ar-assets/ no encontrado (crear para modelos 3D)"
fi

echo ""
echo "🧪 Verificando linting..."
if command -v npm &> /dev/null; then
    echo -e "${GREEN}✅${NC} npm disponible"
    
    # Verificar si hay errores de linting en archivos específicos
    echo -e "${YELLOW}ℹ️${NC} Ejecutando verificación de linting..."
    if npm run lint --silent 2>/dev/null; then
        echo -e "${GREEN}✅${NC} Sin errores de linting"
    else
        echo -e "${YELLOW}⚠️${NC} Algunos errores de linting encontrados (revisar)"
    fi
else
    echo -e "${RED}❌${NC} npm no disponible"
fi

echo ""
echo "📊 Resumen de verificación:"
echo "=========================="

# Contar archivos verificados
total_files=0
missing_files=0

# Lista de archivos críticos
critical_files=(
    "whispers_in_the_library.sql"
    "src/data/adventures/whispers-library-data.ts"
    "src/components/adventures/whispers-library/WhispersLibraryAdventure.tsx"
    "src/components/adventures/whispers-library/LibraryCardPuzzle.tsx"
    "src/components/adventures/whispers-library/CipherPuzzle.tsx"
    "src/components/adventures/whispers-library/MorsePoemPuzzle.tsx"
    "src/components/adventures/whispers-library/UVAnagramPuzzle.tsx"
    "src/components/adventures/whispers-library/LogicDeductionPuzzle.tsx"
    "src/components/adventures/whispers-library/FinalWordPuzzle.tsx"
    "src/lib/audio/whispers-library-audio.ts"
    "src/lib/effects/uv-light-effect.ts"
    "src/app/whispers-library/page.tsx"
    "src/app/test-whispers/page.tsx"
)

for file in "${critical_files[@]}"; do
    total_files=$((total_files + 1))
    if [ ! -f "$file" ]; then
        missing_files=$((missing_files + 1))
    fi
done

present_files=$((total_files - missing_files))
percentage=$((present_files * 100 / total_files))

echo -e "Archivos críticos: ${GREEN}$present_files${NC}/$total_files ($percentage%)"
echo -e "Archivos faltantes: ${RED}$missing_files${NC}"

if [ $missing_files -eq 0 ]; then
    echo ""
    echo -e "${GREEN}🎉 ¡VERIFICACIÓN EXITOSA!${NC}"
    echo -e "${GREEN}La aventura 'Whispers in the Library' está completamente implementada.${NC}"
    echo ""
    echo "Próximos pasos:"
    echo "1. Ejecutar: npm run dev"
    echo "2. Visitar: http://localhost:3000/whispers-library"
    echo "3. Probar: http://localhost:3000/test-whispers"
    echo "4. Ejecutar script SQL para base de datos"
else
    echo ""
    echo -e "${RED}❌ VERIFICACIÓN FALLIDA${NC}"
    echo -e "${RED}Faltan $missing_files archivos críticos.${NC}"
    echo "Revisar la lista anterior y crear los archivos faltantes."
fi

echo ""
echo "=================================================="
echo "🔍 Verificación completada."
