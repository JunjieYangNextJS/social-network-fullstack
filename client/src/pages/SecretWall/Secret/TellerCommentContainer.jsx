import React from "react";
import { Divider } from "@mantine/core";
import SecretReply from "./SecretComment/SecretReply";
import { useNavigate } from "react-router-dom";

export default function TellerCommentContainer({
  classes,
  el,
  index,
  user,
  active,
  setActive,
  theme,
}) {
  const navigate = useNavigate();

  return (
    <div
      className={classes.unstyledButton}
      onClick={() => navigate(`/tree-hollow/private/${el._id}`)}
    >
      <Divider
        my="xs"
        variant="dashed"
        sx={{ marginTop: 100 }}
        labelPosition="center"
        label={`Only you and this person can see this conversation (${el.replies.length})`}
      />
      <SecretReply
        commentInfo={el}
        user={user}
        reply={el.replies[0]}
        index={index}
      />
    </div>
  );
}
