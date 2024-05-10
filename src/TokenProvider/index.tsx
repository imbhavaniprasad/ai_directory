"use client"
import React,{useState,useEffect, createContext, ReactNode} from 'react';
import { useSession } from "next-auth/react";
export type Token = string | null
export const AccessContext = createContext<Token>(null);


export const AccessProvider = ({ children }:{children:ReactNode}) => {
    const [accessToken, setAccessToken] = useState<Token>(null);
    const { data: session } = useSession();
    useEffect(()=>{
        const fetchAccessToken = async () => {
          try {
            const response = await fetch('https://scaip.symphonysummit.com/snowapi/access-token');
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            if (!session || !session.user)setAccessToken(data);
          } catch (error) {
            console.error('Error:', error);
          } 
        }
        fetchAccessToken()
      },[])
   
  
    return (
      <AccessContext.Provider value={ accessToken }>
        
          {children}

      </AccessContext.Provider>
    );
  };