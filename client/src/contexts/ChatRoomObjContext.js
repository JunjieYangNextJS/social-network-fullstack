import React, { useContext, useState, useEffect } from 'react';

// create custom context
const ChatRoomObjContext = React.createContext();

const SetChatRoomObjContext = React.createContext();

const OpenChatContext = React.createContext();

const SetOpenChatContext = React.createContext();

const ChatNotificationsContext = React.createContext();

const SetChatNotificationsContext = React.createContext();

const LastMessageContext = React.createContext();

const SetLastMessageContext = React.createContext();

const PinnedChatsContext = React.createContext();

const SetPinnedChatsContext = React.createContext();

const MutedChatsContext = React.createContext();

const SetMutedChatsContext = React.createContext();

const LeftChatsContext = React.createContext();

const SetLeftChatsContext = React.createContext();

// export useable functions to child
export function useChatRoomObj() {
  return useContext(ChatRoomObjContext);
}

export function useSetChatRoomObj() {
  return useContext(SetChatRoomObjContext);
}

export function useOpenChat() {
  return useContext(OpenChatContext);
}

export function useSetOpenChat() {
  return useContext(SetOpenChatContext);
}

export function useChatNotifications() {
  return useContext(ChatNotificationsContext);
}

export function useSetChatNotifications() {
  return useContext(SetChatNotificationsContext);
}

export function useLastMessage() {
  return useContext(LastMessageContext);
}

export function useSetLastMessage() {
  return useContext(SetLastMessageContext);
}

export function usePinnedChats() {
  return useContext(PinnedChatsContext);
}

export function useSetPinnedChats() {
  return useContext(SetPinnedChatsContext);
}

export function useMutedChats() {
  return useContext(MutedChatsContext);
}

export function useSetMutedChats() {
  return useContext(SetMutedChatsContext);
}

export function useLeftChats() {
  return useContext(LeftChatsContext);
}

export function useSetLeftChats() {
  return useContext(SetLeftChatsContext);
}

// export to _app.js
export function ChatRoomObjProvider({ children }) {
  const [chatRoomObj, setChatRoomObj] = useState(null);
  const [openChat, setOpenChat] = useState(false);
  const [chatNotifications, setChatNotifications] = useState([]);
  const [lastMessage, setLastMessage] = useState([]);
  const [pinnedChats, setPinnedChats] = useState([]);
  const [mutedChats, setMutedChats] = useState([]);
  const [leftChats, setLeftChats] = useState([]);

  // being returned for AccountProvider(main) function
  return (
    <LeftChatsContext.Provider value={leftChats}>
      <SetLeftChatsContext.Provider value={setLeftChats}>
        <MutedChatsContext.Provider value={mutedChats}>
          <SetMutedChatsContext.Provider value={setMutedChats}>
            <PinnedChatsContext.Provider value={pinnedChats}>
              <SetPinnedChatsContext.Provider value={setPinnedChats}>
                <ChatNotificationsContext.Provider value={chatNotifications}>
                  <SetChatNotificationsContext.Provider
                    value={setChatNotifications}
                  >
                    <LastMessageContext.Provider value={lastMessage}>
                      <SetLastMessageContext.Provider value={setLastMessage}>
                        <OpenChatContext.Provider value={openChat}>
                          <SetOpenChatContext.Provider value={setOpenChat}>
                            <ChatRoomObjContext.Provider value={chatRoomObj}>
                              <SetChatRoomObjContext.Provider
                                value={setChatRoomObj}
                              >
                                {children}
                              </SetChatRoomObjContext.Provider>
                            </ChatRoomObjContext.Provider>
                          </SetOpenChatContext.Provider>
                        </OpenChatContext.Provider>
                      </SetLastMessageContext.Provider>
                    </LastMessageContext.Provider>
                  </SetChatNotificationsContext.Provider>
                </ChatNotificationsContext.Provider>
              </SetPinnedChatsContext.Provider>
            </PinnedChatsContext.Provider>
          </SetMutedChatsContext.Provider>
        </MutedChatsContext.Provider>
      </SetLeftChatsContext.Provider>
    </LeftChatsContext.Provider>
  );
}
