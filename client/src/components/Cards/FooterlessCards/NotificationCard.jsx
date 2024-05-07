import React from "react";
import { RichTextEditor } from "@mantine/rte";
import { createStyles } from "@mantine/core";

export default function NotificationCard({ content, id, isClicked }) {
  const useStyles = createStyles((theme) => ({
    richTextEditor: {
      border: "none",
      maxHeight: 150,
      minHeight: 0,
      overflow: "hidden",
      textOverflow: "ellipsis",
      fontSize: 14,
      color: " #343a40",
      paddingBottom: `${theme.spacing.xs}px`,
      backgroundColor: isClicked ? theme.colors.gray[2] : "white",
    },
  }));

  const { classes, theme } = useStyles();

  return (
    <RichTextEditor
      value={content}
      readOnly
      id={`notificationContent${id}`}
      key={`notificationContent${id}`}
      className={classes.richTextEditor}
    />
  );
}
