import NextAuth, { 
  NextAuthConfig,
  DefaultSession,
} from "next-auth"
import Google from "next-auth/providers/google"
import { connectToDB } from "./app/utils/connectWithDB"
import User from "./app/schemas/User"
import { Profile } from "@auth/core/types"

declare module "next-auth" {
  interface Session {
    user: {
      id: string | null,
      image: string | null,
    } & DefaultSession["user"]
  }
}

declare module "next-auth" {
  interface SignInCallbackParams {
    query?: { 
      signInPage?: string,
      userType?: "individual" | "company"
    }
  }
}


export const authConfig: NextAuthConfig = {
  secret: process.env.AUTH_SECRET!,
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],
  callbacks: {
    async signIn({ 
      profile,
      query
    }: {
      profile?: Profile | undefined,
      query?: { 
        signInPage?: string,
        userType?: "individual" | "company"
      }
    }) {
      if (!profile?.email) return false;
      try {
        await connectToDB();
        const user = await User.findOne({ email: profile.email }).exec();
        console.log("Is sign in page:", query?.signInPage);
        if (!user && query?.signInPage === "true") {
          return '/account-not-found';
        }
        if (!user) {
          await User.create({
            name: profile.name,
            email: profile.email,
            image: profile.picture,
            type: query?.userType ?? "individual",
            description: query?.userType === "company" ? "" : null,
            location: query?.userType === "company" ? "" : null,
          })
          return true;
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
    },
    async redirect({ url, baseUrl }) {
      console.log("Redirect URL:", url);
      console.log("Base URL:", baseUrl);
  
      // Keep the query parameters in the redirect
      if (url.startsWith(baseUrl)) {
        console.log("Redirecting to:", url);
        return url;
      }
  
      // Fallback redirect
      return baseUrl;
    }  
  },
  pages: {
    signIn: '/login'
  }
};

export const { handlers, signIn, signOut, auth } = NextAuth(authConfig);