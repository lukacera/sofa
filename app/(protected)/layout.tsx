import { auth } from "@/auth"
import { redirect } from "next/navigation"
import User from "../schemas/User"
import { connectToDB } from "../utils/connectWithDB"
import { signOut } from "next-auth/react"

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  
  if (!session?.user?.email) {
    redirect('/login')
  }

  try {
    await connectToDB()
    const user = await User.findOne({ email: session.user.email })
    
    if (!user) {
      await signOut()
    }
  } catch (error) {
    console.error('DB Error:', error)
    redirect('/login')
  }
  
  return <>{children}</>
}