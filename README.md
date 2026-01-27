# Lolla Toledo Mega Hair

Site e sistema completo para a marca **Lolla Toledo Mega Hair**, com estética premium de salão de luxo, foco em Mega Hair e painel administrativo.

## 🎨 Identidade visual

- **Cores:** Preto `#000`, branco `#fff`, dourado `#c5a05a`, marrom premium `#3b2f2f`
- **Tipografia:** Playfair Display (títulos), Inter (textos)
- **Estilo:** Luxuoso, feminino, elegante, cinematográfico

## 🛠 Tecnologias

- **Front:** Next.js 14 (App Router), Tailwind CSS, componentes estilo shadcn/ui
- **Back:** API Routes (Next.js), armazenamento em JSON na pasta `data/` (embutido, sem banco externo)
- **Auth:** JWT (jose) + cookie `auth`
- **Integrações:** WhatsApp (link configurável), preparado para Cloudinary e Google Maps

## 📁 Estrutura

- **Site público:** `/` (home), `/catalogo`, `/sobre`, `/servicos`, `/agendar`
- **Admin:** `/admin` → login; `/admin/dashboard` → produtos, serviços, depoimentos, antes/depois, banners, agenda
- **APIs:** `/api/auth/login|logout|me`, `/api/admin/products|services|testimonials|banners|before-after|appointments`

## 🚀 Como rodar

```bash
npm install
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000).

### Primeiro acesso ao admin

- **URL:** [http://localhost:3000/admin](http://localhost:3000/admin)
- **Login:** `admin@lollatoledo.com`
- **Senha:** `admin123`

(O usuário é criado automaticamente na primeira requisição de login se o arquivo `data/admins.json` ainda não existir.)

## ⚙ Configuração

### WhatsApp

Edite `src/lib/utils.ts`:

```ts
export const WHATSAPP_NUMBER = "5543999999999"; // DDD + número, sem símbolos
```

### Imagens

- **Hero e Sobre:** Por padrão usam uma imagem de referência (Unsplash). Troque pelas suas fotos:
  - Coloque `hero.jpg` e `about.jpg` em `public/` e use `/hero.jpg` e `/about.jpg` nos componentes, **ou**
  - Use URLs do Cloudinary/outro CDN e adicione o domínio em `next.config.mjs` → `images.remotePatterns`.
- **Produtos/Serviços/Depoimentos:** No admin, use URLs de imagem (ex.: Cloudinary).

### JWT (produção)

Defina a variável de ambiente:

```bash
JWT_SECRET=uma-chave-secreta-longa-e-aleatoria
```

## 📦 Build

```bash
npm run build
npm start
```

## 📄 Licença

Projeto privado — Lolla Toledo Mega Hair.
