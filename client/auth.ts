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
            : Date.now() + 300 * 1000,
        };
      }

      if (token.expiresAt && Date.now() < token.expiresAt) {
        return token;
      }

      if (!token.refreshToken) {
        return { ...token, error: "RefreshTokenError" };
      }

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

        const responseText = await response.text();
        let refreshedTokens: {
          access_token?: string;
          expires_in?: number;
          refresh_token?: string;
        };

        try {
          refreshedTokens = JSON.parse(responseText);
        } catch {
          throw new Error("Keycloak returned a non-JSON refresh response");
        }

        if (
          !response.ok ||
          !refreshedTokens.access_token ||
          !refreshedTokens.expires_in
        ) {
          throw new Error("Keycloak rejected the refresh token");
        }

        return {
          ...token,
          error: undefined,
          accessToken: refreshedTokens.access_token,
          expiresAt: Date.now() + refreshedTokens.expires_in * 1000,
          refreshToken: refreshedTokens.refresh_token ?? token.refreshToken,
        };
      } catch {
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
