import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to Our Chatbot Service</h1>
        <p className="text-lg mb-8">Our AI-powered chatbot is here to help you with any questions you might have.</p>
      </div>
      <div className="w-[60vw] h-64 relative mb-8 rounded-xl border-2">
        <Image src="/assets/chatbot.jpg" layout="fill" objectFit="contain" alt="Chatbot Image" />
      </div>
      {/* <p className="text-center">Click on the chat icon at the bottom right corner to start chatting.</p> */}
    </div>
  );
}
