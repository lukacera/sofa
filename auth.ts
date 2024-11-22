import NextAuth, { 
  NextAuthConfig,
  DefaultSession,
} from "next-auth"
import Google from "next-auth/providers/google"
import { connectToDB } from "./app/utils/connectWithDB"
import User from "./app/schemas/User"

declare module "next-auth" {
  interface Session {
    user: {
      id: string | null,
      image: string | null,
    } & DefaultSession["user"]
  }
}

export const authConfig: NextAuthConfig = {
  secret: process.env.AUTH_SECRET!,
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    })
  ],
  callbacks: {
    async signIn({ 
      profile 
    }) {
      if (!profile?.email) return false;
      try {
        await connectToDB();
        const user = await User.findOne({ email: profile.email }).exec();
        
        if (!user) {
          return '/account-not-found';
        }
        return true;
      } catch (error) {
        console.error("Sign in error:", error);
        return false;
      }
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      try {
        if (session.user) {
          await connectToDB();
          const user = await User.findOne({email: session.user.email}).exec();
        
          if (user) {
            session.user.id = token.id as string;
            session.user.name = user.name;
            session.user.email = user.email;
            session.user.image = user.image as string;
          }
        }
        return session;
      } catch (error) {
        console.error("Session error:", error);
        return session;
      }
    }
  },
  pages: {
    signIn: '/login'
  }
};

export const { handlers, signIn, signOut, auth } = NextAuth(authConfig);