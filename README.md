# CRM Integration Demo

A modern, user-friendly demo application that showcases seamless integration with popular CRM platforms (HubSpot and Pipedrive) using Integration.app. This demo allows users to create contacts in their preferred CRM system through a beautiful, responsive interface.

## Features

- 🔌 Easy CRM connection with HubSpot and Pipedrive
- 📝 Modern form interface with real-time validation
- 🎨 Beautiful UI with smooth animations and transitions
- 🔒 Secure integration using JWT authentication
- 📱 Fully responsive design
- ⚡ Built with Next.js 15 and React 19
- 🎯 TypeScript for type safety
- 🎨 Tailwind CSS for styling (currently not working as expected)

## Prerequisites

Before you begin, ensure you have:

- Node.js installed (version 18 or higher)
- An Integration.app account with workspace credentials
- HubSpot and/or Pipedrive account (for testing)

## Environment Setup

Create a `.env.local` file in the root directory with the following variables (get them from the IntApp dashboard):

```env
INT_APP_WORKSPACE_KEY=your_workspace_key
INT_APP_WORKSPACE_SECRET=your_workspace_secret
```

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd crm-demo
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Start the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

```
src/
├── app/                 # Next.js app directory
│   ├── page.tsx        # Main application page
│   ├── layout.tsx      # Root layout with Integration.app setup
│   └── globals.css     # Global styles
├── components/         # React components
│   └── IntegrationWrapper.tsx  # Wrapper HoC for  IntApp
└── lib/               # Utility functions
    └── intapp-token.ts # JWT token generation
```

## Technologies Used

- [Next.js](https://nextjs.org/) - React framework
- [Integration.app](https://integration.app/) - CRM integration platform
- [React Hook Form](https://react-hook-form.com/) - Form handling
- [Zod](https://zod.dev/) - Schema validation
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [TypeScript](https://www.typescriptlang.org/) - Type safety

## Development

The project uses several modern development tools:

- ESLint for code linting
- TypeScript for type checking
- Tailwind CSS for styling
- Next.js for server-side rendering and routing

## Deployment

The application can be deployed to any platform that supports Next.js applications. The easiest way is to use Vercel:

1. Push your code to a Git repository
2. Import the project in Vercel
3. Add your environment variables
4. Deploy!

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Integration.app for providing the integration platform
- Next.js team for the amazing framework
- Tailwind for (theoretically) making CSS easier
