import React from "react";
import { Modal, ScrollArea, Container, Text } from "@mantine/core";

export default function ViewUserBioModal({ bio, opened, setOpened }) {
  return (
    <Modal
      opened={opened}
      onClose={() => setOpened(false)}
      withCloseButton={false}
      centered
      size="lg"
    >
      <ScrollArea style={{ height: 500 }}>
        <Text style={{ padding: 20, whiteSpace: "pre-wrap" }} size="lg">
          {bio}
        </Text>
      </ScrollArea>
    </Modal>
  );
}
