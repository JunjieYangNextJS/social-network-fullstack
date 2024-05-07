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
} from "@mantine/core";
import { Heart, Eye } from "tabler-icons-react";
import { Link, useNavigate } from "react-router-dom";
import CommentsCountIconButton from "../IconButtons/CommentsCountIconButton";
import { usePatchViewCount } from "../../react-query-hooks/useSecrets/usePatchSecret";

const useStyles = createStyles((theme) => ({
  control: {
    fontWeight: 500,
    display: "block",
    // width: "100%",
    padding: `${theme.spacing.xs}px ${theme.spacing.md}px`,
    color: theme.black,
    fontSize: theme.fontSizes.sm,

    "&:hover": {
      backgroundColor: theme.colors.gray[0],
      color: theme.black,
    },
  },
}));

export default function SidePostStoryButton({ el, user, route, likedItems }) {
  const { classes, theme } = useStyles();

  return (
    <UnstyledButton
      className={classes.control}
      component={Link}
      to={`/${route}/${el._id}`}
      rel="noopener noreferrer"
    >
      <Text sx={{ paddingBottom: 10 }}>{el.title}</Text>
      <Group>
        <Group spacing={1} sx={{ marginBottom: -2 }}>
          <Heart
            size={14}
            color={
              user && user[likedItems]?.includes(el._id)
                ? theme.colors.red[6]
                : "#5C5F66"
            }
          />
          <Text size="xs" color="#5C5F66">
            {el.likes.length}
          </Text>
        </Group>
        <Group spacing={1} sx={{ marginBottom: -2 }}>
          <Eye size={14} color={"#5C5F66"} />
          <Text size="xs" color="#5C5F66">
            {el.viewCount}
          </Text>
        </Group>

        <CommentsCountIconButton commentsCount={el.commentCount} />
      </Group>
    </UnstyledButton>
  );
}
