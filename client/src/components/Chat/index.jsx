import React, { useState, useEffect, useRef } from 'react';
import {
  Text,
  Paper,
  Container,
  Stack,
  createStyles,
  Box,
  Group,
  Collapse
} from '@mantine/core';
import ChatRooms from './ChatRooms';
import ChatRoom from './ChatRoom/ChatRoom';
import {
  useOpenChat,
  useSetOpenChat,
  useChatRoomObj
} from './../../contexts/ChatRoomObjContext';
import { io } from 'socket.io-client';
import socketUrl from './../../utility/socketUrl';

import { useQueryClient } from 'react-query';

export default function Chat({ user }) {
  const queryClient = useQueryClient();
  // const [arrivalMessage, setArrivalMessage] = useState(null);
  // const chatNotifications = useChatNotifications();
  // const setChatNotifications = useSetChatNotifications();
  // const lastMessage = useLastMessage();
  // const setLastMessage = useSetLastMessage();
  const openChat = useOpenChat();
  const setOpenChat = useSetOpenChat();
  const chatRoomObj = useChatRoomObj();

  const socket = useRef();

  const chatRoomObjRef = useRef();
  const userRef = useRef();

  useEffect(() => {
    socket.current = io(socketUrl, {
      transports: ['websocket']
    });
    socket.current.emit('setup', user);
    socket.current.on('connection');
  }, [user]);

  useEffect(() => {
    chatRoomObjRef.current = chatRoomObj;
    userRef.current = user;
  });

  useEffect(() => {
    socket.current?.on('getMessage', data => {
      if (!userRef.current.chatRooms.some(el => el._id === data.chatRoom))
        return;

      if (
        !chatRoomObjRef.current ||
        chatRoomObjRef.current.id !== data.chatRoom
      ) {
        // give noti

        queryClient.setQueryData(['user'], old => {
          const index = old.chatRooms.findIndex(el => el.id === data.chatRoom);

          let clonedArray = [...old.chatRooms];

          if (clonedArray[index].lastModified !== data.createdAt) {
            clonedArray[index].lastMessage = data.content;
            clonedArray[index].lastModified = data.createdAt;
            clonedArray[index].totalMessages =
              clonedArray[index].totalMessages + 1;

            // increment unread when not opening chat
            const userIndex = clonedArray[index].users.findIndex(
              el => el.user._id === user?.id
            );

            clonedArray[index].users[userIndex].totalUnread =
              clonedArray[index].users[userIndex].totalUnread + 1;
            clonedArray[index].users[userIndex].left = false;
          }

          return { ...old, chatRooms: clonedArray };
        });
      } else {
        queryClient.setQueryData(['chatMessages', data.chatRoom], old => {
          if (old.some(el => el.id === data.id)) {
            return [...old];
          } else {
            return [...old, data];
          }
        });

        queryClient.setQueryData(['user'], old => {
          const index = old.chatRooms.findIndex(el => el.id === data.chatRoom);

          let clonedArray = [...old.chatRooms];

          if (clonedArray[index].lastModified !== data.createdAt) {
            clonedArray[index].lastMessage = data.content;
            clonedArray[index].lastModified = data.createdAt;
            clonedArray[index].totalMessages =
              clonedArray[index].totalMessages + 1;
          }

          return { ...old, chatRooms: clonedArray };
        });
      }
    });
  });

  let allTotalUnreadCount = 0;

  if (user && user?.chatRooms && user?.chatRooms?.length >= 1) {
    for (const chatRoom of user.chatRooms) {
      if (chatRoom.users) {
        for (const person of chatRoom.users) {
          if (person?.user?.id === user?.id && !person?.muted) {
            allTotalUnreadCount += person?.totalUnread;
          }
        }
      }
    }
  }

  const handleOpenChat = () => {
    setOpenChat(true);
  };

  return (
    <div style={{ position: 'fixed', bottom: 0, right: 50 }}>
      {user && socket && openChat ? (
        <Paper
          withBorder
          shadow="lg"
          style={{ display: 'flex', width: 650, height: 650 }}
        >
          <ChatRooms user={user} />
          <ChatRoom
            user={user}
            setOpenChat={setOpenChat}
            socket={socket?.current}
            chatRoomObj={chatRoomObjRef.current}
          />
        </Paper>
      ) : (
        <Paper
          withBorder
          shadow="lg"
          p="md"
          onClick={() => handleOpenChat()}
          sx={{ cursor: 'pointer' }}
        >
          <Group>
            <Text>Chat</Text>

            {allTotalUnreadCount !== 0 && <Text>{allTotalUnreadCount}</Text>}
          </Group>
        </Paper>
      )}
    </div>
  );
}
