import React, { useState, useEffect } from 'react';
import { ActionIcon, Button, Group, Textarea } from '@mantine/core';
import useCreateChatMessage from '../../../react-query-hooks/useChats/useCreateChatMessage';
import { useDidUpdate } from '@mantine/hooks';
import Picker from 'emoji-picker-react';
import { MoodSmile } from 'tabler-icons-react';

export default function SendMessageContainer({
  chatRoomId,
  user,
  socket,
  oldMessages,
  queryClient,
  uuidv4,
  scrollToBottom,
  otherUserObj,
  disableMessageText
}) {
  const [value, setValue] = useState('');
  const [openPicker, setOpenPicker] = useState(false);
  const {
    mutate: createChatMessage,
    isLoading,
    isSuccess
  } = useCreateChatMessage(chatRoomId, otherUserObj);

  useDidUpdate(() => {
    scrollToBottom();
  }, [isLoading]);

  const sendMessage = () => {
    socket.emit('sendMessage', {
      sender: user.id,
      receiverId: otherUserObj?.user.id,
      content: value,
      chatRoom: chatRoomId
    });

    createChatMessage({
      chatRoom: chatRoomId,
      sender: user.id,
      receiverId: otherUserObj?.user.id,
      content: value
    });

    const uuid = uuidv4();

    queryClient.setQueryData(['chatMessages', chatRoomId], old => {
      return [
        ...old,
        {
          sender: user.id,
          content: value,
          chatRoom: chatRoomId,
          createdAt: Date.now(),
          id: uuid,
          _id: uuid
        }
      ];
    });

    queryClient.setQueryData(['user'], old => {
      const index = old.chatRooms.findIndex(el => el.id === chatRoomId);

      let clonedArray = [...old.chatRooms];
      clonedArray[index].lastMessage = value;
      clonedArray[index].lastModified = Date.now();
      clonedArray[index].totalMessages = clonedArray[index].totalMessages + 1;

      return { ...old, chatRooms: clonedArray };
    });

    setValue('');
  };

  const handleSendMessage = () => {
    sendMessage();
    // socket.current.emit("sendMessage", {
    //   senderId: userId,
    //   receiverId: otherUserObj?.user.id,
    //   text: value,
    // });
  };

  const onEmojiClick = (event, emojiObject) => {
    setValue(prev => prev + emojiObject.emoji);
  };

  const handleKeyDown = e => {
    if (e.key === 'Enter' && e.ctrlKey) {
      sendMessage();
    }
  };

  return (
    <div style={{ position: 'relative' }}>
      <div
        style={{
          position: 'absolute',
          left: -280,
          top: -230
        }}
      >
        {openPicker && <Picker onEmojiClick={onEmojiClick} native />}
      </div>

      <Textarea
        placeholder="Your message"
        radius="md"
        value={value}
        onChange={e => setValue(e.currentTarget.value)}
        onKeyDown={e => handleKeyDown(e)}
      />

      <Group position="apart">
        <ActionIcon onClick={() => setOpenPicker(!openPicker)}>
          <MoodSmile />
        </ActionIcon>
        <Button
          variant="subtle"
          onClick={() => handleSendMessage()}
          disabled={disableMessageText}
        >
          Send
        </Button>
      </Group>
    </div>
  );
}
