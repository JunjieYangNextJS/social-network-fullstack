import React, { useState, useEffect, useMemo } from "react";
import { Container, Button, Group, Text } from "@mantine/core";
import StoryReply from "./StoryReply";
import { ArrowForward } from "tabler-icons-react";

export default function StoryRepliesContainer({
  replies,
  user,
  story,
  //   refetch,
  //   index,
}) {
  const [repliesShown, setRepliesShown] = useState(3);

  // const sortedReplies = useMemo(() => {
  //   const cloned = [...replies];
  //   return cloned.sort((a, _b) => (a.replier.id === userId ? -1 : 1));
  // }, [replies, userId]);

  return (
    <Container>
      {replies?.slice(0, repliesShown).map((reply) => (
        <StoryReply
          key={reply?.id}
          reply={reply}
          user={user}
          //   refetch={refetch}
          //   index={index}
        />
      ))}
      {repliesShown < replies.length && (
        <Button
          variant="subtle"
          color="gray"
          size="xs"
          onClick={() => setRepliesShown((prev) => prev + 10)}
        >
          <Group spacing={3}>
            <ArrowForward size={14} />

            <Text size={14} color="dimmed">
              More replies
            </Text>
          </Group>
        </Button>
      )}
    </Container>
  );
}
