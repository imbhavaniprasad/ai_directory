"use client"
import React, { useEffect, useState } from 'react'
import { useSession } from "next-auth/react";
interface Message {
  text: string;
  timestamp: Date;
  type: string
}
const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [searchText, setSearchText] = useState<string>('');
  const [accessToken,setAccessToken] = useState<string|null>(null);
  const { data: session } = useSession();
  useEffect(()=>{
    const fetchAccessToken = async () => {
      try {
        const response = await fetch('https://scaip.symphonysummit.com/api/access-token');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setAccessToken(data);
      } catch (error) {
        console.error('Error:', error);
      } 
    }
    fetchAccessToken()
  },[])
  //if (!session || !session.user) return <div className="text-red-500 p-5">You Need To Sign In</div>;
  const handleSearchTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value);
  };
  // const addMessage = () => {
  //   if(searchText.trim() === '') return;
  //   // User message
  //   const newMessage = { text: searchText, type: 'user', timestamp: new Date() };
  //   setMessages(prevMessages => [...prevMessages, newMessage]);

  //   // Bot response
  //   const botResponse = generateBotResponse();
  //   const botMessage = { text: botResponse, type: 'bot', timestamp: new Date() };
  //   setMessages(prevMessages => [...prevMessages, botMessage]);

  //   setSearchText('');
  // };
  // let token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InJhdmlkYXR0YS5oc0BzeW1waG9ueXN1bW1pdC5jb20iLCJuYW1lIjoiUmF2aWRhdHRhIEhTIiwidXNlcklkIjoiYWRtaW4iLCJleHAiOjE3MTM0NDMzMDN9.ptAYdSQP8oJmBGLBZSbZ7h-XMGpFq7YrptRQXPAmr_A'
  const addMessage = async () => {
    if(searchText.trim() === '') return;
    setSearchText('');
    // User message
    const newMessage = { text: searchText, type: 'user', timestamp: new Date() };
    setMessages(prevMessages => [...prevMessages, newMessage]);
  try{
    // Send API request
    const response = await fetch('https://scaip.symphonysummit.com/api/converse', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`, // replace with your token
      },
      body: JSON.stringify({
        user_input: searchText,
        session_id: "5ab5e633-043c-4403-8b17-4dbc826f59019",
        correlation_id: "35954621311811312",
        task_type: null
      }),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
  
    // Bot response
    const botMessage = { text: data.message_out, type: 'bot', timestamp: new Date() }; // replace 'data.message' with the actual path to the message in the response
    setMessages(prevMessages => [...prevMessages, botMessage]);
  } catch (error) {
    console.error('Error:', error);
  }
  };
  // const generateBotResponse = () => {
  //   // This function generates a random response from the bot
  //   const responses = [
  //     "Hello there!",
  //     "How can I assist you?",
  //     "That's interesting!",
  //     "I'm here to help.",
  //     "Tell me more!"
  //   ];
  //   const randomIndex = Math.floor(Math.random() * responses.length);
  //   return responses[randomIndex];
  // };
if(!accessToken) return <div>Generating Token for the Session</div>
  return (
    <div className='flex flex-col h-[calc(100vh-40px)]'>
      <div className='flex-1 overflow-y-auto p-4 w-[80%] mx-auto justify-center'>
        {messages.map((message, index) => (
         <div key={index} className={`${message.type == 'user' ? "text-right" : "text-left"}`}>
         <p className={`mb-1 ${message.type === 'user' ? 'text-blue-500' : 'text-green-500'} border border-white shadow-lg bg-white rounded-md p-2 inline-block`}>
           {message.type === 'user' ? 'You' : 'Bot'}: {message.text}
         </p>
         <div><p className='text-[10px]'>{message.timestamp.toLocaleString()}</p></div>
       </div>
        ))}
      </div>
      <div className='p-4 bg-gray-200 flex justify-center'>
        <div className="relative w-[60%]">
          <input
            className='w-full p-2 border rounded-3xl pl-4'
            type="text"
            value={searchText}
            onChange={handleSearchTextChange}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                addMessage();
              }
            }}
            placeholder="Type a message..."
          />
          <svg xmlns="http://www.w3.org/2000/svg" onClick={addMessage} className="h-6 w-6 absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 hover:cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>
    </div>
  )
}

export default Chat