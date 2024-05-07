import React, { useState, useEffect } from "react";
import {
  Stack,
  Button,
  Textarea,
  TextInput,
  Container,
  RadioGroup,
  Radio,
  Checkbox,
  ActionIcon,
} from "@mantine/core";
import useUser from "../../react-query-hooks/useUser/useUser";
import { useParams } from "react-router-dom";
import useCreateDM from "./../../react-query-hooks/useDMs/useCreateDM";
import { X } from "tabler-icons-react";
import {
  useSecretTellerUsername,
  useSetSecretTellerUsername,
} from "../../contexts/SecretTellerUsernameContext";

export default function TreeHollowMessage({ user, secretId }) {
  const [content, setContent] = useState("");
  const [anonymous, setAnonymous] = useState(false);

  const { mutate: createDM } = useCreateDM();

  const handleCreateDM = () => {
    createDM({
      content,
      sender: user?.id,
      secretId,
      anonymous,
      type: "SecretMessage",
    });
  };

  return (
    <Container sx={{ paddingTop: 120 }}>
      <Stack>
        {/* <TextInput
          mt="md"
          label="Send message to"
          placeholder="Subject"
          required
        /> */}
        <Textarea
          mt="md"
          label="What do you want to say?"
          minRows={3}
          value={content}
          onChange={(event) => setContent(event.currentTarget.value)}
          required
        />

        <Checkbox
          checked={anonymous}
          label="I want to make this message anonymous"
          onChange={(event) => setAnonymous(event.currentTarget.checked)}
        />
        <Button onClick={() => handleCreateDM()}>Send</Button>
      </Stack>
    </Container>
  );
}
