import React from "react";
import { Button, Text, Textarea, Group } from "@mantine/core";

export default function EditableContentDiv({
  setValue,
  value,
  handleConfirmReply,
  handleCancelReply,
  isMe,
  readOnly,
}) {
  return (
    <div>
      {readOnly ? (
        <div
          style={{
            border: "1px solid white",
            backgroundColor: isMe ? "#228BE6" : "#F1F3F5",
            padding: "6px 12px",
            borderRadius: 15,
          }}
        >
          <Text
            sx={{
              color: isMe ? "white" : "black",
            }}
          >
            {value}
          </Text>
        </div>
      ) : (
        <div style={{ width: "350px" }}>
          <Textarea
            value={value}
            onChange={(event) => setValue(event.currentTarget.value)}
            variant="unstyled"
            autosize
            minRows={1}
            size="md"
            color="#343a40"
            sx={(theme) => ({
              borderBottom: `1px solid ${theme.colors.gray[6]}`,

              marginBottom: "3px",
            })}
          />
          <Group position="right">
            <Button
              onClick={() => handleCancelReply()}
              variant="subtle"
              color="gray"
            >
              Cancel
            </Button>
            <Button onClick={() => handleConfirmReply()} variant="light">
              Confirm
            </Button>
          </Group>
        </div>
      )}
    </div>
  );
}
