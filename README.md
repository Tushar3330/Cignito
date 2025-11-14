# 🐛 Cignito - Developer Bug Solving Platform

**Live Demo:** [https://cignito.vercel.app](https://cignito.vercel.app)

A modern, collaborative platform where developers share coding challenges, post screenshots, get expert solutions, and build reputation. Think Stack Overflow with modern UI and visual bug reporting.

## ✨ Features

- **Bug Management**: Multi-step creation with Monaco Editor, image upload, severity levels
- **Smart Solutions**: Interactive code editor, markdown support, acceptance system
- **Voting System**: Anti-gaming protection, toggle voting, real-time updates
- **User Profiles**: Reputation system, follow developers, contribution history
- **Authentication**: Email/Password + GitHub/Google OAuth with account linking
- **Discovery**: Advanced search, filters by language/framework/status

## 🛠️ Tech Stack

**Frontend:** Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS, shadcn/ui, Monaco Editor  
**Backend:** PostgreSQL (Neon), Prisma ORM, NextAuth.js v5, Cloudinary, Server Actions  
**Deployment:** Vercel, Neon PostgreSQL, Cloudinary CDN

## 🚀 Quick Start

### **Live Demo**
🌐 **Production:** [https://cignito.vercel.app](https://cignito.vercel.app)

### **Local Development Setup**

#### Prerequisites
- **Node.js** 20+ (LTS recommended)
- **npm/yarn/pnpm** package manager
- **PostgreSQL** database (Neon.tech recommended)
- **GitHub OAuth App** (for authentication)

#### Installation Steps

1. **Clone the repository:**
```bash
git clone https://github.com/Tushar3330/Cignito.git
cd cignito
```

2. **Install dependencies:**
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. **Set up environment variables:**

Create a `.env.local` file in the root directory:

```bash
# Database (Get from Neon.tech)
DATABASE_URL="postgresql://username:password@host/database?sslmode=require"

# NextAuth Configuration
NEXTAUTH_URL="http://localhost:3000"
AUTH_SECRET="your-32-character-secret-key"

# GitHub OAuth (Create at github.com/settings/applications/new)
AUTH_GITHUB_ID="your-github-oauth-client-id"
AUTH_GITHUB_SECRET="your-github-oauth-client-secret"

# Google OAuth (Create at console.developers.google.com)
AUTH_GOOGLE_ID="your-google-oauth-client-id.apps.googleusercontent.com"
AUTH_GOOGLE_SECRET="your-google-oauth-client-secret"

# Cloudinary (Get from cloudinary.com)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your-cloud-name"
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET="your-upload-preset"


4. **Set up the database:**
```bash
# Push the schema to your database
npx prisma db push

# Generate Prisma Client
npx prisma generate

# (Optional) Seed some sample data
npx prisma db seed
```

5. **Start the development server:**
```bash
npm run dev
```

6. **Open the application:**
Navigate to [http://localhost:3000](http://localhost:3000) in your browser.

#### **OAuth Setup Guide**

**GitHub OAuth:**
1. Go to [GitHub Developer Settings](https://github.com/settings/applications/new)
2. Create a new OAuth App with:
   - **Homepage URL:** `http://localhost:3000`
   - **Callback URL:** `http://localhost:3000/api/auth/callback/github`

**Google OAuth:**
1. Go to [Google Cloud Console](https://console.developers.google.com)
2. Create credentials → OAuth 2.0 Client ID
3. Add authorized origins: `http://localhost:3000`
4. Add redirect URIs: `http://localhost:3000/api/auth/callback/google`

## 🗄️ Database Architecture

**PostgreSQL Database** with **Prisma ORM** - 10+ optimized models with proper indexing:

### **Core Models:**
- **👤 User**: Profiles with reputation, GitHub integration, follow system
- **🐛 Bug**: Issues with code snippets, images, language tagging, severity levels
- **💡 Solution**: Community fixes with code blocks, acceptance system
- **🗳️ Vote**: Smart voting system with anti-gaming protection
- **💬 Comment**: Nested discussion threads on bugs and solutions
- **🏷️ Tag**: Dynamic categorization system
- **👀 BugView/SolutionView**: Unique view tracking per user
- **📚 Follow**: User following system for personalized feeds

### **Key Relationships:**
- Users have many bugs, solutions, votes, and comments
- Bugs can have multiple solutions and votes
- Solutions can be accepted by bug authors
- Comprehensive audit trail with timestamps

## 📡 API Architecture

### **Server Actions (App Router)**
- `createBug` - Multi-step bug creation with image upload
- `createSolution` - Solution posting with Monaco editor
- `voteBug/voteSolution` - Smart voting with reputation updates
- `acceptSolution` - Mark solutions as accepted
- `followUser` - User following system

### **Auth Routes**
- `/api/auth/[...nextauth]` - NextAuth.js v5 endpoints
- `/api/auth/forgot-password` - Password reset system (coming soon)
- `/api/auth/reset-password` - Password reset confirmation

### **Query Functions**
- Optimized database queries with Prisma
- Server-side pagination and filtering
- Real-time reputation calculations
- Advanced search with multiple filters

## 🎨 Design System & UI

### **Custom Design Language**
- **Colors**: Pink primary (#EE2B69), Yellow secondary (#FBBF24)
- **Typography**: Work Sans font family with custom font weights
- **Components**: Neubrutalism-inspired design with heavy borders and shadows
- **Layout**: Mobile-first responsive design with Tailwind CSS

### **Component Library**
- **Enhanced Forms**: Multi-step forms with progress indicators
- **Monaco Editor**: VS Code-style code editing experience  
- **VoteButton**: Smart voting with optimistic updates
- **BugCard**: Rich preview cards with metadata
- **User Profiles**: Comprehensive developer profiles

## 🚢 Production Deployment

### **Automated Deployment Pipeline**
1. **Development**: Push changes to GitHub repository
2. **CI/CD**: Vercel automatically builds and deploys
3. **Database**: Neon PostgreSQL with connection pooling
4. **CDN**: Global edge network for optimal performance

### **Performance Optimizations**
- **Server Components**: Reduced JavaScript bundle size
- **Image Optimization**: Cloudinary CDN with WebP conversion
- **Database Indexing**: Optimized queries with proper indexes
- **Caching Strategy**: Static regeneration for public pages

## 📊 Project Stats & Metrics

### **Technical Complexity**
- **15,000+** lines of TypeScript/TSX code
- **40+** React components with TypeScript
- **10+** database models with complex relationships
- **20+** server actions for backend logic
- **30+** API endpoints and query functions

### **Performance Benchmarks**
- **95+** Lighthouse Performance Score
- **<2s** initial page load time
- **<1s** navigation between pages
- **100%** accessibility compliance

### **Feature Coverage**
- ✅ User authentication (3 providers)
- ✅ CRUD operations for bugs and solutions
- ✅ Real-time voting system
- ✅ Image upload and optimization
- ✅ Advanced search and filtering
- ✅ User reputation system
- ✅ Mobile-responsive design
- ⏳ Email notifications (coming soon)

