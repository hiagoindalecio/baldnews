import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github"

import { query as q } from 'faunadb'
import { fauna } from '../../../services/fauna';

export default NextAuth({
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      authorization: { params: { scope: 'read:user' } },
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      console.log('EMAIL LOGIN: ' + user.email)
      try {
        await fauna.query(
          q.Create(
            q.Collections('users'),
            { 
              data: { 
                email: user.email,
              },
            }
          )
        )
      } catch (e) {
        console.log(`FaunaDB ERROR: ${e}`);
      }
      
      return true;
    },
  },
  secret: process.env.JWT_SECRET,
});
