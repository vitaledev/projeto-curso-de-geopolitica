<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Curso de Geopolítica - Módulo 1

Este é um aplicativo interativo de geopolítica com um tutor assistido por IA usando Google Gemini.

## 🌐 Acesso Online

A aplicação está hospedada no GitHub Pages: https://vitaledev.github.io/projeto-curso-de-geopolitica/

O deploy automático ocorre a cada push para a branch `main`.

## 📋 Pré-requisitos

- Node.js (v18+)
- npm ou yarn

## 🚀 Como rodar localmente

1. Clone o repositório:
   ```bash
   git clone https://github.com/vitaledev/projeto-curso-de-geopolitica.git
   cd projeto-curso-de-geopolitica
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Configure sua chave de API do Gemini:
   - Crie um arquivo `.env.local` na raiz do projeto
   - Adicione sua chave: `GEMINI_API_KEY=sua_chave_aqui`
   - Obtenha uma chave em: https://ai.google.dev/

4. Execute o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```
   A aplicação estará disponível em `http://localhost:3000`

## 📦 Build para produção

```bash
npm run build
npm run preview
```

## 🔐 Configurar o GitHub Pages

Para que o deploy automático funcione:

1. Vá para as configurações do repositório no GitHub
2. Em "Pages" > "Build and deployment"
3. Selecione "GitHub Actions" como source
4. Configure o secret `GEMINI_API_KEY` nas variáveis de ambiente:
   - Vá para Settings > Secrets and variables > Actions
   - Clique em "New repository secret"
   - Nome: `GEMINI_API_KEY`
   - Valor: Sua chave de API do Gemini

## 🛠️ Stack Tecnológico

- React 19
- TypeScript
- Vite
- Google Generative AI (Gemini)
- Tailwind CSS
