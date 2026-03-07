# Next.js 14 RBAC Application

This is a production-ready Next.js 14 application that implements role-based access control (RBAC) and authentication using NextAuth.js. The application is structured to provide both public and protected routes, ensuring that users can only access content based on their roles.

## Project Structure

```
nextjs-14-rbac-app
├── src
│   ├── app
│   │   ├── (public)
│   │   │   ├── login
│   │   │   │   └── page.js
│   │   │   └── page.js
│   │   ├── (protected)
│   │   │   ├── admin
│   │   │   │   └── page.js
│   │   │   ├── user
│   │   │   │   └── page.js
│   │   │   └── layout.js
│   │   ├── api
│   │   │   ├── auth
│   │   │   │   └── [...nextauth]
│   │   │   │       └── route.js
│   │   │   └── health
│   │   │       └── route.js
│   │   ├── forbidden
│   │   │   └── page.js
│   │   ├── globals.css
│   │   └── layout.js
│   ├── components
│   │   ├── auth
│   │   │   ├── AuthProvider.js
│   │   │   └── ProtectedRoute.js
│   │   └── ui
│   │       └── Button.js
│   ├── lib
│   │   ├── auth.js
│   │   ├── db.js
│   │   ├── env.js
│   │   └── rbac.js
│   └── middleware.js
├── prisma
│   ├── schema.prisma
│   └── seed.js
├── tests
│   ├── integration
│   │   └── auth.test.js
│   └── unit
│       └── rbac.test.js
├── .env.example
├── .eslintrc.json
├── .gitignore
├── auth.config.js
├── Dockerfile
├── jsconfig.json
├── next.config.mjs
├── package.json
├── vercel.json
└── README.md
```

## Features

- **Authentication**: Users can log in using various providers supported by NextAuth.js.
- **Role-Based Access Control**: Different user roles (admin, user) can access specific routes.
- **Health Check API**: A simple endpoint to check the server's status.
- **Protected Routes**: Certain pages are only accessible to authenticated users based on their roles.

## Getting Started

1. **Clone the repository**:
   ```
   git clone <repository-url>
   cd nextjs-14-rbac-app
   ```

2. **Install dependencies**:
   ```
   npm install
   ```

3. **Set up environment variables**:
   Copy the `.env.example` to `.env` and fill in the required values:
   ```
   DATABASE_URL=<your-database-url>
   NEXTAUTH_SECRET=<your-nextauth-secret>
   GOOGLE_CLIENT_ID=<your-google-client-id>
   GOOGLE_CLIENT_SECRET=<your-google-client-secret>
   REDIS_URL=<your-redis-url>
   ```

4. **Run the application**:
   ```
   npm run dev
   ```

5. **Access the application**:
   Open your browser and navigate to `http://localhost:3000`.

## Deployment

This application is ready for deployment on platforms like Vercel. Ensure that you configure the environment variables in your deployment settings.

## Testing

Run the tests using:
```
npm test
```

## License

This project is licensed under the MIT License.