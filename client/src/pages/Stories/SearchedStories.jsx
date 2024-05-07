import React, { useState, useEffect, useRef, Fragment } from 'react';
import { Container, Button, Box } from '@mantine/core';
import useUser from './../../react-query-hooks/useUser/useUser';
import { useInfiniteQuery, useQueryClient } from 'react-query';
import backendApi from '../../utility/backendApi';
import axios from 'axios';
import useIntersectionObserver from './../../Hooks/useIntersectionObserverHook';
import { useNavigate, Link, useParams } from 'react-router-dom';

import ParentCreationsFilterBar from './../../components/Navbars/ParentCreationsFilterBar';
import RelatedPeopleRightStack from '../../components/SorterStack/RelatedPeopleRightStack';
import SearchedItemsCard from '../../components/Cards/SearchedItemsCard';
import calcTimeAgo from '../../utility/calcTimeAgo';
import StoryCard from './../../components/Cards/StoryCard';

const SearchedStories = () => {
  // const [stories, setStories] = useState(null);
  const { data: user } = useUser();

  let params = useParams();
  const limit = 5;

  // const [sortByValue, setSortByValue] = useState("-lastCommentedAt");

  const [timeSelect, setTimeSelect] = useState(0);

  const fetchStories = ({ pageParam = 0 }) => {
    if (timeSelect) {
      return axios.get(
        `${backendApi}stories/searchQuery/${
          params.search
        }?createdAt[gte]=${Date.now() -
          timeSelect}&limit=${limit}&page=${pageParam}`
      );
    } else {
      return axios.get(
        `${backendApi}stories/searchQuery/${
          params.search
        }?limit=5&page=${pageParam}`
      );
    }
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
    ['stories/searchQuery', params.search, { within: timeSelect }],
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

  // useEffect(() => {
  //   refetch();
  // }, [last, refetch]);

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
        paddingTop: 120,
        minHeight: 'calc(100vh - 120px)'
      })}
    >
      <Container>
        <div style={{ display: 'flex', flexDirection: 'row', gap: '30px' }}>
          <div style={{ width: 600 }}>
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
                              images,
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
                                images={images}
                                createdAt={createdAt}
                                lastCommentedAt={lastCommentedAt}
                                storyTeller={storyTeller}
                                storyTellerPhoto={storyTeller?.photo}
                                storyTellerUsername={storyTeller?.username}
                                storyTellerProfileName={
                                  storyTeller?.profileName
                                }
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
                            images,
                            createdAt,
                            _id,
                            likes,
                            reports,
                            viewCount,
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
                              images={images}
                              createdAt={createdAt}
                              storyTeller={storyTeller}
                              storyTellerPhoto={storyTeller?.photo}
                              storyTellerUsername={storyTeller?.username}
                              storyTellerId={storyTeller?._id}
                              storyTellerRole={storyTeller?.role}
                            />
                          );
                        })}
                  </Fragment>
                );
              })}
            <div
              ref={loadMoreRef}
              sx={{ visibility: !hasNextPage ? 'hidden' : 'default' }}
            >
              {isFetchingNextPage ? 'Loading more...' : ''}
            </div>
          </div>
          <RelatedPeopleRightStack
            user={user}
            timeSelect={timeSelect}
            setTimeSelect={setTimeSelect}
            itemString="story"
            itemsString="stories"
          />
        </div>
      </Container>
    </Box>
  );
};

export default SearchedStories;
