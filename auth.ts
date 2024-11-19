
import NextAuth, { 
  NextAuthConfig,
  DefaultSession,
  Account,
  Profile,
  Session
} from "next-auth"
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"
import { AdapterUser } from "next-auth/adapters"
import { connectToDB } from "./app/utils/connectWithDB"
import bcrypt from "bcryptjs"
import User from "./app/schemas/User"
import { User as UserType } from "@auth/core/types"
import { JWT } from "next-auth/jwt"

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
      async profile(profile) {
        await connectToDB();
        let user = await User.findOne({ email: profile.email }).exec();

        if (!user) {
          user = await User.create({
            email: profile.email,
            name: profile.name,
            image: profile.picture
          });
        }

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          image: user.image
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
        return session;  // Vraćamo session u slučaju greške
      }
    }
  },
  pages: {
    signIn: '/login'
  }
};

export const { handlers, signIn, signOut, auth } = NextAuth(authConfig);