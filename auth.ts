import NextAuth, { User as AuthUser } from "next-auth"
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import User from "./app/schemas/User"
import { connectToDB } from "./app/utils/connectWithDB"

export const authConfig = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      async profile(profile) {
        await connectToDB()
        let user = await User.findOne({ email: profile.email })
        
        // Register user if they don't exist, login with Google case
        if (!user) {
          user = await User.create({
            email: profile.email,
            name: profile.name,
            password: null
          })
        }
    
        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name
        }
      }
    }),
    Credentials({
      credentials: {
        email: { type: "email" },
        password: { type: "password" }
      },
      async authorize(credentials): Promise<AuthUser | null> {
        if (!credentials?.email || !credentials?.password) return null
        
        try {
          await connectToDB()
          
          const user = await User.findOne({ email: credentials.email })

          if (!user) {
            await User.create({
              email: credentials.email,
              password: await bcrypt.hash(credentials.password as string, 10),
              name: "New User",
              eventsAttending: []
            })

            return null
          }
          
          const passwordMatch = await bcrypt.compare(
            credentials.password as string, 
            user.password
          )
          if (!passwordMatch) return null

          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name
          }
        } catch (error) {
          console.error(error)
          return null
        }
      }
    })
  ],
  pages: {
    signIn: '/login' 
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth(authConfig)