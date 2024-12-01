import { redirect } from "next/navigation"
import { auth } from "@/auth"

export default async function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  if (session?.user.role === "company") {
    // We can also store the current URL to redirect back after login
    // Store fullUrl in a cookie or pass it as a query param to login page
    redirect("/not-found")
  }

  return <>{children}</>
}