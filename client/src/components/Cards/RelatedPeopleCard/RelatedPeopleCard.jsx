import React from "react";
import RelatedPeopleNavButton from "./RelatedPeopleNavButton";
import { Card, Divider, Stack, Text } from "@mantine/core";

export default function RelatedPeopleCard({
  user,
  message,
  items,
  otherUserId,
}) {
  return (
    <Card shadow="xl" p="lg">
      <div style={{ marginBottom: 12, marginTop: 12 }}>
        <Text weight={500}>{message}</Text>
      </div>
      <Divider sx={{ marginBottom: 5 }} />
      <Stack>
        {user
          ? items
              ?.filter((el) => !user?.blockedUsers.includes(el?.id))
              ?.filter((el) => el._id !== otherUserId)
              ?.map((el) => (
                <RelatedPeopleNavButton
                  person={el}
                  key={el?._id}
                  myId={user?.id}
                />
              ))
          : items?.map((el) => (
              <RelatedPeopleNavButton
                person={el}
                key={el?._id}
                myId={user?.id}
              />
            ))}
      </Stack>
    </Card>
  );
}
