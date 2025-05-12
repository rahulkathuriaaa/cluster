This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

Product explaination document - https://docs.google.com/document/d/1amgiGHd996RUazSa5XB3WUuSN0CJrXnz8cPW4mqjK4E/edit?usp=sharing
# Cluster Protocol

## Required Environment Variables

Create a `.env.local` file in the root directory with the following environment variables:

```
# RapidAPI Key for Twitter following verification
NEXT_PUBLIC_RAPIDAPI_KEY=your_rapidapi_key_here
```

You can obtain a RapidAPI key by subscribing to the Twitter API on RapidAPI.com.

## Getting Started

First, install the dependencies:

```bash
npm install
# or
yarn install
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

-   [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
-   [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Database Setup (PostgreSQL)

The application now uses PostgreSQL for storing user conversations, user information, vaults and transactions.

### Setup Instructions

1. Install PostgreSQL on your machine or use a cloud provider
2. Create a new database for the application
3. Update `.env` file with your database connection string:
    ```
    DATABASE_URL="postgresql://username:password@localhost:5432/database_name?schema=public"
    ```
4. Run the Prisma migrations:
    ```
    npx prisma migrate dev --name init
    ```
5. Generate the Prisma client:
    ```
    npx prisma generate
    ```

### Database Schema

The database includes the following models:

-   **User**: Stores wallet address, credits, and activity timestamps
-   **Vault**: Represents a challenge vault with prize information
-   **Transaction**: Records APT transactions for buying credits
-   **Conversation**: Stores chat history between users and vaults

### API Endpoints

The following API endpoints are available for database interactions:

-   `/api/users` - Create, retrieve, and update users
-   `/api/vaults` - Create, retrieve, and update vaults
-   `/api/transactions` - Record and retrieve transactions
-   `/api/conversations` - Save and retrieve conversation history

### Implementation Notes

-   Conversations are now stored in the database instead of localStorage
-   User credits are persisted between sessions
-   Transaction history is maintained for all credit purchases
-   Vault information is centralized and configurable
