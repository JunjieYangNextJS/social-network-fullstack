import React, { useState, useEffect, useRef, Fragment, useMemo } from 'react';
import { Container, Button, Group, Text, Stack } from '@mantine/core';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useDidUpdate } from '@mantine/hooks';
import useUser from './../../../../react-query-hooks/useUser/useUser';
import { ArrowBigDown, ArrowBigTop } from 'tabler-icons-react';
import { useQuery, useQueryClient } from 'react-query';
import backendApi from '../../../../utility/backendApi';
import axios from 'axios';
import PaginationForComments from './PaginationForComments';
import StoryCommentContent from './StoryCommentContent';
import useGetStoryComment from './../../../../react-query-hooks/useStoryComments/useGetStoryComment';
import PinnedStoryComment from './PinnedStoryComment';

const StoryCommentsContainer = ({
  story,
  params,
  setIsStoryTellerOnly,
  setSortByValue,
  sortByValue
}) => {
  // const [stories, setStories] = useState(null);
  const { id, storyTeller, pinned, openComments } = story;

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: user } = useUser();
  const limit = 20;

  const fetchStoryComments = (page = 1) => {
    if (pinned) {
      return axios
        .get(
          `${backendApi}storyComments?story=${id}&id[ne]=${pinned}&openComments=${openComments}&understated=false&sort=${sortByValue}&limit=${limit}&page=` +
            page
        )
        .then(res => res.data);
    }

    return axios
      .get(
        `${backendApi}storyComments?story=${id}&openComments=${openComments}&understated=false&sort=${sortByValue}&limit=${limit}&page=` +
          page
      )
      .then(res => res.data);
  };

  const [page, setPage] = useState(
    sessionStorage.getItem(`storyComments-${id}-${sortByValue}-page`) * 1 || 1
  );

  const [understatedOpen, setUnderstatedOpen] = useState(false);

  useDidUpdate(() => {
    sessionStorage.setItem(`storyComments-${id}-${sortByValue}-page`, page);
    // window.location.reload();
  }, [page]);

  const { data } = useQuery(
    ['story', id, 'comments', { page }, { sort: sortByValue }],
    () => fetchStoryComments(page),
    { keepPreviousData: true, staleTime: 5000 }
  );

  const total = Math.ceil(data?.totalDocsInDB / limit);

  // Prefetch the next page!
  useEffect(() => {
    if (data?.totalDocsInDB > page * limit) {
      queryClient.prefetchQuery(
        ['story', id, 'comments', { page: page + 1 }, { sort: sortByValue }],
        () => fetchStoryComments(page + 1)
      );
    }
  }, [data, page, queryClient, id, sortByValue]);

  // get pinned
  const { data: pinnedComment } = useGetStoryComment(pinned);

  return (
    <>
      {openComments ? (
        <>
          {data && (
            <Container>
              {pinnedComment && (
                <PinnedStoryComment
                  storyComment={pinnedComment}
                  user={user}
                  navigate={navigate}
                  storyTellerId={storyTeller?.id}
                  storyTellerProfileName={storyTeller?.profileName}
                  storyId={id}
                  pinned={pinned}
                />
              )}
              <Stack />
              {data.data.map(comment => {
                return (
                  <StoryCommentContent
                    key={comment?._id}
                    storyComment={comment}
                    user={user}
                    navigate={navigate}
                    storyId={id}
                    storyTellerId={storyTeller?._id}
                    pinned={pinned}
                  />
                );
              })}
              <Group position="right" spacing={3}>
                <Button
                  variant="subtle"
                  color="gray"
                  size="xs"
                  onClick={() => setUnderstatedOpen(!understatedOpen)}
                >
                  {understatedOpen ? (
                    <ArrowBigTop size={13} />
                  ) : (
                    <ArrowBigDown size={13} />
                  )}
                  <Text color="dimmed" size={10}>
                    understated({data.understated.length})
                  </Text>
                </Button>
              </Group>
              <Container>
                {understatedOpen &&
                  data.understated.map(comment => {
                    return (
                      <StoryCommentContent
                        key={comment?._id}
                        storyComment={comment}
                        user={user}
                        navigate={navigate}
                        storyId={id}
                        storyTellerId={storyTeller?._id}
                      />
                    );
                  })}
              </Container>

              <PaginationForComments
                activePage={page}
                setActivePage={setPage}
                total={total}
              />
            </Container>
          )}
        </>
      ) : (
        <Container>
          The storyteller has shut down the comment section.
        </Container>
      )}
    </>
  );
};

export default StoryCommentsContainer;
