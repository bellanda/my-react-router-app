# Welcome to React Router!

A modern, production-ready template for building full-stack React applications using React Router with Bun.

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/remix-run/react-router-templates/tree/main/default)

> **Note:** This project requires Node.js 20 or later and uses Bun as package manager and runtime.

## Features

- 🚀 Server-side rendering
- ⚡️ Hot Module Replacement (HMR)
- 📦 Asset bundling and optimization
- 🔄 Data loading and mutations
- 🔒 TypeScript by default
- 🎉 TailwindCSS for styling
- 🚄 Powered by Bun for fast performance
- 📖 [React Router docs](https://reactrouter.com/)

## Getting Started

### Installation

Make sure you have [Bun installed](https://bun.sh/docs/installation).

Install the dependencies:

```bash
bun install
```

### Development

Start the development server with HMR:

```bash
bun run dev
```

Your application will be available at `http://localhost:5173`.

## Building for Production

Create a production build:

```bash
bun run build
```

## Deployment

### Docker Deployment

To build and run using Docker:

```bash
docker build -t my-app .

# Run the container
docker run -p 3000:3000 my-app
```

The containerized application can be deployed to any platform that supports Docker, including:

- AWS ECS
- Google Cloud Run
- Azure Container Apps
- Digital Ocean App Platform
- Fly.io
- Railway

### DIY Deployment

If you're familiar with deploying Bun applications, the built-in app server is production-ready.

Make sure to deploy the output of `bun run build`

```
├── package.json
├── bun.lockb
├── build/
│   ├── client/    # Static assets
│   └── server/    # Server-side code
```

## Styling

This template comes with [Tailwind CSS](https://tailwindcss.com/) already configured for a simple default starting experience. You can use whatever CSS framework you prefer.

---

Built with ❤️ using React Router and Bun.
