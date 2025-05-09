import NextAuth from "next-auth";
import TwitterProvider from "next-auth/providers/twitter";
import { JWT } from "next-auth/jwt";

// Properly declare NextAuth module types with all required fields
declare module "next-auth" {
    /**
     * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
     */
    interface Session {
        accessToken?: string;
        user: {
            id?: string;
            name?: string | null;
            email?: string | null;
            image?: string | null;
            username?: string | null;
        };
    }
}

// Extend the JWT type in the next-auth/jwt module
declare module "next-auth/jwt" {
    /**
     * JWT token structure used in the JWT callbacks
     */
    interface JWT {
        accessToken?: string;
        profile?: any;
        username?: string;
        sub?: string; // Include sub field to support user id assignment
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
    secret: process.env.NEXT_AUTH_SECRET,
    debug: true, // Enable debug mode for troubleshooting
    callbacks: {
        async session({ session, token }) {
            console.log("[DEBUG AUTH] Session callback", {
                tokenSub: token.sub,
                tokenUsername: token.username,
                tokenAccessToken: token.accessToken
                    ? `${(token.accessToken as string).substring(0, 10)}...`
                    : undefined,
            });

            if (token) {
                // Initialize session.user if it doesn't exist
                session.user = session.user || {
                    name: null,
                    email: null,
                    image: null,
                };

                // Assign token properties to session
                session.user.id = token.sub;

                if (token.accessToken) {
                    session.accessToken = token.accessToken;
                }

                if (token.username) {
                    session.user.username = token.username;
                    console.log(
                        "[DEBUG AUTH] Added username to session:",
                        token.username
                    );
                }

                console.log("[DEBUG AUTH] Added accessToken to session", {
                    hasToken: !!token.accessToken,
                    tokenLength: token.accessToken
                        ? (token.accessToken as string).length
                        : 0,
                });
            }

            return session;
        },

        async jwt({ token, account, profile, user }) {
            console.log("[DEBUG AUTH] JWT callback", {
                hasAccount: !!account,
                hasProfile: !!profile,
                hasUser: !!user,
                existingToken: token.accessToken
                    ? `${(token.accessToken as string).substring(0, 10)}...`
                    : undefined,
            });

            // Log full profile data for debugging
            if (profile) {
                console.log(
                    "[DEBUG AUTH] Full profile data:",
                    JSON.stringify(profile, null, 2)
                );
            }

            if (account) {
                token.accessToken = account.access_token;
                console.log("[DEBUG AUTH] Added access_token to token", {
                    hasAccessToken: !!account.access_token,
                    tokenValue: account.access_token
                        ? `${(account.access_token as string).substring(
                              0,
                              10
                          )}...`
                        : undefined,
                });
            }

            // Extract Twitter username from profile data and save to token
            if (profile) {
                token.profile = profile;

                // Check for OAuthProfile data (from logs)
                if ((profile as any)?.data?.username) {
                    token.username = (profile as any).data.username;
                    console.log(
                        "[DEBUG AUTH] Found username in profile.data:",
                        token.username
                    );
                }
                // For compatibility with v2 API where username might be directly in profile
                else if ((profile as any)?.username) {
                    token.username = (profile as any).username;
                    console.log(
                        "[DEBUG AUTH] Found username directly in profile:",
                        token.username
                    );
                }
                // Look for username in OAuthProfile data structure from logs
                else if ((profile as any)?.OAuthProfile?.data?.username) {
                    token.username = (
                        profile as any
                    ).OAuthProfile.data.username;
                    console.log(
                        "[DEBUG AUTH] Found username in OAuthProfile.data:",
                        token.username
                    );
                }
            }

            return token;
        },
    },
});

export { handler as GET, handler as POST };
