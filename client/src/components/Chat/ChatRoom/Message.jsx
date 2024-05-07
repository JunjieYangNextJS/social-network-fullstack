import React from "react";
import { createStyles, Text, Avatar, Group } from "@mantine/core";
import calcTimeAgo from "./../../../utility/calcTimeAgo";

const useStyles = createStyles((theme) => ({
  body: {
    paddingLeft: 54,
    paddingTop: theme.spacing.sm,
  },
}));

export default function Message({
  createdAt,
  content,
  chatRoomUsers,
  user,
  sender,
  edited,
}) {
  const { classes } = useStyles();

  const userIndex = chatRoomUsers.findIndex((el) => el.id === user?.id);

  const otherUserIndex = userIndex === 1 ? 0 : 1;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",

        alignItems: user?.id === sender ? "flex-end" : "flex-start",
      }}
    >
      {user?.id === sender ? (
        <div
          style={{
            padding: "15px 0",
          }}
        >
          <Group align={"start"} position="right">
            <Text
              size="md"
              sx={{
                maxWidth: 200,
                marginTop: 5,
                overflowWrap: "break-word",
              }}
            >
              {content}
            </Text>
            <Avatar
              src={chatRoomUsers[userIndex]?.photo}
              alt="myPhoto"
              radius="xl"
            />
          </Group>
          <Text sx={{ fontSize: 12 }} color="dimmed">
            {calcTimeAgo(createdAt)}
          </Text>
          {edited && <div>edited</div>}
        </div>
      ) : (
        <div
          style={{
            padding: "15px 0",
          }}
        >
          <Group align={"start"} position="left">
            <Avatar
              src={chatRoomUsers[otherUserIndex]?.photo}
              alt="otherUserPhoto"
              radius="xl"
            />
            <Text
              size="md"
              sx={{
                marginTop: 5,
                maxWidth: 200,
                overflowWrap: "break-word",
              }}
            >
              {content}
            </Text>
          </Group>
          <Text sx={{ fontSize: 12 }} color="dimmed">
            {calcTimeAgo(createdAt)}
          </Text>
          {edited && <div>edited</div>}
        </div>
      )}
    </div>
  );
}
