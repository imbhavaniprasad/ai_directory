import { auth, signIn, signOut } from "auth";
import Link from "next/link";
import React from "react";

import {FormSign} from "./FormSign";

async function AppBar() {
  const session = await auth();

  return (
    <div className="p-2 bg-gray-300 flex gap-2 ">
      <Link href="/">AI Directory</Link>
      {/* <Link href={"/clientPage"}>Client Page</Link>
      <Link href={"/serverPage"}>Server Page</Link>
      <Link href={"/middlewareProtected"}>Middleware Protected Page</Link> */}
      <div className="ml-auto">
        {session && session.user ? (
          <div className="flex gap-2">
                      <Link href={"/chat"}>Chat |</Link>
            <p>{session.user.name}</p>
            <FormSign in={true}/>
          </div>
        ) : (
          <>
         <FormSign in={false}/>
         </>
        )}
      </div>
    </div>
  );
}

export default AppBar;
