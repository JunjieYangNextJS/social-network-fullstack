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

export default function DM() {
  const { username } = useParams();
  const [targetUsername, setTargetUsername] = useState("");
  const [content, setContent] = useState("");
  const [anonymous, setAnonymous] = useState(false);
  const [type, setType] = useState("DM");

  const { mutate: createDM } = useCreateDM();
  const { data: user } = useUser();

  const secretTellerUsername = useSecretTellerUsername();
  const setSecretTellerUsername = useSetSecretTellerUsername();

  useEffect(() => {
    if (username === "secret-teller") {
      if (secretTellerUsername) {
        setTargetUsername("Secret Teller");
      } else {
        setTargetUsername("");
      }

      return;
    }

    if (username) {
      setTargetUsername(username);
    }

    if (username === "priders") setType("Review");
  }, [username, secretTellerUsername]);

  const handleCreateDM = () => {
    createDM({
      content,
      sender: user?.id,
      receiverUsername: targetUsername || secretTellerUsername,

      anonymous,
      type,
    });
    setSecretTellerUsername("");
  };

  const handleErase = () => {
    setSecretTellerUsername("");
    setTargetUsername("");
    setType("DM");
  };

  return (
    <Container sx={{ paddingTop: 120 }}>
      <Stack>
        <TextInput
          mt="md"
          label="Send message to"
          placeholder="Subject"
          required
          value={targetUsername}
          disabled={secretTellerUsername || targetUsername === "priders"}
          onChange={(event) => setTargetUsername(event.currentTarget.value)}
          rightSection={
            <ActionIcon onClick={() => handleErase()}>
              <X />
            </ActionIcon>
          }
        />
        <Textarea
          mt="md"
          label="Your message"
          minRows={3}
          value={content}
          onChange={(event) => setContent(event.currentTarget.value)}
          required
        />
        {targetUsername === "priders" && (
          <RadioGroup value={type} onChange={setType} required spacing="lg">
            <Radio value="Review" label="Review" />
            <Radio value="Suggestion" label="Suggestion" />
            <Radio value="DM" label="Direct Message" />
          </RadioGroup>
        )}
        <Checkbox
          checked={anonymous}
          label="I want to make this message anonymous"
          onChange={(event) => setAnonymous(event.currentTarget.checked)}
        />
        <Button onClick={() => handleCreateDM()}>Send message</Button>
      </Stack>
    </Container>
  );
}
