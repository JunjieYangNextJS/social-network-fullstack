import React, { useState, useEffect, useRef, Fragment, useMemo } from 'react';
import { Container, Button, Group, Text } from '@mantine/core';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useDidUpdate } from '@mantine/hooks';
import useUser from './../../../../react-query-hooks/useUser/useUser';
import { ArrowBigDown, ArrowBigTop } from 'tabler-icons-react';
import { useQuery, useQueryClient } from 'react-query';
import backendApi from '../../../../utility/backendApi';
import axios from 'axios';
import PaginationForComments from './PaginationForComments';
import StoryCommentContent from './StoryCommentContent';

const StoryTellerOnlyCommentsContainer = ({ story, params }) => {
  // const [stories, setStories] = useState(null);
  const { id, storyTeller, pinned, openComments } = story;

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: user } = useUser();
  const limit = 2;

  const fetchStoryComments = (page = 1) => {
    return axios
      .get(
        `${backendApi}storyComments?story=${id}&openComments=${openComments}&commenter=${
          storyTeller.id
        }&understated=false&limit=${limit}&page=` + page
      )
      .then(res => res.data);
  };

  const [page, setPage] = useState(
    sessionStorage.getItem(`storyComments-${id}-storyTellerOnly-page`) * 1 || 1
  );

  useDidUpdate(() => {
    sessionStorage.setItem(`storyComments-${id}-storyTellerOnly-page`, page);
    // window.location.reload();
  }, [page]);

  const { data } = useQuery(
    ['story', id, 'comments', 'storyTellerOnly', { page }],
    () => fetchStoryComments(page),
    { keepPreviousData: true, staleTime: 5000 }
  );

  const total = Math.ceil(data?.totalDocsInDB / limit);

  // Prefetch the next page!
  useEffect(() => {
    if (data?.totalDocsInDB > page * limit) {
      queryClient.prefetchQuery(
        ['story', id, 'comments', 'storyTellerOnly', { page: page + 1 }],
        () => fetchStoryComments(page + 1)
      );
    }
  }, [data, page, queryClient, id]);

  // const handleStoryTellerOnly = () => {
  //   if (storyTellerOnly) {
  //     setStoryTellerOnly("");
  //   } else {
  //     setStoryTellerOnly(storyTeller?._id);
  //   }
  //   setPage(1);
  // };

  return (
    <>
      {openComments ? (
        <>
          {data && (
            <Container>
              {/* <Button
                variant="outline"
                color="cyan"
                onClick={() => setIsStoryTellerOnly(false)}
              >
                See everyone
              </Button> */}
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
                // <div>{comment.content}</div>
              })}

              <PaginationForComments
                activePage={page}
                setActivePage={setPage}
                total={total}
                params={params}
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

export default StoryTellerOnlyCommentsContainer;
