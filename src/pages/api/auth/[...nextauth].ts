import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github"

import { supabase } from '../../../services/supabase';

export default NextAuth({
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      authorization: { params: { scope: 'read:user' } },
    }),
  ],
  secret: process.env.JWT_SIGNING_PRIVATE_KEY,
  callbacks: {
    async signIn({ user }) {
      const { email } = user;

      const findUser = async (): Promise<boolean> => {
        return supabase
          .from('users')
          .select()
          .eq('email', email)
          .then((userResult) => {
            if (userResult.data.length > 0) {
              // Existent user
              console.log(`\nUser found\n`);
              return true;
            } else {
              // Not existent user
              console.log(`\nUser not found\n`);
              return false;
            }
          });
      }

      const createUser = async(): Promise<boolean> => {
        return supabase
          .from('users')
          .insert({ email }, {
            returning: 'minimal'
          })
          .then((result) => {
            if (result.status === 201) {
              console.log(`\nUser created successfully\n`);
              return true;
            } else {  
              console.error(`\nCreating user error\n${JSON.stringify(result.error)}\n`);
              return false;
            }
          });
      }

      if (!(await findUser()) && !(await createUser()))
        return false;
      else
        return true;
    },
  },
});
