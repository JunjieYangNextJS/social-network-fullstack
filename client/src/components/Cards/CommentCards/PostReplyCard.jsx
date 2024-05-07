import React, { useEffect, useState } from "react";
import {
  Container,
  createStyles,
  Text,
  Avatar,
  Group,
  Button,
  Menu,
  Loader,
  Center,
  Indicator,
  Card,
  Box,
  UnstyledButton,
  useMantineTheme,
  Tooltip,
  ActionIcon,
} from "@mantine/core";
import { ArrowBigDown, ArrowBigTop, Heart } from "tabler-icons-react";
import { useDebouncedValue, useDidUpdate } from "@mantine/hooks";
import isRichTextEmpty from "./../../../utility/isRichTextEmpty";
import calcTimeAgo from "./../../../utility/calcTimeAgo";
import { Link } from "react-router-dom";

import RichTextEditor from "@mantine/rte";

import { useGetHoverOtherUser } from "../../../react-query-hooks/useOtherUsers/useOtherUser";
import { useNavigate } from "react-router-dom";
import AvatarComponent from "../../AvatarComponent";

const useStyles = createStyles((theme) => ({
  card: {
    backgroundColor:
      theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white,
    position: "relative",
    cursor: "pointer",
    // padding: "16px",
    // borderRadius: 8,
    // border: "1px solid #e9ecef",
    // overflow: "hidden",

    transition: "transform 100ms ease, box-shadow 100ms ease",
    // padding: theme.spacing.xl,
    // paddingLeft: theme.spacing.xl * 2,
    marginBottom: theme.spacing.lg,
    maxWidth: "600px",

    "&:hover": {
      boxShadow: theme.shadows.md,
      transform: "scale(1.01)",
    },
  },

  body: {
    paddingLeft: 54,
    paddingTop: theme.spacing.sm,
  },

  commentBody: {
    marginLeft: 18,
    marginTop: 7,
    paddingLeft: 2,
    borderWidth: 4,
    borderRadius: 5,
    borderStyle: "solid",
    borderRight: "none",
    // borderImage: "black",
    borderImage: `linear-gradient(
      to bottom,
      #d9e1ecf8,
      rgba(0, 0, 0, 0)
    ) 1 100%;`,
  },
}));

const PostReplyCard = ({ postReply, user }) => {
  const { replier, content, createdAt, editedAt, id, likes, postComment } =
    postReply;

  const { classes, theme } = useStyles();

  const edited = " (edited)";

  return (
    <>
      {postReply && replier && (
        <Card
          radius="md"
          className={classes.card}
          component={Link}
          to={`/post-comment/${postComment}`}
          rel="noopener noreferrer"
          withBorder={true}
        >
          <Group>
            <AvatarComponent
              creator={replier}
              username={replier?.username}
              profileName={replier?.profileName}
              role={replier?.role}
              photo={replier?.photo}
              id={replier?._id}
              creationId={postComment}
              myId={user?.id}
              noHoverCard={true}
            />

            <div>
              <Text size="sm">{replier?.profileName}</Text>
              <Text size="xs" color="dimmed">
                {editedAt
                  ? calcTimeAgo(editedAt) + edited
                  : calcTimeAgo(createdAt)}
              </Text>
            </div>
          </Group>

          <div className={classes.commentBody}>
            <RichTextEditor
              // placeholder="Post comment content"
              // mt="md"
              onClick={(e) =>
                e.target.currentSrc &&
                window.open(e.target.currentSrc, "_blank", "noopener")
              }
              id={`postReplyContent${id}`}
              name={`postReplyContent${id}`}
              key={`postReplyContent${id}`}
              value={content}
              // onChange={setRichText}
              readOnly={true}
              sx={{
                border: "none",
                fontSize: 15,
                color: " #343a40",
              }}
            />

            <Tooltip
              wrapLines
              withArrow
              transition="fade"
              transitionDuration={200}
              label="Likes"
              sx={{ marginLeft: 10 }}
            >
              <ActionIcon aria-label="like" variant="transparent">
                <Heart
                  size={16}
                  color={
                    likes?.includes(user?.id) ? theme.colors.red[6] : "#343a40"
                  }
                />
                {likes?.length}
              </ActionIcon>
            </Tooltip>
          </div>
        </Card>
      )}
    </>
  );
};

export default PostReplyCard;
