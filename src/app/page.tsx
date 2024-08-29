import { options } from "./api/auth/[...nextauth]/options"
import { getServerSession } from "next-auth/next"
import Link from "next/link"

export default async function Home() {
  const session = await getServerSession(options)

  return (
    <>
      {session ? (
        <div>Home</div>
      ) : (
        <div className="pt-6 pl-6">
          <h1 className="text-5xl mb-8">Home</h1>
          <Link className="text-3xl" href="/login">Login</Link>
        </div>
      )}
    </>
  )
}