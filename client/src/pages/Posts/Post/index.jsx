import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

import {
  Container,
  Loader,
  Center,
  Divider,
  Box,
  Group,
  Avatar,
  Input,
  Text,
  Stack
} from '@mantine/core';
import { Helmet } from 'react-helmet-async';
import useUser from './../../../react-query-hooks/useUser/useUser';
import usePatchUser, {
  usePatchUserLikes
} from './../../../react-query-hooks/useUser/usePatchUser';
import usePost from './../../../react-query-hooks/usePosts/usePost';
import PostCommentsContainer from './PostComments/PostCommentsContainer';

import PostContent from './PostContent';
import PageNotFound from './../../PageNotFound';
import PostStoryCommentCreateForm from '../../../components/Forms/PostForms/PostStoryCommentCreateForm';

import PostRightStack from './PostRightStack';
import useRelatedAndUnresponsedPosts from './../../../react-query-hooks/usePosts/useRelatedAndUnresponsedPosts';
import useCreatePostComment from '../../../react-query-hooks/usePostComments/useCreatePostComment';
import CommentSelect from '../../../components/Selects/CommentSelect';

const Post = () => {
  let params = useParams();
  const navigate = useNavigate();
  const { data: user } = useUser();

  const [sortByValue, setSortByValue] = useState('createdAt');

  const { isLoading, isError, isSuccess, data: post } = usePost(params.postId);

  // console.log('post', post);
  // console.log('error:', error);

  const { data: relatedAndUnresponsedPosts } = useRelatedAndUnresponsedPosts(
    post?.id,
    post?.about
  );

  const [commentFormOpen, setCommentFormOpen] = useState(false);

  const { mutate, status, isLoading: createPCIsLoading } = useCreatePostComment(
    params.postId
  );

  // const {
  //   mutate: createPostComment,
  //   status,
  //   isLoading: createCommentIsLoading,
  // } = useCreatePostComment(params.postId);
  // const [opened, setOpened] = useState(false);

  // const handleSubmit = () => {
  //   createPostComment({
  //     content: richText,
  //     post: postId,
  //     poster,
  //   });
  // };

  if (isLoading)
    return (
      <Center>
        <Loader visible="true" />
      </Center>
    );

  if (isError) return <PageNotFound />;

  return (
    <>
      <Helmet>
        <title>{post?.title}</title>
        <meta name="description" content={post?.title} />
        <link rel="canonical" href={'/posts/' + params.postId} />
        <meta name="robots" content="index, follow" />
      </Helmet>
      <Box
        sx={theme => ({
          backgroundColor: theme.colors.blue[2],
          minHeight: 'calc(100vh - 170px)',
          paddingTop: '120px',
          paddingBottom: '50px'
        })}
      >
        {isSuccess && (
          <Center>
            <div style={{ display: 'flex', flexDirection: 'row', gap: '30px' }}>
              <Box
                sx={{
                  backgroundColor: 'white',
                  paddingTop: 40,
                  paddingLeft: 10,
                  paddingRight: 10,
                  paddingBottom: 30,
                  borderRadius: '5px',
                  width: '750px',
                  '@media only screen and (max-width: 800px)': {
                    width: '500px'
                  },
                  '@media only screen and (max-width: 530px)': {
                    width: '350px'
                  }
                }}
              >
                <PostContent post={post} user={user} navigate={navigate} />
                <Divider my="sm" />
                <Stack align="flex-end" spacing={1} sx={{ marginTop: 35 }}>
                  <CommentSelect
                    setSortByValue={setSortByValue}
                    sortByValue={sortByValue}
                  />
                </Stack>
                {commentFormOpen ? (
                  <PostStoryCommentCreateForm
                    // postId={post?._id}
                    // poster={post?.poster?.id}
                    creationId={post?._id}
                    creationString="post"
                    creatorString="poster"
                    creator={post?.poster?.id}
                    mutate={mutate}
                    isLoading={createPCIsLoading}
                    status={status}
                    willNotify={post?.willNotify}
                    user={user}
                    setCommentFormOpen={setCommentFormOpen}
                    commentFormOpen={commentFormOpen}
                  />
                ) : (
                  <Group sx={{ padding: '50px 0 40px 16px' }}>
                    <Avatar
                      src={user?.photo}
                      alt={user?.profileName}
                      radius="xl"
                      size="md"
                      onClick={() => (user ? navigate(`/me/home`) : null)}
                      sx={{ cursor: 'default' }}
                    />

                    <Text
                      color="dimmed"
                      size="sm"
                      onClick={() => setCommentFormOpen(true)}
                      sx={{
                        borderBottom: '1px gray solid',
                        width: 300,
                        paddingBottom: 2,
                        cursor: 'text'
                      }}
                    >
                      Comment here...
                    </Text>
                  </Group>
                )}
                {/* <Divider my="sm" sx={{ paddingBottom: "20px" }} /> */}
                {post && (
                  <PostCommentsContainer
                    user={user}
                    postComments={post?.postComments}
                    postId={post?._id}
                    postTitle={post?.title}
                    posterId={post?.poster?.id}
                    willNotify={post?.willNotify}
                    pinned={post?.pinned}
                    posterProfileName={post?.poster?.profileName}
                    setSortByValue={setSortByValue}
                    sortByValue={sortByValue}
                  />
                )}
              </Box>
              <PostRightStack
                user={user}
                route="posts"
                routeWithFirstLetterCapitalized="Posts"
                related={relatedAndUnresponsedPosts?.related}
                unresponsed={relatedAndUnresponsedPosts?.unresponsed}
              />
            </div>
          </Center>
        )}
      </Box>
    </>
  );
};

export default Post;
