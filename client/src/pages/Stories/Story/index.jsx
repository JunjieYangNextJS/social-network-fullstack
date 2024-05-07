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
  Button,
  Stack
} from '@mantine/core';
import { Helmet } from 'react-helmet-async';
import useUser from './../../../react-query-hooks/useUser/useUser';

import useStory from './../../../react-query-hooks/useStories/useStory';

import StoryContent from './StoryContent';
import PageNotFound from './../../PageNotFound';
import StoryCommentsContainer from './StoryComments/StoryCommentsContainer';

import PostStoryCommentCreateForm from '../../../components/Forms/PostForms/PostStoryCommentCreateForm';
import useCreateStoryComment from './../../../react-query-hooks/useStoryComments/useCreateStoryComments';
import StoryTellerOnlyCommentsContainer from './StoryComments/StoryTellerOnlyCommentsContainer';
import CommentSelect from '../../../components/Selects/CommentSelect';
import PostRightStack from './../../Posts/Post/PostRightStack';
import useRelatedAndUnresponsedStories from './../../../react-query-hooks/useStories/useRelatedAndUnresponsedStories';

const Story = () => {
  // const [story, setStory] = useState(null);
  // const [newLikes, setNewLikes] = useState(null);
  let params = useParams();
  const navigate = useNavigate();
  const { data: user } = useUser();

  const [sortByValue, setSortByValue] = useState('createdAt');

  const { isLoading, isError, isSuccess, data: story } = useStory(
    params.storyId
  );

  const {
    data: relatedAndUnresponsedStories
  } = useRelatedAndUnresponsedStories(story?.id, story?.about);

  const {
    mutate,
    status,
    isLoading: createPCIsLoading
  } = useCreateStoryComment(params.storyId);

  const [commentFormOpen, setCommentFormOpen] = useState(false);

  const [isStoryTellerOnly, setIsStoryTellerOnly] = useState(false);

  if (isLoading)
    return (
      <Center>
        <Loader visible="true" />
      </Center>
    );

  if (isError) return <PageNotFound />;

  return (
    <Box
      sx={theme => ({
        backgroundColor: theme.colors.grape[2],
        minHeight: 'calc(100vh - 170px)',
        paddingTop: '120px',
        paddingBottom: '50px'
      })}
    >
      <Helmet>
        <title>{story?.title}</title>
        <meta name="description" content={story?.title} />
        <link rel="canonical" href={'/stories/' + params.storyId} />
        <meta name="robots" content="index, follow" />
      </Helmet>
      {isSuccess && (
        <Center>
          <div style={{ display: 'flex', flexDirection: 'row', gap: '30px' }}>
            <div
              style={{
                backgroundColor: 'white',
                paddingTop: 40,
                paddingLeft: 10,
                paddingRight: 10,
                borderRadius: '5px',
                width: '750px'
              }}
            >
              <StoryContent story={story} navigate={navigate} user={user} />
              <Divider my="sm" />
              <Stack align="flex-end" spacing={1}>
                {isStoryTellerOnly ? (
                  <Button
                    variant="subtle"
                    color="gray"
                    size="xs"
                    compact
                    onClick={() => setIsStoryTellerOnly(true)}
                  >
                    See everyone
                  </Button>
                ) : (
                  <>
                    <Button
                      variant="subtle"
                      color="gray"
                      size="xs"
                      compact
                      onClick={() => setIsStoryTellerOnly(true)}
                    >
                      See storyteller
                    </Button>
                    <CommentSelect
                      setSortByValue={setSortByValue}
                      sortByValue={sortByValue}
                    />
                  </>
                )}
              </Stack>
              {commentFormOpen ? (
                <PostStoryCommentCreateForm
                  // postId={post?._id}
                  // poster={post?.poster?.id}
                  creationId={story?._id}
                  creationString="story"
                  creatorString="storyTeller"
                  creator={story?.storyTeller?.id}
                  mutate={mutate}
                  isLoading={createPCIsLoading}
                  status={status}
                  willNotify={story?.willNotify}
                  user={user}
                  commentFormOpen={commentFormOpen}
                  setCommentFormOpen={setCommentFormOpen}
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
              {story &&
                (isStoryTellerOnly ? (
                  <StoryTellerOnlyCommentsContainer
                    story={story}
                    params={params}
                    setIsStoryTellerOnly={setIsStoryTellerOnly}
                    setSortByValue={setSortByValue}
                    sortByValue={sortByValue}
                  />
                ) : (
                  <StoryCommentsContainer
                    story={story}
                    params={params}
                    setIsStoryTellerOnly={setIsStoryTellerOnly}
                    setSortByValue={setSortByValue}
                    sortByValue={sortByValue}
                  />
                ))}
            </div>
            <PostRightStack
              user={user}
              route="stories"
              routeWithFirstLetterCapitalized="Stories"
              related={relatedAndUnresponsedStories?.related}
              unresponsed={relatedAndUnresponsedStories?.unresponsed}
            />
          </div>
        </Center>
      )}
    </Box>
  );
};

export default Story;
