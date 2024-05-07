import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Button,
  createStyles,
  Paper,
  Card,
  Text,
  TextInput,
  Textarea,
  Group,
  Divider,
  Box,
} from "@mantine/core";
import { useClickOutside } from "@mantine/hooks";

import calcTimeAgo from "./../../../utility/calcTimeAgo";
import useUser from "../../../react-query-hooks/useUser/useUser";
import usePatchUser from "../../../react-query-hooks/useUser/usePatchUser";
import useCreateSecretComment from "../../../react-query-hooks/useSecrets/useSecretComments/useCreateSecretComment";
import useSecret from "../../../react-query-hooks/useSecrets/useSecret";
import usePatchSecret from "../../../react-query-hooks/useSecrets/usePatchSecret"; //   usePatchLikes,
import useDeleteSecret from "../../../react-query-hooks/useSecrets/useDeleteSecret";
import SecretContent from "./SecretContent";
import SecretCommentsSection from "./SecretComment/SecretCommentsSection";
import { useQueryClient } from "react-query";

export default function SecretLayout({
  classes,
  user,
  data,
  theme,
  secretCommentId,
  hiddenSecrets,
}) {
  const [commentContent, setCommentContent] = useState("");
  const [opened, setOpened] = useState(false);
  const ref = useClickOutside(() => setOpened(false));
  const navigate = useNavigate();

  const { mutate: createSecretComment, isSuccess } = useCreateSecretComment(
    data?.secret.id
  );

  const { mutate: patchSecret } = usePatchSecret(data?.secret.id);
  const { mutate: deleteSecret, status: secretDeleteStatus } = useDeleteSecret(
    data?.secret.id
  );

  if (secretDeleteStatus === "error") navigate("/tree-hollow", { push: true });

  const queryClient = useQueryClient();

  useEffect(() => {
    if (secretCommentId)
      queryClient.invalidateQueries(["private-secretComment", secretCommentId]);
  }, [isSuccess, secretCommentId, queryClient]);

  const handleConfirmComment = () => {
    if (data.secret.secretTeller === user?.id) {
      createSecretComment({
        secret: data?.secret.id,
        content: commentContent,
        commenter: data?.comments[0].commenter,
      });
    } else {
      createSecretComment({
        secret: data?.secret.id,
        content: commentContent,
      });
    }

    setCommentContent("");
    setOpened(false);
  };

  const handleCancelComment = () => {
    setCommentContent("");
    setOpened(false);
  };

  return (
    <Container className={classes.container}>
      <SecretContent
        secret={data?.secret}
        userId={user?.id}
        hiddenSecrets={hiddenSecrets}
      />

      <Divider
        my="xs"
        variant="dashed"
        sx={{ marginTop: 100 }}
        labelPosition="center"
        label="Only you and this person can see this conversation"
      />
      <Group position="right">
        <Card
          ref={ref}
          sx={{
            minWidth: 400,
            "@media (max-width: 500px)": {
              minWidth: 250,
            },
          }}
        >
          <Textarea
            onClick={() => setOpened(true)}
            variant="unstyled"
            minRows={1}
            value={commentContent}
            onChange={(event) => setCommentContent(event.currentTarget.value)}
            autosize
            sx={{
              borderBottom: opened
                ? `1px solid ${theme.colors.gray[6]}`
                : `1px solid ${theme.colors.gray[5]}`,
            }}
            placeholder="What is in your mind?"
          />
          {opened && (
            <Group sx={{ marginTop: 5 }} spacing={10}>
              <Button variant="subtle" onClick={() => handleCancelComment()}>
                Cancel
              </Button>
              <Button variant="subtle" onClick={() => handleConfirmComment()}>
                Comment
              </Button>
            </Group>
          )}
        </Card>
      </Group>

      <SecretCommentsSection commentSection={data.comments[0]} user={user} />
    </Container>
  );
}
