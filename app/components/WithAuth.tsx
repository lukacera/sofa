"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { ComponentType, useEffect } from "react"

export function WithAuth<T extends object>(Component: ComponentType<T>) {
 return function AuthenticatedComponent(props: T) {
   const { data: session, status } = useSession()
   const router = useRouter()

   useEffect(() => {
     async function checkUser() {
       if (session?.user?.email) {
         const res = await fetch(`/api/users/${session.user.email}`)
         const data = await res.json()
         if (!data.user) {
           router.push('/login')
         }
         console.log(data)
       }
     }
     
     if (status === "unauthenticated") {
       router.push("/login")
     } else {
       checkUser()
     }
   }, [status, session, router])

   if (status === "loading") {
     return <div>Loading...</div>
   }

   return session ? <Component {...props} /> : null
 }
}