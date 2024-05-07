import React from "react";
import { Text, Container } from "@mantine/core";
import calcTimeAgo from "./../../utility/calcTimeAgo";
import { Link } from "react-router-dom";

const MyCommentsAndRepliesCard = ({
  id,
  postId,
  createdAt,
  postTitle,
  content,
  postCommentId,
  user,
}) => {
  return (
    <Container>
      <Text
        onClick={() =>
          localStorage.setItem("highlightedComment", postCommentId)
        }
        component={Link}
        to={`/posts/${postId}`}
      >
        {calcTimeAgo(createdAt)} {postCommentId}
      </Text>
    </Container>
  );
};

export default MyCommentsAndRepliesCard;
