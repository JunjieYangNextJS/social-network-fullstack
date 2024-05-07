import React, { useState, useEffect } from 'react';
import {
  createStyles,
  Navbar,
  Group,
  Code,
  Avatar,
  Menu,
  Divider,
  Text,
  ScrollArea,
  ActionIcon,
  Stack
} from '@mantine/core';
import { BellRinging, BellOff, Pin } from 'tabler-icons-react';
import usePatchEraseUnreadCount from './../../../react-query-hooks/useChats/usePatchEraseUnreadCount';

import {
  useSetChatRoomObj,
  useChatRoomObj
} from './../../../contexts/ChatRoomObjContext';

export default function ChatRooms({ user }) {
  const { classes, cx } = useStyles();

  const chatRoomObj = useChatRoomObj();
  const setChatRoomObj = useSetChatRoomObj();

  const [rooms, setRooms] = useState(null);
  const { mutate: patchEraseUnreadCount } = usePatchEraseUnreadCount();

  const clickChatRoom = chatRoom => {
    setChatRoomObj(chatRoom);
    patchEraseUnreadCount({ chatRoom: chatRoom?.id });
  };

  useEffect(() => {
    if (user?.chatRooms.length >= 1) {
      const unLeftChatRooms = user?.chatRooms
        ?.filter(chatRoom =>
          chatRoom?.users?.some(
            person => person?.user.id === user?.id && person?.left === false
          )
        )
        .sort(
          (a, b) =>
            new Date(b.lastModified).getTime() -
            new Date(a.lastModified).getTime()
        );

      setRooms(
        unLeftChatRooms.reduce(
          (ctx, el) => {
            // if (leftChats?.includes(el?.id)) return ctx;

            if (
              el.users.some(
                person => person.user.id === user.id && person.pinned === true
              )
            ) {
              ctx.pinnedChatRooms.push(el);
            } else {
              ctx.unPinnedChatRooms.push(el);
            }
            return ctx;
          },
          { pinnedChatRooms: [], unPinnedChatRooms: [] }
        )
      );
    }
  }, [user]);

  return (
    <div className={classes.container}>
      <div
        style={{
          height: 50,
          display: 'flex',
          alignItems: 'center',
          marginLeft: 20,
          fontSize: 22
        }}
      >
        Chat
      </div>
      <ScrollArea sx={{ width: 250, height: '450px' }}>
        {rooms?.pinnedChatRooms.length !== 0 && (
          <>
            {rooms?.pinnedChatRooms?.map(chatRoom => {
              const otherUserObj = chatRoom?.users?.find(
                el => el?.user?.id !== user?.id
              );

              const myObj = chatRoom?.users?.find(
                el => el?.user?.id === user?.id
              );

              return (
                <div
                  className={cx(classes.chatRoom, {
                    [classes.chatRoomActive]: chatRoom?.id === chatRoomObj?.id
                  })}
                  key={chatRoom?.id}
                  style={{ cursor: 'pointer' }}
                  onClick={() => clickChatRoom(chatRoom)}
                >
                  <Group>
                    {otherUserObj && (
                      <Avatar
                        size={40}
                        src={otherUserObj?.user.photo}
                        radius={40}
                      />
                    )}

                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column'
                      }}
                    >
                      <span className={classes.usernameText}>
                        {otherUserObj?.user.username}
                      </span>

                      <span className={classes.lastMessageText}>
                        {chatRoom.lastMessage}
                      </span>
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center'
                      }}
                    >
                      <Text
                        sx={{
                          visibility:
                            myObj?.totalUnread === 0 ? 'hidden' : 'default'
                        }}
                      >
                        {myObj?.totalUnread}
                      </Text>
                      <Stack spacing={0}>
                        {myObj?.pinned && (
                          <ActionIcon variant="transparent" color="yellow">
                            <Pin size={15} />
                          </ActionIcon>
                        )}
                        {myObj?.muted && (
                          <ActionIcon variant="transparent">
                            <BellOff size={15} />
                          </ActionIcon>
                        )}
                      </Stack>
                    </div>
                  </Group>
                </div>
              );
            })}
            {/* <Divider /> */}
          </>
        )}
        {rooms?.unPinnedChatRooms?.map(chatRoom => {
          const otherUserObj = chatRoom?.users?.find(
            el => el?.user?.id !== user?.id
          );

          const myObj = chatRoom?.users?.find(el => el?.user?.id === user?.id);

          return (
            <div
              className={cx(classes.chatRoom, {
                [classes.chatRoomActive]: chatRoom?.id === chatRoomObj?.id
              })}
              key={chatRoom?.id}
              style={{ cursor: 'pointer' }}
              onClick={() => clickChatRoom(chatRoom)}
            >
              <Group>
                {otherUserObj && (
                  <Avatar
                    size={40}
                    src={otherUserObj?.user.photo}
                    radius={40}
                  />
                )}

                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                >
                  <span className={classes.usernameText}>
                    {otherUserObj?.user.username}
                  </span>

                  <span className={classes.lastMessageText}>
                    {chatRoom.lastMessage}
                  </span>
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  <Text
                    sx={{
                      visibility:
                        myObj?.totalUnread === 0 ? 'hidden' : 'default'
                    }}
                  >
                    {myObj?.totalUnread}
                  </Text>
                  {myObj?.muted && (
                    <ActionIcon variant="transparent">
                      <BellOff size={15} />
                    </ActionIcon>
                  )}
                </div>
              </Group>
            </div>
          );
        })}
      </ScrollArea>
    </div>
  );
}

const useStyles = createStyles((theme, _params, getRef) => {
  const icon = getRef('icon');
  return {
    container: {
      width: 240,
      display: 'flex',
      flexDirection: 'column',
      borderRight: '1px solid #e9ecef'
    },

    header: {
      paddingBottom: theme.spacing.md,
      marginBottom: theme.spacing.md * 1.5
    },

    footer: {
      paddingTop: theme.spacing.md,
      marginTop: theme.spacing.md,
      borderTop: `1px solid ${
        theme.colorScheme === 'dark'
          ? theme.colors.dark[4]
          : theme.colors.gray[2]
      }`
    },

    usernameText: {
      textOverflow: 'ellipsis',
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      width: '100px',
      height: '100%'
      // width: "40px",
    },

    lastMessageText: {
      textOverflow: 'ellipsis',
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      width: '100px',
      height: '100%'
    },

    chatRoom: {
      ...theme.fn.focusStyles(),
      height: 60,
      width: 216,
      display: 'flex',
      alignItems: 'center',
      // cursor: "pointer",
      textDecoration: 'none',
      fontSize: theme.fontSizes.sm,
      color:
        theme.colorScheme === 'dark'
          ? theme.colors.dark[1]
          : theme.colors.gray[7],
      padding: `${theme.spacing.xs}px ${theme.spacing.sm}px`,
      borderRadius: theme.radius.sm,
      fontWeight: 500,

      '&:hover': {
        backgroundColor:
          theme.colorScheme === 'dark'
            ? theme.colors.dark[6]
            : theme.colors.gray[0],
        color: theme.colorScheme === 'dark' ? theme.white : theme.black,

        [`& .${icon}`]: {
          color: theme.colorScheme === 'dark' ? theme.white : theme.black
        }
      }
    },

    chatRoomIcon: {
      ref: icon,
      color:
        theme.colorScheme === 'dark'
          ? theme.colors.dark[2]
          : theme.colors.gray[6],
      marginRight: theme.spacing.sm
    },

    chatRoomActive: {
      '&, &:hover': {
        backgroundColor:
          theme.colorScheme === 'dark'
            ? theme.fn.rgba(theme.colors[theme.primaryColor][8], 0.25)
            : theme.colors[theme.primaryColor][0],
        color:
          theme.colorScheme === 'dark'
            ? theme.white
            : theme.colors[theme.primaryColor][7],
        [`& .${icon}`]: {
          color:
            theme.colors[theme.primaryColor][
              theme.colorScheme === 'dark' ? 5 : 7
            ]
        }
      }
    }
  };
});

// {rooms &&
// rooms.pinnedChatRooms.length !== 0 &&
// rooms.pinnedChatRooms?.map((chatRoom) => {
//   const otherUserObj = chatRoom?.users?.find(
//     (el) => el?.user?.id !== user?.id
//   );

//   return (
//     <div
//       className={cx(classes.chatRoom, {
//         [classes.chatRoomActive]: chatRoom?.id === chatRoomObj?.id,
//       })}
//       key={chatRoom?.id}
//       // style={{
//       //   display: chatRoom.users.some(
//       //     (person) =>
//       //       person.user.id === user.id && person.left === false
//       //   )
//       //     ? "none"
//       //     : "default",
//       // }}
//       onClick={() => {
//         // setSelectedRoomId(chatRoom?.id);
//         setChatRoomObj(chatRoom);
//         patchEraseUnreadCount({ chatRoom: chatRoom?.id });
//         // setChatNotifications((prev) =>
//         //   prev.filter((el) => el?.chatRoom !== chatRoom?.id)
//         // );
//       }}
//     >
//       <Group>
//         {/* <Avatar
//             size={40}
//             src={require(`./../../../images/users/${otherUserObj?.user.photo}`)}
//             radius={40}
//           /> */}

//         <Group>
//           <span className={classes.usernameText}>
//             {otherUserObj?.user.username}
//           </span>
//           {/* {chatNotificationsCount && (
//                 <span>{chatNotificationsCount}</span>
//               )} */}
//         </Group>
//         <span className={classes.lastMessageText}>
//           {chatRoom.lastMessage}
//         </span>
//       </Group>
//     </div>
//   );
// })}
