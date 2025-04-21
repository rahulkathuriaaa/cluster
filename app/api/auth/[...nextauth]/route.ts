import NextAuth from "next-auth";
import TwitterProvider from "next-auth/providers/twitter";

// Define session type to include accessToken
declare module "next-auth" {
    interface Session {
        accessToken?: string;
        user?: {
            id?: string;
            name?: string;
            email?: string;
            image?: string;
        };
    }
}

const handler = NextAuth({
    providers: [
        TwitterProvider({
            clientId: process.env.TWITTER_CLIENT_ID as string,
            clientSecret: process.env.TWITTER_CLIENT_SECRET as string,
            version: "2.0", // Using Twitter OAuth 2.0
        }),
    ],
    pages: {
        signIn: "/auth/signin",
        signOut: "/auth/signout",
        error: "/auth/error",
    },
    debug: true, // Enable debug mode for troubleshooting
    callbacks: {
        async session({ session, token }) {
            console.log("[DEBUG AUTH] Session callback", {
                tokenSub: token.sub,
                tokenAccessToken: token.accessToken
                    ? `${token.accessToken.substring(0, 10)}...`
                    : undefined,
            });
            if (token) {
                session.user = session.user || {};
                session.user.id = token.sub;
                session.accessToken = token.accessToken as string;
                console.log("[DEBUG AUTH] Added accessToken to session", {
                    hasToken: !!token.accessToken,
                    tokenLength: token.accessToken
                        ? (token.accessToken as string).length
                        : 0,
                });
            }
            return session;
        },
        async jwt({ token, account, profile }) {
            console.log("[DEBUG AUTH] JWT callback", {
                hasAccount: !!account,
                hasProfile: !!profile,
                existingToken: token.accessToken
                    ? `${(token.accessToken as string).substring(0, 10)}...`
                    : undefined,
            });
            if (account) {
                token.accessToken = account.access_token;
                console.log("[DEBUG AUTH] Added access_token to token", {
                    hasAccessToken: !!account.access_token,
                    tokenValue: account.access_token
                        ? `${account.access_token.substring(0, 10)}...`
                        : undefined,
                });
            }
            if (profile) {
                token.profile = profile;
            }
            return token;
        },
    },
});

export { handler as GET, handler as POST };
