import React, { useState, useEffect } from "react";
import {
  Card,
  Image,
  Text,
  Badge,
  Button,
  Group,
  Stack,
  createStyles,
  UnstyledButton,
  Divider,
} from "@mantine/core";
import SidePostStoryButton from "../UnstyledButtons/SidePostStoryButton";

export default function RelatedPostCard({
  items,
  route,
  routeWithFirstLetterCapitalized,
  user,
  message,
}) {
  return (
    // <div style={{ width: 340, margin: "auto" }}>
    <Card shadow="xl" p="lg">
      <div style={{ marginBottom: 12, marginTop: 12 }}>
        <Text weight={500}>{message}</Text>
      </div>
      <Divider sx={{ marginBottom: 5 }} />
      <Stack>
        {user
          ? items
              ?.filter(
                (el) =>
                  !user[`hidden${routeWithFirstLetterCapitalized}`]?.includes(
                    el._id
                  )
              )
              ?.map((el) => (
                <SidePostStoryButton
                  user={user}
                  el={el}
                  route={route}
                  likedItems={`liked${routeWithFirstLetterCapitalized}`}
                  key={el._id}
                />
              ))
          : items?.map((el) => (
              <SidePostStoryButton
                el={el}
                route={route}
                likedItems={`liked${routeWithFirstLetterCapitalized}`}
                key={el._id}
              />
            ))}
      </Stack>
    </Card>
    // </div>
  );
}
