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
          const response = await fetch(
            `${process.env.NEXTAUTH_URL}/api/users/${credentials.email}`
          );

          if (!response.ok) {
            return null;
          }
          const { user } = await response.json();

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
            name: user.name,
            role: user.role as "individual" | "company",
          };
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (trigger === "update") {
        token.name = session.user.name
        token.description = session.user.description
      }
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.picture = user.image;
        token.name = user.name;
        token.role = user.role;
        token.description = user.description;
        token.location = user.location;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user = {
          id: token.id as string,
          email: token.email as string,
          image: token.picture as string, 
          name: token.name as string,
          role: token.role as "individual" | "company",
          description: token.description as string,  
          location: token.location as string,
          emailVerified: null
        };
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export const { handlers, signIn, signOut, auth } = NextAuth(authConfig);