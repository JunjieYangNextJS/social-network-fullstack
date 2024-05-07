import React, {
  useEffect,
  useState,
  useMemo,
  useRef,
  useCallback,
} from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowBigLeft } from "tabler-icons-react";

import {
  Container,
  Loader,
  Center,
  Divider,
  Box,
  Group,
  Avatar,
  Card,
  Text,
  Title,
  ActionIcon,
} from "@mantine/core";
import PageNotFound from "./../PageNotFound";

import useGetComment from "./../../react-query-hooks/useGetComment";
import useUser from "./../../react-query-hooks/useUser/useUser";
import ReplyContent from "./ReplyContent";
import PostReplyCreateForm from "./../../components/Forms/PostForms/PostReplyCreateForm";
import PostRightStack from "../Posts/Post/PostRightStack";
import useRelatedAndUnresponsedPosts from "./../../react-query-hooks/usePosts/useRelatedAndUnresponsedPosts";
import Cookies from "js-cookie";
import SinglePostCommentContent from "./SinglePostCommentContent";

export default function PostComment() {
  let params = useParams();
  const navigate = useNavigate();
  const { data: user } = useUser();

  const {
    isLoading,
    isError,
    isSuccess,
    data: comment,
  } = useGetComment("postComments", params.postCommentId, "postComment");

  const { data: relatedAndUnresponsedPosts } = useRelatedAndUnresponsedPosts(
    comment?.post?._id,
    comment?.post?.about
  );

  const [openReply, setOpenReply] = useState(false);
  const highlightedReply = Cookies.get("highlightedReply");
  const highlightedReplyRef = useRef(null);

  useEffect(() => {
    if (comment && relatedAndUnresponsedPosts && highlightedReplyRef?.current) {
      highlightedReplyRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });

      Cookies.remove("highlightedReply");
    }
  }, [highlightedReplyRef, comment, relatedAndUnresponsedPosts]);

  const sortedReplies = useMemo(() => {
    if (comment?.postReplies) {
      const cloned = [...comment.postReplies];
      return cloned.sort((a, _b) => (a.replier.id === user?.id ? -1 : 1));
    }
  }, [comment?.postReplies, user?.id]);

  if (isLoading)
    return (
      <Center>
        <Loader visible="true" />
      </Center>
    );

  if (isError) return <PageNotFound />;

  return (
    <Box
      sx={(theme) => ({
        backgroundColor: theme.colors.blue[2],
        padding: "120px",
      })}
    >
      {isSuccess && comment && sortedReplies && (
        <Center>
          <div style={{ display: "flex", flexDirection: "row", gap: "30px" }}>
            <div>
              <Card
                sx={{
                  backgroundColor: "white",
                  paddingTop: 40,
                  paddingLeft: 10,
                  paddingRight: 10,
                  marginBottom: 30,
                  borderRadius: "5px",
                  width: "750px",
                }}
                component={Link}
                to={`/posts/${comment.post._id}`}
                rel="noopener noreferrer"
              >
                <Group>
                  <ActionIcon onClick={() => navigate(-1)}>
                    <ArrowBigLeft />
                  </ActionIcon>
                  <Title order={4}>{comment.post.title}</Title>
                </Group>
              </Card>
              <Card
                sx={{
                  backgroundColor: "white",
                  paddingTop: 40,
                  paddingLeft: 10,
                  paddingRight: 10,
                  borderRadius: "5px",
                  width: "750px",
                }}
              >
                <SinglePostCommentContent
                  comment={comment}
                  user={user}
                  navigate={navigate}
                />
                <Divider my="sm" />
                {user &&
                  (openReply ? (
                    <PostReplyCreateForm
                      user={user}
                      postId={comment.post._id}
                      postCommentId={comment.id}
                      willNotifyCommenter={comment.willNotifyCommenter}
                      commenterId={comment.commenter.id}
                      // postTitle={comment.post.title}
                      setOpenReply={setOpenReply}
                      invalidatePinned={["postComment", params.postCommentId]}
                    />
                  ) : (
                    <Group sx={{ padding: "50px 0 40px 16px" }}>
                      <Avatar
                        src={user?.photo}
                        alt={user?.profileName}
                        radius="xl"
                        component={Link}
                        size="md"
                        to={`/me/home`}
                      />
                      <Text
                        color="dimmed"
                        size="sm"
                        onClick={() => setOpenReply(true)}
                        sx={{
                          borderBottom: "1px gray solid",
                          width: 300,
                          paddingBottom: 2,
                        }}
                      >
                        Comment here...
                      </Text>
                    </Group>
                  ))}
                <Container>
                  {sortedReplies.map((reply) => (
                    <ReplyContent
                      key={reply.id}
                      likes={reply.likes}
                      editedAt={reply.editedAt}
                      createdAt={reply.createdAt}
                      content={reply.content}
                      replier={reply.replier}
                      id={reply.id}
                      userId={user?.id}
                      ref={highlightedReplyRef}
                      highlightedReply={highlightedReply}
                    />
                  ))}
                </Container>
              </Card>
            </div>

            <PostRightStack
              user={user}
              related={relatedAndUnresponsedPosts?.related}
              unresponsed={relatedAndUnresponsedPosts?.unresponsed}
            />
          </div>
        </Center>
      )}
    </Box>
  );
}
