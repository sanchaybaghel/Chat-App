import React from 'react'
import ChatHeader from './components/chat-header'
import MessageBar from './components/message-bar'
import MessageContainer from './components/message-container'

const ChatContainer = () => {
  return (
    <div className='h-full bg-[#1c1d25] flex flex-col w-full'>
        <ChatHeader />
        <MessageContainer />
        <MessageBar />
    </div>
  )
}

export default ChatContainer
