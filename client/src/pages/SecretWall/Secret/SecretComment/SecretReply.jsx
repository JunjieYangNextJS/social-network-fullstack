import React, { useState, useEffect } from "react";
import {
  Container,
  Button,
  createStyles,
  Center,
  Card,
  Text,
  TextInput,
  Textarea,
  Group,
  Divider,
  Box,
  Stack,
  Avatar,
} from "@mantine/core";
import { useClickOutside } from "@mantine/hooks";

import calcTimeAgo from "../../../../utility/calcTimeAgo";
import EditableContentDiv from "../../../../components/ReusableDivs/EditableContentDiv";
import SecretReplyActionMenu from "./SecretReplyActionMenu";
import { useEditSecretReply } from "./../../../../react-query-hooks/useSecrets/useSecretComments/useModifySecretReply";

const useStyles = createStyles((theme) => ({
  container: {
    padding: 10,
  },

  div: {
    maxWidth: "350px",
    border: "1px solid black",
  },
}));

export default function SecretReply({ reply, user, commentInfo, index }) {
  const { classes, theme } = useStyles();
  const [readOnly, setReadOnly] = useState(true);
  const [value, setValue] = useState("");
  const [entered, setEntered] = useState(false);

  // const ref = useClickOutside(() => setReadOnly(true));
  const { mutate: editSecretReply } = useEditSecretReply(commentInfo._id);

  useEffect(() => {
    setValue(reply?.content);
  }, [reply?.content]);

  const handleConfirmReply = () => {
    editSecretReply({
      content: value,
      commentId: commentInfo._id,
      replyId: reply._id,
    });
    setReadOnly(true);
  };

  const handleCancelReply = () => {
    setValue(reply?.content);
    setReadOnly(true);
  };

  return (
    <Group
      className={classes.container}
      onMouseEnter={() => setEntered(true)}
      onMouseLeave={() => setEntered(false)}
      position={reply?.replier === user?.id ? "right" : "left"}
    >
      <Stack
        align={reply?.replier === user?.id ? "flex-end" : "flex-start"}
        spacing={1}
      >
        {reply?.replier === user?.id ? (
          <Group spacing={5}>
            <EditableContentDiv
              setValue={setValue}
              value={value}
              handleCancelReply={handleCancelReply}
              handleConfirmReply={handleConfirmReply}
              // ref={ref}
              isMe={reply?.replier === user?.id}
              readOnly={readOnly}
            />
            <Avatar color="cyan" radius="xl" sx={{ height: 45, width: 45 }}>
              You
            </Avatar>
          </Group>
        ) : (
          <Group spacing={5}>
            <Avatar color="blue" radius="xl" sx={{ height: 45, width: 45 }}>
              {index ? index : "They"}
            </Avatar>
            <EditableContentDiv
              setValue={setValue}
              value={value}
              handleCancelReply={handleCancelReply}
              handleConfirmReply={handleConfirmReply}
              // ref={ref}
              isMe={reply?.replier === user?.id}
              readOnly={readOnly}
            />
          </Group>
        )}
        {reply?.replier === user?.id ? (
          <Group spacing={2}>
            <Text size="xs" color="dimmed">
              {reply?.editedAt
                ? calcTimeAgo(reply?.editedAt) + " (edited)"
                : calcTimeAgo(reply?.createdAt)}
            </Text>
            <SecretReplyActionMenu
              userId={user?.id}
              reply={reply}
              setReadOnly={setReadOnly}
              entered={entered}
              commentInfo={commentInfo}
            />
          </Group>
        ) : (
          <Group spacing={2}>
            <SecretReplyActionMenu
              userId={user?.id}
              reply={reply}
              setReadOnly={setReadOnly}
              entered={entered}
              commentInfo={commentInfo}
              index={index}
            />
            <Text size="xs" color="dimmed">
              {reply?.editedAt
                ? calcTimeAgo(reply?.editedAt) + " (edited)"
                : calcTimeAgo(reply?.createdAt)}
            </Text>
          </Group>
        )}
      </Stack>
    </Group>
  );
}
