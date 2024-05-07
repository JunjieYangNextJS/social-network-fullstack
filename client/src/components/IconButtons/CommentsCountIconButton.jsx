import React from "react";
import { BrandHipchat } from "tabler-icons-react";
import { Tooltip, Center, Text, Group } from "@mantine/core";

export default function CommentsCountIconButton({ commentsCount, isReply }) {
  return (
    <Tooltip
      wrapLines
      withArrow
      transition="fade"
      transitionDuration={200}
      label={isReply ? "Replies" : "Comments"}
    >
      <Center sx={{ marginBottom: -2 }}>
        <BrandHipchat size={16} color={"#5C5F66"} />
        <Text size="xs" color="#5C5F66">
          {commentsCount}
        </Text>
      </Center>
    </Tooltip>
  );
}
