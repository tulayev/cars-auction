import { url } from 'inspector';
import NextAuth, { Profile } from 'next-auth';
import { OIDCConfig } from 'next-auth/providers';
import DuendeIDS6Provider from 'next-auth/providers/duende-identity-server6';

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    DuendeIDS6Provider({
      id: 'id-server',
      clientId: 'nextApp', // specified in Config.cs from IdentityService project 
      clientSecret: 'secret', // specified in Config.cs from IdentityService project
      issuer: process.env.IDENTITY_URL, // IdentityService web app url
      authorization: {
        params: {scope: 'openid profile auctionApp'},
        url: `${process.env.IDENTITY_URL}/connect/authorize`
      },
      token: {
        url: `${process.env.IDENTITY_URL_INTERNAL}/connect/token`
      },
      userinfo: {
        url: `${process.env.IDENTITY_URL_INTERNAL}/connect/token`
      },
      idToken: true
    } as OIDCConfig<Omit<Profile, 'username'>>),
  ],
  callbacks: {
    async redirect({url, baseUrl}) {
      return url.startsWith(baseUrl) ? url : baseUrl;
    },
    async authorized({auth}) {
      return !!auth;
    },
    async jwt({token, profile, account}) {
      if (account && account.access_token) {
        token.accessToken = account.access_token;
      }

      if (profile) {
        token.username = profile.username;
      }
      
      return token;
    },
    async session({session, token}) {
      if (token) {
        session.user.username = token.username;
        session.accessToken = token.accessToken;
      }

      return session;
    }
  }
});
