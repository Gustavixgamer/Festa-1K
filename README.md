# 🎉 Festa de 1.000 seguidores — Geração Eucaristia

Site pronto para publicar, com formulário de confirmação de presença
ligado a um banco de dados de verdade (Postgres). Feito para rodar de
graça no Vercel.

## O que tem aqui

- `index.html`, `styles.css`, `script.js` — o site em si
- `config.js` — **o único arquivo que você provavelmente vai precisar
  editar** (data, horário, local, Instagram, mensagem da festa)
- `api/rsvp.js` — recebe as confirmações e salva no banco de dados
- `api/export.js` — baixa a lista de confirmados em CSV (planilha)

## 1. Edite as informações da festa

Abra o arquivo `config.js` num editor de texto qualquer (até o Bloco
de Notas serve) e troque os textos entre aspas pelas informações
reais — data, horário, local, @ do Instagram e a mensagem que aparece
na tela inicial. Salve o arquivo. Dá para editar de novo quantas
vezes quiser, antes ou depois de publicar.

## 2. Publique no Vercel

Você vai precisar de uma conta gratuita em [vercel.com](https://vercel.com).

**Caminho mais rápido (sem precisar de GitHub):**

1. Instale o Node.js, se ainda não tiver: [nodejs.org](https://nodejs.org)
2. Abra o terminal dentro da pasta do projeto
3. Rode:
   ```
   npx vercel
   ```
4. Faça login quando ele pedir (abre o navegador) e vá respondendo
   as perguntas com a opção padrão (Enter, Enter, Enter…)
5. No final, rode `npx vercel --prod` para publicar a versão
   definitiva — o primeiro `vercel` sozinho só cria uma prévia

**Caminho recomendado se for atualizar o site depois:**

1. Suba esta pasta para um repositório no GitHub
2. Em [vercel.com/new](https://vercel.com/new), clique em "Import" e
   selecione o repositório
3. Clique em "Deploy" — o Vercel identifica sozinho que é um site
   estático com uma API, não precisa mudar nenhuma configuração

## 3. Ative o banco de dados

Esse passo é o que faz as inscrições serem realmente guardadas. Sem
ele, o site fica no ar e o formulário aparece normal, mas ninguém
consegue confirmar presença.

1. No painel do Vercel, entre no projeto que você acabou de criar
2. Vá em **Storage** (ou **Marketplace**, dependendo da versão do
   painel) → **Create Database** / **Connect Store**
3. Escolha **Neon** (é a opção de banco de dados Postgres) e siga o
   passo a passo — é gratuito para o tamanho desse projeto
4. O Vercel conecta tudo sozinho, sem senha nenhuma para copiar

Depois disso, publique de novo (`npx vercel --prod`, ou um novo
commit/push se estiver usando GitHub) para o site enxergar o banco.
A tabela é criada sozinha assim que a primeira pessoa confirmar
presença — ninguém precisa escrever nenhum comando SQL.

## 4. Ver ou baixar a lista de confirmados

Duas formas:

- **Pelo painel do Vercel**: Storage → o banco Neon que você criou →
  a aba de dados mostra as inscrições em forma de tabela.
- **Pelo site**: vá em Project Settings → Environment Variables e
  crie `ADMIN_KEY` com uma senha à sua escolha. Depois acesse
  `https://seu-site.vercel.app/api/export?key=SUASENHA` para baixar
  um CSV que abre direto no Excel ou Google Planilhas.

## Sobre os dados que vocês vão coletar

O formulário guarda nome, WhatsApp e Instagram de quem confirmar
presença. Combinar com o grupo que esses dados só servem para
organizar a festa e avisar sobre novidades dela evita dor de cabeça
depois.

## Se algo não funcionar

- **Formulário dá erro ao confirmar presença** → confira se o banco
  de dados foi criado (passo 3) e se você publicou de novo depois de
  criá-lo.
- **Quer mudar as cores** → estão todas no topo do `styles.css`, no
  bloco `:root`.
- **Quer trocar a imagem que aparece quando o link é compartilhado**
  → coloque um arquivo chamado `og-image.jpg` (1200×630px) na mesma
  pasta do `index.html`.
