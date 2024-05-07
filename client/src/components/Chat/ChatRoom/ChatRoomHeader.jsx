import React from "react";
import { useQueryClient } from "react-query";
import { ArrowDown } from "tabler-icons-react";
import { ActionIcon, Group, Text } from "@mantine/core";
import ChatConfigMenu from "./ChatConfigMenu";
import { useSetChatRoomObj } from "./../../../contexts/ChatRoomObjContext";

export default function ChatRoomHeader({
  classes,
  setOpenChat,
  otherUserObjUser,
  chatRoomId,
  userObj,
}) {
  const queryClient = useQueryClient();
  const setChatRoomObj = useSetChatRoomObj();

  const handleCloseChat = () => {
    setOpenChat(false);
    setChatRoomObj(null);
  };

  return (
    <div className={classes.header}>
      <Group position="apart" sx={{ marginTop: 10 }}>
        <Text
          size="lg"
          sx={{
            maxWidth: 200,
            overflow: "hidden",
            whiteSpace: "nowrap",
          }}
        >
          {otherUserObjUser?.username}
        </Text>
        <Group spacing={1}>
          {chatRoomId && (
            <ChatConfigMenu chatRoomId={chatRoomId} userObj={userObj} />
          )}
          <ActionIcon onClick={() => handleCloseChat()}>
            <ArrowDown size={22} />
          </ActionIcon>
        </Group>
      </Group>
    </div>
  );
}
