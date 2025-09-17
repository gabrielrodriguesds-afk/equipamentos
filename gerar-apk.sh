#!/bin/bash

echo "🚀 Iniciando processo de geração do APK..."

# Verificar se o Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "❌ Node.js não encontrado. Por favor, instale o Node.js primeiro."
    exit 1
fi

# Verificar se o Java está instalado
if ! command -v java &> /dev/null; then
    echo "❌ Java não encontrado. Por favor, instale o Java JDK 11+ primeiro."
    exit 1
fi

echo "✅ Pré-requisitos verificados"

# Verificar se a URL da API está configurada
if [ -f ".env.production" ]; then
    API_URL=$(grep "VITE_API_BASE_URL" .env.production | cut -d '=' -f2)
    if [ "$API_URL" = "http://localhost:5000" ]; then
        echo "⚠️  ATENÇÃO: A URL da API ainda está configurada para localhost!"
        echo "   Para que o APK funcione corretamente, você precisa:"
        echo "   1. Expor seu backend para a internet (ex: usando ngrok)"
        echo "   2. Editar o arquivo .env.production com a URL correta"
        echo "   3. Executar este script novamente"
        echo ""
        echo "   Exemplo de configuração no .env.production:"
        echo "   VITE_API_BASE_URL=https://abcdef12345.ngrok.io"
        echo ""
        read -p "Deseja continuar mesmo assim? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            echo "❌ Processo cancelado. Configure a URL da API primeiro."
            exit 1
        fi
    else
        echo "✅ URL da API configurada: $API_URL"
    fi
else
    echo "⚠️  Arquivo .env.production não encontrado. Usando configuração padrão (localhost)."
fi

# Instalar dependências se necessário
echo "📦 Verificando dependências..."
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependências..."
    npm install --legacy-peer-deps
fi

# Fazer build da aplicação
echo "🔨 Fazendo build da aplicação..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Erro no build da aplicação"
    exit 1
fi

# Sincronizar com Capacitor
echo "🔄 Sincronizando com Capacitor..."
npx cap sync android

if [ $? -ne 0 ]; then
    echo "❌ Erro na sincronização com Capacitor"
    exit 1
fi

# Gerar APK
echo "📱 Gerando APK..."
cd android

# Verificar se o gradlew existe
if [ ! -f "./gradlew" ]; then
    echo "❌ Gradle wrapper não encontrado. Verifique se o projeto Android foi criado corretamente."
    exit 1
fi

# Tornar o gradlew executável
chmod +x ./gradlew

# Gerar APK debug
echo "🔨 Compilando APK..."
./gradlew assembleDebug

if [ $? -eq 0 ]; then
    echo "✅ APK gerado com sucesso!"
    echo "📍 Localização: android/app/build/outputs/apk/debug/app-debug.apk"
    
    # Verificar se o APK foi criado
    if [ -f "app/build/outputs/apk/debug/app-debug.apk" ]; then
        echo "📱 APK encontrado e pronto para instalação!"
        echo "📏 Tamanho do APK:"
        ls -lh app/build/outputs/apk/debug/app-debug.apk
        
        # Mostrar informações importantes
        echo ""
        echo "🔧 IMPORTANTE para o funcionamento do APK:"
        if [ -f "../.env.production" ]; then
            API_URL=$(grep "VITE_API_BASE_URL" ../.env.production | cut -d '=' -f2)
            echo "   📡 URL da API configurada: $API_URL"
            if [ "$API_URL" = "http://localhost:5000" ]; then
                echo "   ⚠️  O APK não funcionará com localhost!"
                echo "   📋 Para corrigir:"
                echo "      1. Exponha seu backend (ex: ngrok http 5000)"
                echo "      2. Edite .env.production com a URL correta"
                echo "      3. Execute este script novamente"
            else
                echo "   ✅ Certifique-se de que seu backend está rodando em: $API_URL"
            fi
        fi
    else
        echo "⚠️  APK não encontrado no local esperado. Verifique os logs acima."
    fi
else
    echo "❌ Erro na geração do APK. Verifique os logs acima."
    echo "💡 Dica: Tente usar o Android Studio para compilar o projeto."
    exit 1
fi

echo ""
echo "🎉 Processo concluído!"
echo "📱 Para instalar o APK no seu dispositivo:"
echo "   1. Ative 'Fontes desconhecidas' nas configurações do Android"
echo "   2. Transfira o APK para o dispositivo"
echo "   3. Abra o arquivo APK no dispositivo para instalar"

