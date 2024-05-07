import React, { useState, useEffect, useRef } from 'react';
import {
  Container,
  ScrollArea,
  createStyles,
  Button,
  Center
} from '@mantine/core';
import axios from 'axios';
import backendApi from './../../../utility/backendApi';
import { useQueryClient, useQuery } from 'react-query';
import Message from './Message';
import SendMessageContainer from './SendMessageContainer';

import { v4 as uuidv4 } from 'uuid';
import ChatRoomHeader from './ChatRoomHeader';

import PastMessagesDialog from '../PastMessagesDialog/PastMessagesDialog';

export default function ChatRoom({
  user,
  setOpenChat,
  socket,
  chatRoomObj,
  arrivalMessage
}) {
  // let selectedChatCompare;
  const userObj = chatRoomObj?.users?.find(el => el.user.id === user.id);

  useEffect(() => {
    socket?.emit('join chat', chatRoomObj?.id);
  }, [chatRoomObj, socket]);

  const { classes } = useStyles();
  const queryClient = useQueryClient();

  const limit = 10;

  const fetchChatMessages = () => {
    return axios
      .get(
        `${backendApi}chatMessages/${
          chatRoomObj?.id
        }?sort=-createdAt&limit=${limit}`,
        {
          withCredentials: true
        }
      )
      .then(res => res.data.data.data);
  };

  const { data } = useQuery(
    ['chatMessages', chatRoomObj?.id],
    fetchChatMessages,
    {
      enabled: !!chatRoomObj
    }
  );

  // define users
  const chatRoomUsers = chatRoomObj?.users?.map(user => user.user);

  // message authorization

  const otherUserObj = chatRoomObj?.users?.find(el => el.user.id !== user.id);

  // scroll to last message ref

  const messagesEndRef = useRef();

  const scrollToBottom = () => {
    messagesEndRef?.current?.scrollIntoView({
      behavior: 'smooth'
    });
  };

  useEffect(() => {
    messagesEndRef?.current?.scrollIntoView();
  }, [data]);

  const [disableMessageText, setDisableMessageText] = useState(null);
  const [canMessage, setCanMessage] = useState(false);
  const [dialogOpened, setDialogOpened] = useState(false);

  useEffect(() => {
    if (otherUserObj?.user.whoCanMessageMe === 'none')
      setDisableMessageText('This user does not allow direct message.');
    if (
      otherUserObj?.user.whoCanMessageMe === 'friendsOnly' &&
      !user?.friendList.some(friend => friend.id === otherUserObj?.user.id)
    ) {
      setDisableMessageText(
        'This user only allows their friends to message them.'
      );
    }

    if (
      otherUserObj?.user.whoCanMessageMe === 'friendsAndPeopleIFollowed' &&
      !user?.friendList.some(friend => friend.id === otherUserObj?.user.id) &&
      !user?.following.some(person => person.id === otherUserObj?.user.id)
    )
      setDisableMessageText(
        'This user only allows their friends and people they followed to message them.'
      );

    setCanMessage(true);
  }, [otherUserObj?.user, user?.friendList, user?.following]);

  return (
    <Container className={classes.chatRoom}>
      <ChatRoomHeader
        classes={classes}
        setOpenChat={setOpenChat}
        otherUserObjUser={otherUserObj?.user}
        chatRoomId={chatRoomObj?.id}
        userObj={userObj}
      />
      {chatRoomObj && user && (
        <>
          <div>
            <ScrollArea style={{ height: '470px' }} type="never">
              {data?.length >= limit && (
                <Center>
                  <Button
                    variant="white"
                    onClick={() => setDialogOpened(!dialogOpened)}
                  >
                    View more
                  </Button>
                </Center>
              )}

              <PastMessagesDialog
                user={user}
                opened={dialogOpened}
                setOpened={setDialogOpened}
                chatRoomObjId={chatRoomObj?.id}
                chatRoomUsers={chatRoomUsers}
              />
              {data &&
                data.map(message => {
                  const { content, createdAt, edited, id, sender } = message;
                  return (
                    <Message
                      key={id}
                      content={content}
                      createdAt={createdAt}
                      edited={edited}
                      sender={sender}
                      chatRoomUsers={chatRoomUsers}
                      user={user}
                    />
                  );
                })}
              <div ref={messagesEndRef} />
            </ScrollArea>
          </div>
          {disableMessageText && <div>{disableMessageText}</div>}

          {canMessage && user && (
            <SendMessageContainer
              chatRoomId={chatRoomObj?.id}
              user={user}
              socket={socket}
              oldMessages={data}
              queryClient={queryClient}
              uuidv4={uuidv4}
              scrollToBottom={scrollToBottom}
              otherUserObj={otherUserObj}
              disableMessageText={disableMessageText}
            />
          )}
        </>
      )}
    </Container>
  );
}

const useStyles = createStyles((theme, _params, getRef) => {
  return {
    chatRoom: {
      width: '500px'
    },
    header: {
      height: 50,

      fontSize: 22
    }
  };
});
