"use client"
import React from 'react'
import { signIn, signOut } from 'next-auth/react';
import { useRouter } from "next/navigation";

export const FormSign = ({in: isSignedIn}) => {
    const router = useRouter();

    const handleSubmit = async (event) => {
      event.preventDefault();
      isSignedIn ? await signOut() : await signIn();
      router.push("/");
    }

    return (
      <div>
        <form onSubmit={handleSubmit}>
          <button type="submit">{isSignedIn ? "Sign Out" : "Sign In"}</button>
        </form>
      </div>
    )
}