import { redirect } from "next/navigation"
import { auth } from "@/auth"

export default async function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  if (session?.user.role === "individual") {
    redirect("/not-found")
  }

  return (
    <div className="min-h-screen flex flex-col bg-mainWhite">
      <main className="flex-grow pt-16">{children}</main>
    </div>
  )
}