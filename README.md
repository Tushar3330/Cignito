# Cignito - Developer Bug Solving Platform

A collaborative platform where developers can share coding bugs, post screenshots, and get expert solutions from the community.

## 🚀 Features

- **Post Bugs**: Share your coding issues with detailed descriptions, code snippets, and screenshots
- **Get Solutions**: Community members can provide solutions with code examples and explanations
- **Smart Vote System**: 
  - One vote per user per bug/solution
  - Toggle votes (click again to remove)
  - Cannot vote on your own content
  - Prevents reputation manipulation
- **Accept Solutions**: Bug authors can mark solutions as accepted
- **Reputation System**: 
  - +2 reputation for each upvote on bugs
  - +3 reputation for each upvote on solutions
  - Reputation properly adjusted when votes are removed or changed
- **Unique View Tracking**: Each user counted once per bug, no spam counting
- **Search & Filter**: Find bugs by programming language, framework, or keywords
- **User Profiles**: Track your bugs, solutions, and reputation
- **Multi-Auth Support**: Email/Password, GitHub OAuth, and Google OAuth all link to one account

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router with React 19)
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js v5 with Email/Password, GitHub OAuth, and Google OAuth
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: shadcn/ui + Radix UI
- **Image Upload**: Cloudinary
- **Email Service**: Resend (password reset)
- **Deployment**: Vercel
- **Monitoring**: Sentry

## 📦 Getting Started

### Prerequisites

- Node.js 20+ 
- npm/yarn/pnpm
- PostgreSQL database (Neon recommended)
- GitHub OAuth App

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Tushar3330/Cignito.git
cd cignito
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:

Create a `.env.local` file with:

```bash
# Database (Get from Neon.tech)
DATABASE_URL="postgresql://..."

# NextAuth
AUTH_SECRET="your-secret-key"
AUTH_GITHUB_ID="your-github-oauth-id"
AUTH_GITHUB_SECRET="your-github-oauth-secret"
```

4. Run database migrations:
```bash
npx prisma migrate dev
```

5. Generate Prisma Client:
```bash
npx prisma generate
```

6. Start the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app!

## 🗄️ Database Schema

The platform uses PostgreSQL with the following main models:

- **User**: Developer profiles with reputation scores
- **Bug**: Posted issues with code snippets and screenshots
- **Solution**: Community-provided fixes
- **Vote**: Upvote/downvote system
- **Comment**: Discussion threads
- **Tag**: Categorization system

## 📝 API Routes

- `/api/auth/[...nextauth]` - Authentication endpoints

## 🎨 Design System

Custom Tailwind utilities and components:
- Color palette: Pink primary, Yellow secondary
- Typography: Work Sans font family
- Components: Cards, forms, buttons with custom shadows
- Responsive breakpoints

## 🚢 Deployment

The easiest way to deploy:

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy!

Vercel will automatically set up:
- PostgreSQL database (Vercel Postgres)
- Production builds
- Preview deployments

## 🤝 Contributing

Contributions are welcome! Feel free to:
1. Fork the repository
2. Create a feature branch
3. Submit a pull request

## 📄 License

MIT License - feel free to use this project for learning or building your own bug platform!

## 🙏 Acknowledgments

Built with ❤️ using modern web technologies and industry-standard practices.
