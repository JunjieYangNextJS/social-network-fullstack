import React, { useState, useEffect, forwardRef } from "react";
import {
  Container,
  Group,
  Avatar,
  Text,
  Center,
  Loader,
  Menu,
  Indicator,
} from "@mantine/core";
import RichTextEditor from "@mantine/rte";
import calcTimeAgo from "./../../utility/calcTimeAgo";
import { Link } from "react-router-dom";
import { useDebouncedValue } from "@mantine/hooks";
import { useGetHoverOtherUser } from "../../react-query-hooks/useOtherUsers/useOtherUser";
import AvatarComponent from "./../../components/AvatarComponent";

const ReplyContent = forwardRef(
  (
    {
      likes,
      editedAt,
      createdAt,
      content,
      replier,
      id,
      userId,
      highlightedReply,
    },
    ref
  ) => {
    const edited = " (edited)";

    // post comment
    const [readOnly, setReadOnly] = useState(true);
    const [doneEdit, setDoneEdit] = useState("");
    const [editTime, setEditTime] = useState("");
    const [richTextReply, setRichTextReply] = useState("");

    useEffect(() => {
      setRichTextReply(content);
    }, [content]);

    return (
      <div
        ref={highlightedReply === id ? ref : undefined}
        // style={{ border: highlightedReply === id && "1px solid yellow" }}
      >
        <Group>
          <AvatarComponent
            creator={replier}
            username={replier?.username}
            profileName={replier?.profileName}
            role={replier?.role}
            photo={replier?.photo}
            id={replier?._id}
            creationId={id}
            myId={userId}
          />

          <div>
            <Text size="sm">{replier?.profileName}</Text>
            <Text size="xs" color="dimmed">
              {doneEdit
                ? calcTimeAgo(editTime) + doneEdit
                : editedAt
                ? calcTimeAgo(editedAt) + edited
                : calcTimeAgo(createdAt)}
            </Text>
          </div>
          {replier?.id === userId && <div>your reply*</div>}
        </Group>
        <RichTextEditor
          key={`postReply${id}`}
          // placeholder="Post comment content"
          mt="md"
          id={`postReply${id}`}
          name={`postReply${id}`}
          value={content}
          onChange={setRichTextReply}
          readOnly={readOnly || userId !== replier?.id}
          sx={{ border: "none" }}
        />
      </div>
    );
  }
);

export default ReplyContent;
