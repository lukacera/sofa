import NextAuth, { 
  NextAuthConfig,
  Account,
  Profile,
  Session,
  DefaultSession
} from "next-auth"
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"
import { AdapterUser } from "next-auth/adapters"
import { connectToDB } from "./app/utils/connectWithDB"
import bcrypt from "bcryptjs"
import { User as UserType } from "@auth/core/types"
import { JWT } from "next-auth/jwt"
import User from "./app/schemas/User"

declare module "next-auth" {
  interface Session {
    user: {
      id: string // Required, not optional
    } & DefaultSession["user"]
  }
}

export const authConfig: NextAuthConfig = {
  secret: process.env.AUTH_SECRET!,
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      async profile(profile) {
        await connectToDB();
        let user = await User.findOne({ email: profile.email }).exec();
        
        if (!user) {
          user = await User.create({
            email: profile.email,
            name: profile.name,
            password: null,
            image: profile.picture
          });
        }
    
        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name
        };
      }
    }),
    Credentials({
      credentials: {
        email: { type: "email" },
        password: { type: "password" }
      },
      async authorize(credentials): Promise<UserType | null> {
        if (!credentials?.email || !credentials?.password) return null;
        
        try {
          await connectToDB();
          
          const user = await User.findOne({ email: credentials.email }).exec();

          if (!user) {
            await User.create({
              email: credentials.email,
              password: await bcrypt.hash(credentials.password as string, 10),
              name: "New User",
              eventsAttending: [],
            });

            return null;
          }
          
          const passwordMatch = await bcrypt.compare(
            credentials.password as string, 
            user.password as string
          );
          
          if (!passwordMatch) return null;

          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name
          };
        } catch (error) {
          console.error(error);
          return null;
        }
      }
    })
  ],
  callbacks: {
    async jwt({ 
      token, 
      user, 
    }: { 
      token: JWT; 
      user?: UserType | AdapterUser; 
      account?: Account | null; 
      profile?: Profile | undefined;
    }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ 
      session,
      token 
    }: { 
      session: Session; 
      token: JWT;
    }): Promise<Session> {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
      }
  },
  pages: {
    signIn: '/login'
  }
};

export const { handlers, signIn, signOut, auth } = NextAuth(authConfig);