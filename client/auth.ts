import NextAuth from "next-auth";
import Keycloak from "next-auth/providers/keycloak";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Keycloak({
      clientId: process.env.KEYCLOAK_ID!,
      clientSecret: process.env.KEYCLOAK_SECRET!,
      issuer: process.env.KEYCLOAK_ISSUER!,
      authorization: {
        params: {
          prompt: "login",
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        return {
          ...token,
          accessToken: account.access_token,
          refreshToken: account.refresh_token,
          idToken: account.id_token,
          expiresAt: account.expires_at
            ? account.expires_at * 1000
            : Date.now() + 300 * 1000, //create a 5 minutes expiration date
        };
      }
      //if the token has not expired return it
      if (Date.now() < (token.expiresAt as number)) return token;

      //if the token expired generate a new one
      try {
        const response = await fetch(
          `${process.env.KEYCLOAK_ISSUER}/protocol/openid-connect/token`,
          {
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
              client_id: process.env.KEYCLOAK_ID!,
              client_secret: process.env.KEYCLOAK_SECRET!,
              grant_type: "refresh_token",
              refresh_token: token.refreshToken as string,
            }),
            method: "POST",
          },
        );

        const refreshedTokens = await response.json();

        if (!response.ok) throw refreshedTokens;

        return {
          ...token,
          accessToken: refreshedTokens.access_token,
          expiresAt: Date.now() + refreshedTokens.expires_in * 1000,
          // use the to old refresh token if Keycloak didn't issue a new one
          refreshToken: refreshedTokens.refresh_token ?? token.refreshToken,
        };
      } catch (error) {
        console.error("Error refreshing Keycloak Access Token:", error);
        return { ...token, error: "RefreshTokenError" };
      }
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      session.idToken = token.idToken;
      session.error = token.error;
      return session;
    },
  },
});
