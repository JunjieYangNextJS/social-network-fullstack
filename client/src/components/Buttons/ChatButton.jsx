import React, { useState, useEffect } from "react";
import { Button, Tooltip } from "@mantine/core";
import {
  useOpenChat,
  useSetOpenChat,
  useChatRoomObj,
  useSetChatRoomObj,
} from "../../contexts/ChatRoomObjContext";
import useCreateChatRoom from "./../../react-query-hooks/useChats/useCreateChatRoom";
import { useDidUpdate } from "@mantine/hooks";

export default function ChatButton({
  user,
  otherUser,
  navigate,
  // allowChatting,
  whoCanMessageMe,
}) {
  const { mutate: createChatRoom, isLoading } = useCreateChatRoom(
    otherUser?.id
  );

  useDidUpdate(() => {
    setOpenChat(true);
  }, [isLoading]);

  const setOpenChat = useSetOpenChat();
  const chatRoomObj = useChatRoomObj();
  const setChatRoomObj = useSetChatRoomObj();

  const [hasChat, setHasChat] = useState(null);
  const [clickable, setClickable] = useState(false);

  useEffect(() => {
    if (!user?.chatRooms && !otherUser?.id) return;

    const selectedChatRoom = user?.chatRooms?.find((chatRoom) =>
      chatRoom?.users?.find((user) => user?.user?.id === otherUser?.id)
    );

    selectedChatRoom && setHasChat(selectedChatRoom);
    setClickable(true);
  }, [otherUser?.id, user?.chatRooms]);

  const handleStartChat = () => {
    if (!clickable) return;
    if (hasChat) {
      setChatRoomObj(hasChat);
      setOpenChat(true);
    } else {
      setClickable(false);
      createChatRoom({
        users: [{ user: otherUser?._id }, { user: user?._id }],
      });
    }
  };

  return (
    <>
      {whoCanMessageMe === "none" ||
      (otherUser.whoCanMessageMe === "friendsOnly" &&
        !otherUser.friendList.includes(user?.id)) ? (
        <Tooltip label="This person disallowed chatting">
          <Button
            onClick={() => handleStartChat()}
            radius="xl"
            variant="gradient"
            disabled={
              whoCanMessageMe === "none" ||
              (otherUser.whoCanMessageMe === "friendsOnly" &&
                !otherUser.friendList.includes(user?.id))
            }
            gradient={{ from: "teal", to: "blue", deg: 60 }}
          >
            Chat
          </Button>
        </Tooltip>
      ) : (
        <Button
          onClick={() => handleStartChat()}
          radius="xl"
          variant="gradient"
          gradient={{ from: "teal", to: "blue", deg: 60 }}
        >
          Chat
        </Button>
      )}
    </>
  );
}
