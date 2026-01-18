# ⚠️ Instruções para Ativar GitHub Pages

Se a página ainda não está funcionando no GitHub Pages, siga estes passos:

## 1️⃣ Acesse as configurações do repositório

Abra: https://github.com/vitaledev/projeto-curso-de-geopolitica/settings/pages

## 2️⃣ Configure GitHub Pages

Na página de "Pages":
- Seção: **"Build and deployment"**
- Source: Selecione **"GitHub Actions"** (não "Deploy from a branch")
- Clique em **Save**

## 3️⃣ Acompanhe o deploy

Vá para: https://github.com/vitaledev/projeto-curso-de-geopolitica/actions

Você verá um workflow chamado "Deploy to GitHub Pages" sendo executado.

Quando terminar com ✅, seu site estará disponível em:
**https://vitaledev.github.io/projeto-curso-de-geopolitica/**

## 4️⃣ Verifyar se funcionou

Dentro de 2-5 minutos, acesse:
https://vitaledev.github.io/projeto-curso-de-geopolitica/

Se ainda não funcionar:
1. Limpe o cache do navegador (Ctrl+Shift+Delete)
2. Aguarde alguns minutos
3. Tente novamente

## 📝 Notas

- O workflow é executado automaticamente a cada push para `main`
- Não é necessário nenhum secret ou configuração adicional
- O site é publicado a partir da pasta `dist/` após o build
