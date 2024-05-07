import React, { useState } from "react";
import { Button, Collapse, Container } from "@mantine/core";
import SecretReply from "./SecretReply";

export default function SecretCommentsSection({ commentSection, user }) {
  return (
    <Container sx={{ backgroundColor: "white" }}>
      {/* {commentSection && <SecretComment comment={commentSection} user={user} />} */}

      {commentSection &&
        commentSection.replies.map((el) => (
          <SecretReply
            key={el._id}
            reply={el}
            user={user}
            commentInfo={commentSection}
          />
        ))}
    </Container>
  );
}
