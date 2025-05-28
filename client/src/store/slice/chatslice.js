export const createChatSlice = (set, get) => ({
  // State
  selectedChatType: undefined,
  selectedChatData: undefined,
  selectedChatMessage: [],

  directMessagesContacts: [],
  
  // Actions
  setSelectedChatType: (chatType) => set({ selectedChatType: chatType }),
  
  setSelectedChatData: (chatData) => set({ selectedChatData: chatData }),
  
  setSelectedChatMessages: (messages) => set({ selectedChatMessage: messages }),
  setDirectMessagesContacts: (contacts) => set({ directMessagesContacts: contacts }),
  
  closeChat: () => set({
    selectedChatType: undefined,
    selectedChatData: undefined,
    selectedChatMessage: [],
  }),
  
  addMessage: (message) => {
    const { selectedChatMessage, selectedChatData, selectedChatType } = get();
    
    if (!selectedChatData || !selectedChatType) return;
    
    set({
      selectedChatMessage: [
        ...selectedChatMessage,
        {
          ...message,
          recipient: selectedChatType === 'channel' 
            ? message.recipient 
            : message.recipient._id,
          sender: selectedChatType === 'channel'
            ? message.sender
            : message.sender._id,
        }
      ],
    });
  },
});