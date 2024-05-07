import React from "react";
import { BrandHipchat, Eye } from "tabler-icons-react";
import { Tooltip, ActionIcon, Box, Center, Text } from "@mantine/core";

export default function ViewCountIconButton({ viewCount }) {
  return (
    <Tooltip
      wrapLines
      withArrow
      transition="fade"
      transitionDuration={200}
      label="Views"
    >
      <Center style={{ width: 40 }}>
        <Eye size={16} />
        <Text size="sm">{viewCount}</Text>
      </Center>
    </Tooltip>
  );
}
