import React, { useState, useEffect, useRef, Fragment } from 'react';
import { Container, Button, Box } from '@mantine/core';
import { useNavigate, Link } from 'react-router-dom';
import StoryCard from './../../components/Cards/StoryCard';
import useUser from './../../react-query-hooks/useUser/useUser';
import { Helmet } from 'react-helmet-async';
import { useInfiniteQuery, useQueryClient } from 'react-query';
import backendApi from '../../utility/backendApi';
import axios from 'axios';
import useIntersectionObserver from './../../Hooks/useIntersectionObserverHook';
import PostsRightStack from './../Posts/PostsRightStack/index';

import ParentCreationsFilterBar from './../../components/Navbars/ParentCreationsFilterBar';

const Stories = () => {
  const queryClient = useQueryClient();

  const { data: user } = useUser();
  // const [stories, setStories] = useState(null);
  const urlParts = window.location.href.split('/');

  const last = urlParts[urlParts.length - 1];

  let option;

  switch (last) {
    case 'L':
      option = 'L';
      break;
    case 'G':
      option = 'G';
      break;
    case 'B':
      option = 'B';
      break;
    case 'T':
      option = 'T';
      break;
    case 'Q':
      option = 'Q';
      break;
    case 'I':
      option = 'I';
      break;
    case 'A':
      option = 'A';
      break;
    case '2S':
      option = '2S';
      break;
    case '+More':
      option = '+More';
      break;
    default:
      option = 'general';
  }

  const [sortByValue, setSortByValue] = useState('-lastCommentedAt');

  const limit = 20;

  const fetchStories = ({ pageParam = 0 }) => {
    return axios.get(
      `${backendApi}stories?about=${option}&sort=${sortByValue}&limit=${limit}&page=${pageParam}`,
      {
        withCredentials: true
      }
    );
  };

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    isFetching,
    refetch
  } = useInfiniteQuery(
    ['stories', { sort: sortByValue }, { about: option }],
    fetchStories,
    {
      getNextPageParam: (lastPage, pages) => {
        if (pages.length < lastPage.data.totalDocsInDB / limit) {
          return pages.length + 1;
        } else {
          return undefined;
        }
      }
    }
  );

  useEffect(() => {
    refetch();
  }, [last, refetch]);

  const loadMoreRef = useRef();

  useIntersectionObserver({
    target: loadMoreRef,
    onIntersect: fetchNextPage,
    enabled: hasNextPage
  });

  return (
    <Box
      sx={theme => ({
        backgroundColor: theme.colors.grape[2],
        minHeight: 'calc(100vh - 120px)',
        paddingTop: 120
      })}
    >
      <Helmet>
        <title>Priders.net - Stories</title>
        <meta name="description" content="Priders.net - Stories" />
        <link rel="canonical" href={'/stories'} />
        <meta name="robots" content="index, follow" />
      </Helmet>

      <Container>
        <div style={{ display: 'flex', flexDirection: 'row', gap: '30px' }}>
          <div>
            <ParentCreationsFilterBar
              last={last}
              itemsString="stories"
              itemString="story"
              sortByValue={sortByValue}
              setSortByValue={setSortByValue}
            />
            <div>
              {data &&
                data?.pages &&
                data.pages.map((group, index) => {
                  return (
                    <Fragment key={index}>
                      {user
                        ? group?.data.data.data
                            ?.filter(
                              story =>
                                !user?.blockedUsers.includes(
                                  story?.storyTeller?.id
                                )
                            )
                            ?.filter(
                              story => !user?.hiddenStories.includes(story?._id)
                            )
                            ?.map(story => {
                              const {
                                content,
                                title,
                                storyTeller,

                                createdAt,
                                _id,
                                likes,
                                commentCount,
                                lastCommentedAt
                              } = story;
                              return (
                                <StoryCard
                                  key={_id}
                                  user={user}
                                  storyId={_id}
                                  content={content}
                                  title={title}
                                  likes={likes}
                                  commentCount={commentCount}
                                  createdAt={createdAt}
                                  lastCommentedAt={lastCommentedAt}
                                  storyTellerPhoto={storyTeller?.photo}
                                  storyTellerUsername={storyTeller?.username}
                                  storyTellerProfileName={
                                    storyTeller?.profileName
                                  }
                                  storyTeller={storyTeller}
                                  storyTellerId={storyTeller?._id}
                                  storyTellerRole={storyTeller?.role}
                                  refetch={refetch}
                                  pageIndex={index}
                                />
                              );
                            })
                        : group?.data.data.data?.map(story => {
                            const {
                              content,
                              title,
                              storyTeller,

                              createdAt,
                              _id,
                              likes,
                              reports,
                              commentCount
                            } = story;
                            return (
                              <StoryCard
                                key={_id}
                                user={user}
                                userBookmarks={user?.bookmarks}
                                storyId={_id}
                                content={content}
                                title={title}
                                likes={likes}
                                reports={reports}
                                commentCount={commentCount}
                                createdAt={createdAt}
                                storyTeller={storyTeller}
                                storyTellerPhoto={storyTeller?.photo}
                                storyTellerUsername={storyTeller?.username}
                                storyTellerProfileName={
                                  storyTeller?.profileName
                                }
                                storyTellerId={storyTeller?._id}
                                storyTellerRole={storyTeller?.role}
                              />
                            );
                          })}
                    </Fragment>
                  );
                })}
            </div>
            <div
              ref={loadMoreRef}
              style={{
                visibility: !hasNextPage ? 'hidden' : 'default',
                height: 10
              }}
            >
              {isFetchingNextPage ? 'Loading more...' : ''}
            </div>
          </div>
          <PostsRightStack user={user} route="stories" capLabel="Story" />
        </div>
      </Container>
    </Box>
  );
};

export default Stories;
