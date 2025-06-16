import React, { useEffect, useRef, useState } from 'react'
import { useChatStore } from '../store/useChatStore.js'
import { useAuthStore } from '../store/useAuthStore.js'
import ChatHeader from './ChatHeader.jsx'
import MessageInput from './MessageInput.jsx'
import MessageSkeleton from './skeletons/MessageSkeleton.jsx'
import { formatMessageTime } from '../utils/util.js'
import { ChevronDown } from 'lucide-react'

function ChatContainer() {
    const {messages, getMessages, isMessageLoading, selectedUsers ,subscribeToMessages, unsubscribeFromMessages} = useChatStore();
    const {authUser} = useAuthStore();
    const messageEndRef = useRef(null);
    const messagesContainerRef = useRef(null);
    const [showScrollButton, setShowScrollButton] = useState(false);

    const scrollToBottom = () => {
        if (messageEndRef.current) {
            messageEndRef.current.scrollIntoView({
                behavior: "smooth",
                block: "end"
            });
        }
    };

    const handleScroll = () => {
        if (messagesContainerRef.current) {
            const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
            const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
            setShowScrollButton(!isNearBottom && messages.length > 0);
        }
    };

    // If no user is selected, show a placeholder
    if (!selectedUsers) {
        return (
            <div className='flex-1 flex flex-col items-center justify-center'>
                <div className="text-center">
                    <h3 className="text-lg font-medium mb-2">Welcome to ChatterBox!</h3>
                    <p className="text-base-content/60">Select a user from the sidebar to start chatting</p>
                </div>
            </div>
        );
    }

    useEffect(()=>{
        if(selectedUsers?._id) {
            getMessages(selectedUsers._id);
        }
        subscribeToMessages();
        return () => {
            unsubscribeFromMessages();
        };
    },[selectedUsers?._id,getMessages])

    // Scroll to bottom when messages first load (without animation)
    useEffect(() => {
        if (messages.length > 0 && !isMessageLoading) {
            // Immediate scroll for initial load
            setTimeout(() => {
                if (messageEndRef.current) {
                    messageEndRef.current.scrollIntoView({ block: "end" });
                }
            }, 50);
        }
    }, [isMessageLoading]);

    // Smooth scroll when new messages arrive
    useEffect(() => {
        if(messageEndRef.current && messages.length > 0) {
          // Use setTimeout to ensure DOM is updated before scrolling
          setTimeout(() => {
            scrollToBottom();
          }, 100);
        }
      }, [messages]);

    if(isMessageLoading){ return (
      <div className='flex-1 flex flex-col overflow-hidden'>
        <ChatHeader/>
        <MessageSkeleton/>
        <MessageInput/>
      </div>
    )}


  return (
    <div className='flex-1 flex flex-col overflow-hidden'>
      <ChatHeader/>
      <div className='flex-1 overflow-y-auto p-4 space-y-4 relative' ref={messagesContainerRef} onScroll={handleScroll}>
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-center">
            <p className="text-base-content/60">No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((message) => (
          <div key={message._id}
          className={`chat ${message.senderId === authUser?._id ? "chat-end" : "chat-start"}`}>
            <div className='chat-image avatar'>
              <div className='w-10 h-10 rounded-full border'>
                <img
                  src={message.senderId === authUser?._id
                    ? authUser?.profilepic || "/avatar.png"
                    : selectedUsers?.profilepic || "/avatar.png"
                  }
                  alt="Profile"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
            </div>
            <div className='chat-header mb-1'>
              <time className="text-xs opacity-50 ml-1">{formatMessageTime(message.createdAt)}</time>
            </div>
            <div className='chat-bubble flex flex-col'>
              {message.image && (
                <img src={message.image} alt="Message Image" className="sm:max-w-[200px] rounded-md mb-2"/>
              )}
              {message.text && <p>{message.text}</p>}
            </div>
          </div>
          ))
        )}
        {/* Scroll anchor - this div will be scrolled into view */}
        <div ref={messageEndRef} />

        {/* Scroll to bottom button */}
        {showScrollButton && (
          <button
            onClick={scrollToBottom}
            className="absolute bottom-4 right-4 btn btn-circle btn-primary shadow-lg z-10"
            title="Scroll to bottom"
          >
            <ChevronDown className="w-5 h-5" />
          </button>
        )}
      </div>
      <MessageInput/>
    </div>
  )
}

export default ChatContainer
