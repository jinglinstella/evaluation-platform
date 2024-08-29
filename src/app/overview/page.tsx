import OverviewAppView from "src/sections/overview/view/overview-app-view";
import { options } from "src/app/api/auth/[...nextauth]/options"
import { getServerSession } from "next-auth/next"

// export default async function Home() {
//   const session = await getServerSession(options)

//   return (
//     <>
//       {session ? (
//         <OverviewAppView/>
//       ) : (
//         <h1 className="text-5xl">You Shall Not Pass!</h1>
//       )}
//     </>
//   )
// }

import React from 'react'

const page = () => {
  return (
    <div>
      <OverviewAppView/>
    </div>
  )
}

export default page


