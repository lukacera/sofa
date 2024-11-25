import NextAuth, { NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { connectToDB } from "./app/utils/connectWithDB";
import User from "./app/schemas/User";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      image: string;
      name: string;
      role: "individual" | "company";
      description: string;
      location: string;
    }; 
  }

  
  interface JWT {
    id: string;
    email: string;
    picture: string; 
    name: string;
    role: "individual" | "company";
    description: string;
    location: string;
  }

  interface User {
    id: string;
    email: string;
    image: string;
    name: string;
    role: "individual" | "company";
    description: string;
    location: string;
  }
}

const authConfig: NextAuthConfig = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          await connectToDB();
          const user = await User.findOne({ email: credentials.email });

          if (!user) {
            return null;
          }

          const isPasswordValid = await bcrypt.compare(
            credentials.password.toString(),
            user.password
          );

          if (!isPasswordValid) {
            return null;
          }

          return {
            id: user._id.toString(),
            email: user.email,
            image: user.image,
            description: user.description || "",
            location: user.location || "",
            role: user.type as "individual" | "company",
          };
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.picture = user.image; // Add the image
        token.name = user.name;
        token.role = user.role; // Add the role
        token.description = user.description; // Add the description
        token.location = user.location; // Add the location
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user = {
          id: token.id as string,
          email: token.email as string,
          image: token.picture as string, // Add the image to the session
          name: token.name as string,
          role: token.role as "individual" | "company", // Add the role to the session
          description: token.description as string, // Add the description to the session
          location: token.location as string, // Add the location to the session
          emailVerified: null
        };
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export const { handlers, signIn, signOut, auth } = NextAuth(authConfig);