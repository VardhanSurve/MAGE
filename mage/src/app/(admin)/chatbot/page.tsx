"use client"
import React, { useState, useEffect,useRef  } from 'react';
import axios from 'axios';
 import { FaPaperPlane, FaUpload } from 'react-icons/fa'; // Importing the upload icon
 import Image from 'next/image';
 import { faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons';
 import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { v4 as uuidv4 } from 'uuid'; 
import { cn } from "@/lib/utils";
import { Button } from '@/components/ui/button';
import DotPattern from '@/components/ui/dots';
import { toast } from 'sonner';
import { arrayUnion, doc, arrayRemove,onSnapshot, updateDoc, getDoc } from "firebase/firestore"; // Firestore functions
import { db } from '@/app/firebase/config';
import { useSession } from 'next-auth/react';
import DotPattern2 from '@/components/ui/dot2';
import { staticAdmins } from '@/lib/constants';
import { BotIcon, DownloadIcon } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { leapfrog } from 'ldrs'
import BackdropGradient from '@/components/bggradiant';
import { Separator } from '@/components/ui/separator';
import jsPDF from "jspdf";
import Markdown from 'markdown-to-jsx';
import { IconReportSearch } from '@tabler/icons-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

leapfrog.register()

// Default values shown
interface Message {
  text: string;
  isBot: boolean;
  imageUrl?: string; // Optional property for images
}

interface ChatSession {
  id: string;
  name: string;
  created_at: string; // Or Date if you're using Date objects
  messages: Message[];
}

const Chatbotss = () => {
  const [input, setInput] = useState<string>(""); // Typing input state
  const textareaRef = useRef<HTMLTextAreaElement | null>(null); // Typing ref for textarea
  const [chatSessions, setChatSessions] = useState<ChatSession[]>(() => {
    const storedSessions = localStorage.getItem('chatSessions');
    return storedSessions ? JSON.parse(storedSessions) : [{ id: 1, name: 'Chat 1', messages: [{ text: "Hi there! How can I help you?", isBot: true }] }];
  });
  const [activeSessionId, setActiveSessionId] = useState<string | null>(chatSessions[0]?.id || null);
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
  const [editedName, setEditedName] = useState<string>("");
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [isBotTyping, setIsBotTyping] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null); // State for the selected image
  const { data: session } = useSession();
  const [adminCreateData, setAdminCreateData] = useState<any>({}); // Store adminCreate data
  const [selectedAdminDetails, setSelectedAdminDetails] = useState<any | null>(null); // Data for the selected admin
const [ loading, setLoading] = useState<boolean>(true)
const [selectedAdmin, setSelectedAdmin] = useState<string | null>(null);
const [isDialogOpen, setIsDialogOpen] = useState(false);
const [description, setDescription] = useState("");

const handleDialogOpen = () => {
  setIsDialogOpen(true); // Open the dialog when container is clicked
};

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  console.log(description); // Log the description to the console
  try {
    const res = await axios.post<string>('http://192.168.231.8:8001/feedback', {
      user_feedback: description,
    });} catch (error) {
    console.error("Error fetching data from Flask API:", error);
}finally{
  setIsDialogOpen(false); // Optionally close the dialog after submitting
};
}
const handleDownloadPDF = (text: string) => {
  const doc = new jsPDF();
  doc.setFont("helvetica", "normal");

  const pageWidth = doc.internal.pageSize.width; // A4 page width
  const pageHeight = doc.internal.pageSize.height; // A4 page height
  let yPosition = 10; // Starting position

  // Split text into lines and process
  const lines = text.split("\n");

  lines.forEach(line => {
    // Check if the line should be a large header (###)
    if (line.startsWith("###")) {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(16); // Larger text for headers
      const headerLines = doc.splitTextToSize(line.replace("###", "").trim(), pageWidth - 20); // Wrap text
      headerLines.forEach(headerLine => {
        doc.text(headerLine, 10, yPosition);
        yPosition += 12; // Increase space after header
      });
    }
    // Check for bold text (** **)
    else if (line.includes("**")) {
      let formattedLine = line.replace(/\*\*(.*?)\*\*/g, function(match, p1) {
        doc.setFont("helvetica", "bold");
        return p1;
      });
      doc.setFont("helvetica", "normal");
      const boldLines = doc.splitTextToSize(formattedLine, pageWidth - 20); // Wrap text
      boldLines.forEach(boldLine => {
        doc.text(boldLine, 10, yPosition);
        yPosition += 8; // Normal space for regular text
      });
    }
    // Check for list items ([])
    else if (line.includes("[")) {
      doc.setFont("helvetica", "normal");
      const listLines = doc.splitTextToSize(line.trim(), pageWidth - 20); // Wrap text
      listLines.forEach(listLine => {
        doc.text(listLine, 10, yPosition);
        yPosition += 8;
      });
    }
    // Regular text
    else {
      doc.setFont("helvetica", "normal");
      const regularLines = doc.splitTextToSize(line.trim(), pageWidth - 20); // Wrap text
      regularLines.forEach(regularLine => {
        doc.text(regularLine, 10, yPosition);
        yPosition += 8;
      });
    }

    // If yPosition exceeds page height, add a new page
    if (yPosition > pageHeight - 10) {
      doc.addPage();
      yPosition = 10; // Reset to top of the new page
    }
  });

  // Save the PDF
  doc.save("MAGE.pdf");
};


  const fetchChatSessions = async () => {
    if (!session?.user?.id) return;

    try {
      // Get the Firestore document for the current admin
      const adminDocRef = doc(db, "admins", session.user.id);
      const adminDoc = await getDoc(adminDocRef);

      if (adminDoc.exists()) {
        const data = adminDoc.data();
        const chatbotSessions = data?.chatbots || [];
        setChatSessions(chatbotSessions);

        // Set the first session as the active session by default
        if (chatbotSessions.length > 0) {
          setActiveSessionId(chatbotSessions[0].id);
        }
      }
    } catch (error) {
      console.error("Error fetching chat sessions:", error);
    }
  };

  useEffect(() => {
    fetchChatSessions();
  }, [session?.user?.id]);


  useEffect(() => {
    const fetchChatSessions = async () => {
      if (!session?.user?.id) return;
      const adminDocRef = doc(db, "admins", session.user.id);

      try {
        const docSnap = await getDoc(adminDocRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          const fetchedSessions = data.chatbots || {};
          setChatSessions(fetchedSessions);

          // Set the first session as active by default
          if (fetchedSessions.length > 0) {
            setActiveSessionId(fetchedSessions[0].id);
          }
        } else {
          console.error("No document found for the current user.");
        }
      } catch (error) {
        console.error("Error fetching chat sessions from Firestore:", error);
      }finally {
        setLoading(false);
      }
    };

    fetchChatSessions();
  }, [db, session?.user?.id]);

  // useEffect(() => {
  //   if (!session?.user?.id) return;

  //   const adminDocRef = doc(db, "admins", session.user.id);
  //   const unsubscribe = onSnapshot(adminDocRef, (docSnap) => {
  //     if (docSnap.exists()) {
  //       const data = docSnap.data();
  //       setAdminCreateData(data?.adminCreate ||{});
  //     }
  //   });

  //   return () => unsubscribe(); // Clean up listener on unmount
  // }, [session?.user?.id]);

  const handleAdminSelect = (adminId: string) => {
    setSelectedAdmin(adminId);
    console.log("Selected Admin:", adminId);
  };
  // useEffect(() => {
  //   localStorage.setItem('chatSessions', JSON.stringify(chatSessions));
  // }, [chatSessions]);

  const activeSession = chatSessions.find((session) => session.id === activeSessionId);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);

    // Adjust the height of the textarea to its content
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  const handleNewChat = async () => {
    const newSessionId = uuidv4(); // Generate a unique ID for the session
    const newSession: ChatSession = {
      id: newSessionId,
      created_at: new Date().toISOString(), // Timestamp for session creation
      name: `Chat ${chatSessions.length + 1}`, // Dynamically name the chat
      messages: [{ text: "Hi there! How can I help you?", isBot: true }],
    };
  
    // Update state
    setChatSessions([...chatSessions, newSession]);
    setActiveSessionId(newSessionId);
  
    if (!session?.user?.id) return;
  
    try {
      // Create a document reference in the "chatbots" collection inside "admins"
      const adminDocRef = doc(db, "admins", session.user.id);
  
      await updateDoc(adminDocRef, {
        chatbots: arrayUnion({
          id: newSession.id,
          created_at: newSession.created_at,
          name: newSession.name,
          messages: newSession.messages,
        }),
      });
  
      console.log("Chat session created in Firestore!");
    } catch (error) {
      console.error("Error creating chat session in Firestore:", error);
    }
  };

  const handleDeleteChat = async (id: string) => {
    const updatedSessions = chatSessions.filter((session) => session.id !== id);
    setChatSessions(updatedSessions);
  
    // Update active session ID
    if (id === activeSessionId && updatedSessions.length > 0) {
      setActiveSessionId(updatedSessions[0].id);
    } else if (updatedSessions.length === 0) {
      setActiveSessionId(null);
    }
  
    if (!session?.user?.id) return;
  
    try {
      // Reference to the admin document
      const adminDocRef = doc(db, "admins", session.user.id);
  
      // Find the session to remove
      const sessionToRemove = chatSessions.find((session) => session.id === id);
      if (!sessionToRemove) {
        console.error("Session to delete not found in local state.");
        return;
      }
  
      // Remove the session from Firestore using arrayRemove
      await updateDoc(adminDocRef, {
        chatbots: arrayRemove({
          id: sessionToRemove.id,
          created_at: sessionToRemove.created_at,
          name: sessionToRemove.name,
          messages: sessionToRemove.messages,
        }),
      });
  
      console.log("Chat session deleted from Firestore!");
    } catch (error) {
      console.error("Error deleting chat session from Firestore:", error);
    }
  };

  const handleEditChat = (id: string) => {
    setEditingSessionId(id);
    const sessionToEdit = chatSessions.find((session) => session.id === id);
    if (sessionToEdit) setEditedName(sessionToEdit.name);
  };

  const handleSaveEdit = async () => {
    if (editedName.length > 15) {
      toast.error("Name cannot exceed 15 characters.");
      return;
    }
  
    const updatedSessions = chatSessions.map((session) =>
      session.id === editingSessionId ? { ...session, name: editedName } : session
    );
  
    setChatSessions(updatedSessions);
    setEditingSessionId(null);
  
    if (!session?.user?.id || !editingSessionId) return;
  
    try {
      // Reference to the admin document
      const adminDocRef = doc(db, "admins", session.user.id);
  
      // Fetch the specific session to update
      const sessionIndex = chatSessions.findIndex(
        (session) => session.id === editingSessionId
      );
      if (sessionIndex === -1) {
        console.error("Session not found");
        return;
      }
  
      // Update the specific session's name in Firestore
      const updatedSessionData = {
        ...chatSessions[sessionIndex],
        name: editedName,
      };
  
      await updateDoc(adminDocRef, {
        chatbots: chatSessions.map((session) =>
          session.id === editingSessionId ? updatedSessionData : session
        ),
      });
  
      console.log("Session name updated in Firestore!");
    } catch (error) {
      console.error("Error updating session name in Firestore:", error);
      toast.error("Error updating session name. Please try again.");
    }
  };
  

  const handleMessageSend = async () => {
    if (input.trim() !== "" || selectedImage) { // Check if input or image exists
      await sendMessageApi(input, selectedImage); // Send the current input and selected image
      setInput(""); // Clear input after sending message
      setSelectedImage(null); // Clear the selected image
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto'; // Reset height after sending
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // Prevent newline from Enter
      handleMessageSend();
    }
  };

  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  
    // Clean up the effect
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isSidebarOpen]);
  
  const handleClearStorage = () => {
    localStorage.clear();
    setChatSessions([]);
    setActiveSessionId(null);
    toast.success('Local storage has been cleared!');
  };

  const sendMessage = async (text: string, image: File | null) => {
    if (!activeSession) return;
  
    // Static Q&A list
    const qaList = [
      { question: "How can I reset my password?", answer: "**To reset your password**, click on 'Forgot Password' and follow the instructions." },
      { question: "What is your return policy?", answer: "**Our return policy** allows \n returns /n within *30 days* of purchase." },
      { question: "How can I track my order?", answer: "To track your order, visit your order page and click on **'Track Order'**." },
      { question: "What payment methods do you accept?", answer: "We accept **Visa, Mastercard, PayPal**, and *Apple Pay*." },
      { 
        question: "Can you show an example of a table?", 
        answer: `| Feature      | Details  |
    |------------|---------|
    | Return Time | 30 Days |
    | Payment    | Visa, PayPal |`
      },
    ];
  
    // Construct a user message
    const userMessage = { 
      text, 
      isBot: false, 
    };
  
    const newMessages = [...activeSession.messages, userMessage];
    const updatedSession: ChatSession = { ...activeSession, messages: newMessages };
  
    // Update local state for chat sessions
    setChatSessions(chatSessions.map((session) =>
      session.id === activeSessionId ? updatedSession : session
    ));
  
    console.log("User sent:", text);
    setIsBotTyping(true);
  
    // Find the bot's response based on the user input
    const botResponse = qaList.find(qa => qa.question.toLowerCase() === text.toLowerCase())?.answer;
  
    let botMessage;
    if (botResponse) {
      // If a matching question is found, respond with the static answer
      botMessage = { text: botResponse, isBot: true };
    } else {
      // If no matching question, provide a default message
      botMessage = { text: "I'm sorry, I didn't understand that.", isBot: true };
    }
  
    // Add bot message to updated session
    const updatedSessionWithBotMessage = {
      ...updatedSession,
      messages: [...newMessages, botMessage],
    };
  
    // Update local state with the bot message
    setChatSessions(chatSessions.map((session) =>
      session.id === activeSessionId ? updatedSessionWithBotMessage : session
    ));
  
    console.log("User message:", userMessage);
    console.log("Bot response:", botMessage);
  console.log("slected agent",selectedAdmin)
    // Ensure that the updated session data is valid and not undefined
    if (!session?.user?.id || !updatedSessionWithBotMessage.messages) {
      console.error("Invalid session data, cannot update chat session in Firestore.");
      setIsBotTyping(false);
      return;
    }
  
    const adminDocRef = doc(db, "admins", session.user.id);
  
    try {
      // Fetch the specific chat session from Firestore
      const chatRef = doc(db, "admins", session.user.id);
      const chatDoc = await getDoc(chatRef);
  
      if (chatDoc.exists()) {
        const chatData = chatDoc.data();
        const chatbots = chatData?.chatbots || [];
        // Find the specific session to update
        const updatedChatbots = chatbots.map((chatbot: any) => {
          if (chatbot.id === activeSessionId) {
            return {
              ...chatbot,
              messages: updatedSessionWithBotMessage.messages, // Directly assign the updated messages array
            };
          }
          return chatbot;
        });
  
        console.log("Updated chatbots:", updatedChatbots);
  
        // Check for invalid messages data before saving
        if (!updatedSessionWithBotMessage.messages || updatedSessionWithBotMessage.messages.length === 0) {
          console.error("Messages are empty or undefined.");
          return;
        }
  
        // Update the chatbots array with the updated session messages
        await updateDoc(chatRef, { chatbots: updatedChatbots });
  
        console.log("Chat session updated in Firestore!");
      } else {
        console.log("No such document found.");
      }
    } catch (error) {
      console.error('Error updating chat session in Firestore:', error);
    } finally {
      setIsBotTyping(false);
    }
  };
   
  const sendMessageApi = async (text: string, image: File | null) => {
    if (!activeSession) return;
  
    // Construct a user message
    const userMessage: Message = { text, isBot: false };
    const newMessages = [...activeSession.messages, userMessage];
  
    const updatedSession: ChatSession = {
      ...activeSession,
      messages: newMessages,
    };
  
    // Update local state
    setChatSessions((prev) =>
      prev.map((session) =>
        session.id === activeSessionId ? updatedSession : session
      )
    );
  
    console.log("User sent:", text);
    setIsBotTyping(true);
  
    try {
      const res = await axios.post<string>('http://192.168.231.8:8000/api/question', {
        query: text,
      });
  
      console.log("API response:", res);
  
      // Fix: Extract response correctly
      const botReply = res.data ?? "I'm sorry, I didn't understand that.";
  
      const botMessage: Message = { text: botReply, isBot: true };
      console.log("Bot response:", botMessage);
  
      // Update session with bot message
      const updatedSessionWithBotMessage = {
        ...updatedSession,
        messages: [...newMessages, botMessage],
      };
  
      setChatSessions((prev) =>
        prev.map((session) =>
          session.id === activeSessionId ? updatedSessionWithBotMessage : session
        )
      );
  
      console.log("User message:", userMessage);
      console.log("Bot response:", botMessage);
      console.log("Selected agent:", selectedAdmin);
  
      if (!session?.user?.id || !updatedSessionWithBotMessage.messages) {
        console.error("Invalid session data, cannot update chat session in Firestore.");
        return;
      }
  
      const chatRef = doc(db, "admins", session.user.id);
      const chatDoc = await getDoc(chatRef);
  
      if (chatDoc.exists()) {
        const chatData = chatDoc.data();
        const chatbots = chatData?.chatbots || [];
  
        const updatedChatbots = chatbots.map((chatbot: any) =>
          chatbot.id === activeSessionId
            ? { ...chatbot, messages: updatedSessionWithBotMessage.messages }
            : chatbot
        );
  
        console.log("Updated chatbots:", updatedChatbots);
  
        await updateDoc(chatRef, { chatbots: updatedChatbots });
        console.log("Chat session updated in Firestore!");
      } else {
        console.log("No such document found.");
      }
    } catch (error) {
      console.error("Error fetching data from Flask API:", error);
    } finally {
      setIsBotTyping(false);
    }
  };
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedImage(e.target.files[0]); // Set the selected image
    }
  };

  
  return (
<div className="min-h-screen flex royal-twilight scrollbar-hidden">
       {/* Sidebar toggle button for small screens */}
       <button
        className="lg:hidden fixed top-4 left-4 z-5 p-2 bg-[#FFA947] text-white rounded-md"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? "Close Menu" : "Open Menu"}
      </button>
      {/* <DotPattern2
            className={cn(
              "[mask-image:radial-gradient(900px_circle_at_center,white,transparent)]"
            )}
          /> */}

  {/* <Image
    src="/exe logo.png"
    objectFit="cover"
    layout="fill" // Automatically sizes the image to fill the container
    className="fixed max-w-[60%] bg-green-300  right-[20%] top-[20%]  opacity-20 " // Only visible in dark mode
    alt="Chatbot avatar dark"
  /> */}
  {/* This is sidebar */}
  <div className={`fixed w-80 h-screen sched3 border-r-2 dark:border-[#20134c] rounded-tr-[1.5rem] rounded-br-[1.5rem] border-black overflow-y-auto z-40 transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 transition-transform duration-300 ease-in-out`}>
  {/* <DotPattern
            className={cn(
              "[mask-image:radial-gradient(900px_circle_at_center,white,transparent)]"
            )}
          /> */}
  <div className='p-5 h-full flex flex-col'>
      <div className='flex mb-15'>
        {/* <img src={gptImgLogo} className='w-24 h-24 mx-4' alt="Chatbot Logo" /> */}
        <span className='text-2xl left-1/2 font-bold  mt-2 dark:text-white text-black '>MAGE</span>
        </div>
        <Button onClick={handleNewChat} variant="default" className="mb-4 mt-5 text-[##333333] hover:bg-gray-300 dark:text-white  dark:hover:bg-gray-800 sticky crimson-dusk  px-8 py-0.5  border-2 border-black dark:border-black uppercase text-black transition duration-200 text-sm">
        <Image src="/add-30.png" className='h-4 w-4 mr-4' alt="Add button" width={40} height={40} /><p className='text-sm font-medium'>New Chat</p>
        </Button>
        {/* <Button onClick={handleClearStorage} variant="default" className="mb-6 text-[##333333] hover:bg-gray-300 dark:text-white  dark:hover:bg-gray-800 sticky crimson-dusk  px-8 py-0.5  border-2 border-black dark:border-black uppercase text-black transition duration-200 text-sm shadow-[1px_1px_rgba(0,0,0),2px_2px_rgba(0,0,0),3px_3px_rgba(0,0,0),4px_4px_rgba(0,0,0),5px_5px_0px_0px_rgba(0,0,0)] dark:shadow-[1px_1px_rgba(255,255,255),2px_2px_rgba(255,255,255),3px_3px_rgba(255,255,255),4px_4px_rgba(255,255,255),5px_5px_0px_0px_rgba(255,255,255)]">
        Clear Storage
        </Button> */}
      <div className="space-y-2 flex-grow mt-9 overflow-y-auto max-h-[20rem]">
        {chatSessions.map(session => (
     <div
     key={session.id}
     className={`relative p-3 rounded-lg border border-black dark:border-black dark:shadow-white text-white text-sm  cursor-pointer ${session.id === activeSessionId ? 'ethereal-chill font-medium ' : 'hover:bg-[#3e3e3e]'}`}
     onClick={() => setActiveSessionId(session.id)}
   >
   
            {session.id === editingSessionId ? (
              <input
                type="text"
                className='w-full bg-transparent text-black outline-none whitespace-nowrap overflow-hidden text-ellipsis'
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                onBlur={handleSaveEdit}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    handleSaveEdit();
                  }
                }}
                autoFocus
                maxLength={15}
              />
            ) : (
              <span className="text-white">{session.name}</span>
            )}
            <button
  className="absolute z-40 bg-transparent border-none right-12 top-2"
  onClick={(e) => { e.stopPropagation(); handleEditChat(session.id); }}>
  <FontAwesomeIcon icon={faPenToSquare} className="size-6 hover:text-green-500" />
</button>
<button
  className="absolute bg-transparent border-none right-2 top-2"
  onClick={(e) => { e.stopPropagation(); handleDeleteChat(session.id); }}>
  <FontAwesomeIcon icon={faTrash} className="size-6 hover:text-red-500" />
</button>
          </div>
        ))}
      </div>
      <h2 className="text-lg font-bold">Modal List</h2>
      <div className="space-y-3 px-2 flex-grow grid grid-cols-2 gap-3 py-2 overflow-y-auto max-h-[13rem]">
      {staticAdmins.map(({ id, name }) => (
      <div
        key={id}
        className={`p-2 cursor-pointer rounded-xl h-10 text-white transition-all 
          ${selectedAdmin === id ? "border-t-2 border-b-2 border-white crimson-dusk " : "border-white border-t-[0.3px] border-b-[1px]"}`}
        onClick={() => handleAdminSelect(id)}
      >
        {name}
      </div>
    ))}
    </div>
    </div>
  </div>
  {/* This is ChatScreen */}
  <BackdropGradient className='w-4/12 h-2/6 mt-[140px] z-[4] opacity-45' container="flex flex-col items-center">

  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger>
        <div
          onClick={handleDialogOpen}
  className='fixed bottom-8 rounded-full z-30 w-14 h-14 items-center flex justify-center bg-[#5f326a] right-32 '>
    <IconReportSearch className='h-7 w-7 '/>
  </div>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Report{"  "}!{" "} ! {" "}!</DialogTitle>
            <DialogDescription>
              Please provide a brief description for the report.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <Label htmlFor="description" className="block text-sm font-medium text-gray-500">
                Description
              </Label>
              <Textarea
                id="description"
                value={description}
                placeholder='Enter your report here'
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="mt-4 flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 bg-white text-black rounded-md hover:bg-gray-500"
              >
                Submit
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
  <div className={`flex-1 h-[84%] w-[70%] absolute right-[5%]  top-10  flex flex-col transition-transform duration-300 ease-in-out ${isSidebarOpen ? "ml-0 blur-md opacity-50 pointer-events-none" : "ml-0"}  mb-12`}>
  
  <div className="flex-1 relative overflow-x-hidden  p-4 ">


    {activeSession ? (
      <>
                {/* {selectedAdminDetails &&
          selectedAdminDetails.map((card: any, index: number) => (
            <div key={index} className="border-b pb-3">
              <h5 className="font-medium">
                {card.cardTitle} - {card.cardName}
              </h5>
              <ul>
                {card.fieldsValue?.map((field: any, idx: number) => (
                  <li key={idx} className="pl-4">
                    <strong>{field.fieldName}:</strong> {field.value}
                  </li>
                ))}
              </ul>
            </div>
          ))} */}
        {activeSession.messages.map((message, i) => (
          <div
            key={i}
            className={`flex ${message.isBot ? "justify-start max-w-[80%] p-4" : "justify-end"} mb-4`}
          >
            {message.isBot && (
              <BotIcon className='h-10 w-10 mr-2' />
            )}
            <div
              className={`inline-flex ${message.isBot ? " rounded-t-2xl bg-[#11062da0] max-w-[60%]  rounded-br-2xl" : "bg-[#F1F1F1] rounded-t-2xl max-w-[75%] rounded-bl-2xl"} shadow-lg backdrop-blur-md p-3 `}
              style={{ 
                maxWidth: 'calc(100% - 50px)', 
                whiteSpace: 'pre-wrap', 
                wordWrap: 'break-word',  
                color: message.isBot ? 'white' : '#0c0e0c',
              }}
            >
              <div key={i}>
                {message.imageUrl && (
                  <img src={message.imageUrl} alt="User uploaded" className="max-w-xs rounded-md mb-2" />
                )}
<Markdown className="text-xs lg:text-lg">

    {message.text}
</Markdown>
{message.isBot && (
          <Button
          variant="default"
            className="absolute top-2 -right-14 border-white border bg-transparent hover:bg-purple-800 text-white px-2 py-1 rounded"
            onClick={() => handleDownloadPDF(message.text.toString())}
          >
            <DownloadIcon className='h-5 w-5'/>
          </Button>
        )}

              </div>
            </div>
          </div>
        ))}
        {isBotTyping && (
          <div className="p-2 max-w-[5rem] items-center flex justify-center bg-[#853F67] text-white rounded-lg">
            <l-leapfrog
  size="27"
  speed="2.5" 
  color="black" 
></l-leapfrog>
          </div>
        )}
      </>
    ) : (
      <p className='flex items-center justify-center' >No active chat session</p>
    )}
  </div>
    {/* This is input */}
    <div className="fixed z-50 bottom-0 left-[60%] transform -translate-x-1/2 w-full flex justify-center px-4">
  <div
    className={`w-full max-h-32 max-w-4xl p-1.5 mb-3 text-black bg-[#d3d0d0] flex items-center rounded-3xl ${isSidebarOpen ? 'opacity-50 pointer-events-none' : ''}`}
  >
    <label className="ml-2 cursor-pointer">
      <input 
        type="file" 
        accept="image/*" 
        onChange={handleImageChange} 
        className="hidden" // Hiding the input element
      />
      <FaUpload className="text-gray-600 hover:text-gray-800 transition" size={24} />
    </label>

    <textarea
      ref={textareaRef}
      rows={1}
      placeholder={isSidebarOpen ? '' : 'Enter your prompt'}
      value={input}
      onChange={handleInputChange}
      onKeyDown={handleKeyPress}
      onKeyPress={(e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          handleMessageSend();
        }
      }}
      className='flex-grow px-3 py-2 text-lg text-black bg-transparent border-none resize-none focus:outline-none overflow-y-auto'
      style={{
        caretColor: 'black',
        maxHeight: '8rem', // Set maximum height
        overflowY: 'auto', // Show scrollbar when needed
        transition: 'height 0.2s ease',
        height: textareaRef.current ? `${textareaRef.current.scrollHeight}px` : 'auto',
      }}
      disabled={isSidebarOpen}  // Disable the textarea when sidebar is open
    />
{selectedImage && ( // Conditionally render the selected image and cross icon
  <div className="absolute top-[-4rem] flex items-center">
    <img 
      src={URL.createObjectURL(selectedImage)} // Display selected image
      alt="Selected"
      className="w-16 h-16 object-cover rounded-md mr-2" // Adjust width/height as needed
    />
    <button
      type="button"
      onClick={() => setSelectedImage(null)} // Function to remove image
      className="text-red-500 hover:text-red-700"
    >
      &times; {/* Cross icon */}
    </button>
  </div>
)}
    {!isSidebarOpen && ( // Conditionally render the send button
      <button
        onClick={handleMessageSend}
        className={`bg-transparent border-none flex items-center justify-center p-2 ${input.trim() ? 'text-white' : 'text-gray-500'}`}
        disabled={!input.trim()} // Disable button if there's no input
      >
        <FaPaperPlane className={`text-lg ${input.trim() ? ' text-[#853F67] ' : 'text-gray-600'}`} />
      </button>
    )}
  </div>
</div>




  </div>
  </BackdropGradient>
</div>

  );
};

export default Chatbotss;