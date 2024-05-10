"use client"
import React, { useEffect, useState } from 'react'
import { BsFillFileEarmarkSpreadsheetFill } from "react-icons/bs";
import { useSession } from "next-auth/react";
import { IoChatbubbleOutline } from "react-icons/io5";
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
  //     // "Hello there!",
  //     // "How can I assist you?",
  //     // "That's interesting!",
  //     // "I'm here to help.",
  //     // "Tell me more!",
  //     "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Voluptatibus laborum fugit nisi ut totam ducimus? Hic cumque ad odio nesciunt quasi, voluptate, adipisci molestias at corporis error veniam tenetur nemo.",
  //   ];
  //   const randomIndex = Math.floor(Math.random() * responses.length);
  //   return responses[randomIndex];
  // };
if(!accessToken) return <div>Generating Token for the Session</div>
  return (
    <div className='flex flex-col h-[calc(100vh-40px)] bg-slate-100'>
      <div className='flex-1 overflow-y-auto scrollbar-hide p-4 w-[80%] mx-auto justify-center'>
        {messages.map((message, index) => (
         <div key={index} className={`${message.type == 'user' ? "text-right" : "text-left"} relative`}>
         <p className={`mb-1 ${message.type === 'user' ? ' rounded-t-full rounded-bl-full' : 'rounded-2xl mt-2'} text-black border border-white shadow-lg bg-white  p-5 inline-block`}>
         {message.type !== 'user' && <span className='absolute top-2 text-sm text-[blue]'>Assistant</span>} {message.text}
         </p>
         {/* <div><p className='text-[10px]'>{message.timestamp.toLocaleString()}</p></div> */}
         {message.type!== "user" && <div className='flex gap-2'>
      
          {/* <IoChatbubbleOutline /> */}
          <input 
  className="pl-2 placeholder-blue-500 text-[blue] focus:outline-[blue] rounded-tl-full rounded-br-full rounded-tr-full min-w-[5ch] max-w-full overflow-visible" 
  type="text" 
  placeholder="Ask a follow up question..."
/>
       
      
         <p className={`mb-1 tex-sm flex items-center justify-between rounded-2xl mt-2 text-pink-500 border border-white shadow-lg bg-white p-2`}>
         <BsFillFileEarmarkSpreadsheetFill /><p>Analytics from source</p>
          </p>
         <p className={`mb-1 tex-sm flex items-center justify-between rounded-2xl mt-2 text-pink-500 border border-white shadow-lg bg-white p-2`}>
         <BsFillFileEarmarkSpreadsheetFill /><p>Analytics from source</p>
          </p>
        
         </div>}
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