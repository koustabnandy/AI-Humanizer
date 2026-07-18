# 🚀 WriteFlow AI – AI Humanizer & Text Rewriter

WriteFlow AI is a modern AI-powered text rewriting and humanization platform built with **Next.js**, **Prisma**, and **PostgreSQL**. It transforms AI-generated or formal text into more natural, human-like content while allowing users to customize tone, length, creativity, and AI model provider.

---

## 🌟 Features

- ✨ AI-powered text rewriting
- 🤖 Humanize AI-generated content
- 🎯 Customizable tone (Professional, Casual, Friendly, etc.)
- 📏 Adjustable output length
- 🎨 Creativity control
- 🔄 Multiple AI provider support
- 📜 Rewrite history tracking
- 💳 Subscription-based word usage system
- 📊 Word token management
- ⚡ Fast API built with Next.js App Router
- ☁️ Cloud PostgreSQL database using Neon
- 🔒 Ready for authentication integration

---

## 🛠 Tech Stack

### Frontend
- Next.js 15
- React
- TypeScript
- Tailwind CSS

### Backend
- Next.js API Routes
- Prisma ORM
- PostgreSQL (Neon)

### AI
- OpenRouter API
- OpenAI Compatible APIs

### Database
- Neon PostgreSQL

### Deployment
- Vercel

---

## 📂 Project Structure

```
src/
│
├── app/
│   ├── api/
│   │   ├── rewrite/
│   │   └── webhooks/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
│
├── components/
│   ├── rewrite-workspace.tsx
│   └── ui/
│
├── hooks/
│
└── lib/
    ├── ai-providers.ts
    ├── db.ts
    └── stripe.ts

prisma/
└── schema.prisma
```

---

## ⚙️ Installation

Clone the repository

```bash
git clone https://github.com/koustabnandy/AI-Humanizer.git
```

Go to project directory

```bash
cd AI-Humanizer
```

Install dependencies

```bash
npm install
```

---

## 🔐 Environment Variables

Create a `.env` file in the project root.

Example:

```env
DATABASE_URL=your_neon_postgresql_url

OPENROUTER_API_KEY=your_openrouter_key

OPENAI_API_KEY=your_openai_key

STRIPE_SECRET_KEY=your_stripe_secret_key

STRIPE_WEBHOOK_SECRET=your_webhook_secret
```

> **Never commit your `.env` file to GitHub.**

---

## 🗄 Database Setup

Generate Prisma Client

```bash
npx prisma generate
```

Push schema

```bash
npx prisma db push
```

(Optional)

Open Prisma Studio

```bash
npx prisma studio
```

---

## ▶️ Run Locally

```bash
npm run dev
```

Visit

```
http://localhost:3000
```

---

## 🏗 Build for Production

```bash
npm run build
```

---

## ☁️ Deploy on Vercel

1. Push your project to GitHub.
2. Import the repository into Vercel.
3. Add all environment variables.
4. Deploy.

The project is compatible with:

- Vercel
- Neon PostgreSQL
- Prisma ORM

---

## 📸 Screenshots

You can add screenshots here.

Example:

```
screenshots/
├── home.png
├── rewrite.png
└── dashboard.png
```

---

## 📌 Current Features

- AI Rewrite
- AI Humanizer
- Rewrite History
- PostgreSQL Database
- Prisma ORM
- Subscription Model
- Word Token Tracking

---

## 🚧 Future Improvements

- User Authentication (NextAuth / Clerk)
- Google Login
- Stripe Checkout
- Team Workspaces
- Document Management
- Export to PDF
- Export to DOCX
- Usage Analytics
- Admin Dashboard
- AI Chat Assistant
- Dark Mode

---

## 🤝 Contributing

Contributions are welcome.

1. Fork the repository.
2. Create a new feature branch.

```bash
git checkout -b feature-name
```

3. Commit your changes.

```bash
git commit -m "Added new feature"
```

4. Push to your branch.

```bash
git push origin feature-name
```

5. Create a Pull Request.

---

## 📄 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

**Koustab Nandy**

- GitHub: https://github.com/koustabnandy
- LinkedIn: *(Add your LinkedIn profile here)*

---

⭐ If you found this project useful, consider giving it a **Star** on GitHub.
## ⚠️ Current Limitations

- Uses a temporary hardcoded user for development.
- Full authentication (NextAuth/Clerk) is planned for a future release.
- Stripe webhook integration is included but requires Stripe credentials for production use.
## 🌐 Live Demo

https://your-project.vercel.app
