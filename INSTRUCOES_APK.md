# Instruções para Gerar APK do Sistema de Equipamentos

## Resumo das Correções Realizadas

✅ **Problemas Corrigidos:**
1. **Integração com Supabase**: Modificado `server/storage.ts` para usar Drizzle ORM com fallback para armazenamento em memória
2. **CORS**: Adicionado suporte a CORS no servidor para permitir acesso de aplicações móveis
3. **Rota de Equipamentos**: Corrigida rota `/equipamentos/novo` no `App.tsx`
4. **Configuração do Servidor**: Modificado para aceitar conexões externas (`0.0.0.0`)

✅ **Funcionalidades Testadas:**
- ✅ Criação de clientes
- ✅ Criação de equipamentos (computadores e UPS/nobreaks)
- ✅ Dashboard com estatísticas atualizadas
- ✅ Sistema de numeração automática (P0001 para computadores, N0001 para UPS)

## Configuração do APK com Capacitor

O projeto já foi configurado com Capacitor para gerar APK. Os arquivos necessários estão prontos:

### Arquivos Criados:
- `capacitor.config.ts` - Configuração do Capacitor
- `android/` - Projeto Android nativo gerado
- `dist/public/` - Build da aplicação web

### Para Gerar o APK:

#### Pré-requisitos:
1. **Android Studio** instalado
2. **Java JDK 11+** (já verificado no sistema)
3. **Android SDK** configurado

#### Passos:

1. **Instalar dependências do Capacitor** (já feito):
```bash
npm install @capacitor/core @capacitor/cli @capacitor/android --legacy-peer-deps
```

2. **Fazer build da aplicação** (já feito):
```bash
npm run build
```

3. **Sincronizar com Android** (já feito):
```bash
npx cap sync android
```

4. **Gerar APK**:
```bash
cd android
./gradlew assembleDebug
```

5. **Localizar o APK gerado**:
O APK será criado em: `android/app/build/outputs/apk/debug/app-debug.apk`

### Alternativa - Usando Android Studio:

1. Abrir o projeto Android no Android Studio:
```bash
npx cap open android
```

2. No Android Studio:
   - Build → Build Bundle(s) / APK(s) → Build APK(s)
   - Aguardar a compilação
   - O APK será gerado na pasta `app/build/outputs/apk/debug/`

## Configuração do Supabase

Para usar o banco de dados Supabase em produção:

1. **Criar projeto no Supabase**
2. **Atualizar `.env`** com a URL correta:
```env
DATABASE_URL="postgresql://postgres:SUA_SENHA@SEU_PROJETO.supabase.co:5432/postgres"
```

3. **Executar migrações**:
```bash
npm run db:push
```

## Estrutura do Projeto

```
├── client/                 # Frontend React
├── server/                 # Backend Express
├── shared/                 # Schemas compartilhados
├── android/                # Projeto Android (Capacitor)
├── dist/                   # Build da aplicação
├── capacitor.config.ts     # Configuração do Capacitor
└── package.json           # Dependências
```

## Funcionalidades da Aplicação

### Dashboard
- Estatísticas em tempo real
- Total de clientes e equipamentos
- Separação por tipo (computadores/UPS)
- Lista de equipamentos recentes

### Gestão de Clientes
- Criar, editar e excluir clientes
- Busca e filtros
- Validação de dados

### Gestão de Equipamentos
- Criar equipamentos (computadores e UPS/nobreaks)
- Numeração automática (P0001, N0001, etc.)
- Campos específicos por tipo:
  - **Computadores**: Operador/usuário
  - **UPS/Nobreaks**: Data da bateria
- Busca e filtros por tipo e cliente
- Edição e exclusão

### Características Técnicas
- **Frontend**: React + TypeScript + Tailwind CSS + shadcn/ui
- **Backend**: Express + TypeScript + Drizzle ORM
- **Banco**: PostgreSQL (Supabase) com fallback para memória
- **Mobile**: Capacitor para geração de APK
- **Autenticação**: Sistema mock (pode ser expandido)

## Próximos Passos

1. **Configurar Supabase** com suas credenciais
2. **Gerar APK** seguindo as instruções acima
3. **Testar APK** em dispositivo Android
4. **Implementar autenticação real** se necessário
5. **Adicionar funcionalidades extras** conforme necessidade

## Suporte

O projeto está totalmente funcional e testado. Todas as rotas estão funcionando corretamente e a integração com o banco de dados está implementada com fallback para armazenamento em memória.

