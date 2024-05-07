import React, { useState, useEffect, useRef, Fragment } from 'react';
import { Container, Button, Box, Text } from '@mantine/core';

import PostCard from './../../components/Cards/PostCard';
import useUser from './../../react-query-hooks/useUser/useUser';
import usePosts from '../../react-query-hooks/usePosts/usePosts';
import { useInfiniteQuery, useQueryClient } from 'react-query';
import backendApi from '../../utility/backendApi';
import axios from 'axios';
import useIntersectionObserver from './../../Hooks/useIntersectionObserverHook';
import { useNavigate, Link, useParams } from 'react-router-dom';

import { useSearchQueryPosts } from '../../react-query-hooks/usePosts/usePosts';
import ParentCreationsFilterBar from './../../components/Navbars/ParentCreationsFilterBar';
import RelatedPeopleRightStack from '../../components/SorterStack/RelatedPeopleRightStack';
import SearchedItemsCard from '../../components/Cards/SearchedItemsCard';
import calcTimeAgo from '../../utility/calcTimeAgo';

const SearchedPosts = () => {
  // const [posts, setPosts] = useState(null);
  const { data: user } = useUser();

  let params = useParams();
  const limit = 5;

  // const [sortByValue, setSortByValue] = useState("-lastCommentedAt");

  const [timeSelect, setTimeSelect] = useState(0);

  const fetchPosts = ({ pageParam = 0 }) => {
    if (timeSelect) {
      return axios.get(
        `${backendApi}posts/searchQuery/${
          params.search
        }?createdAt[gte]=${Date.now() -
          timeSelect}&limit=${limit}&page=${pageParam}`
      );
    } else {
      return axios.get(
        `${backendApi}posts/searchQuery/${
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
    ['posts/searchQuery', params.search, { within: timeSelect }],
    fetchPosts,
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

  if (data && data.pages[0].data.results === 0) {
    return (
      <Box
        sx={theme => ({
          backgroundColor: theme.colors.blue[2],
          minHeight: 'calc(100vh - 120px)',
          paddingTop: 120
        })}
      >
        <Container>
          <div style={{ display: 'flex', flexDirection: 'row', gap: '30px' }}>
            <div style={{ width: '35vw' }}>
              <Text size="xl" weight={700}>
                No results found
              </Text>
            </div>
            <RelatedPeopleRightStack
              user={user}
              timeSelect={timeSelect}
              setTimeSelect={setTimeSelect}
              itemString="post"
              itemsString="posts"
            />
          </div>
        </Container>
      </Box>
    );
  }

  return (
    <Box
      sx={theme => ({
        backgroundColor: theme.colors.blue[2],
        minHeight: 'calc(100vh - 120px)',
        paddingTop: 120
      })}
    >
      <Container>
        <div style={{ display: 'flex', flexDirection: 'row', gap: '30px' }}>
          <div style={{ width: 600 }}>
            {data &&
              data?.pages.map((group, index) => {
                return (
                  <Fragment key={index}>
                    {user
                      ? group.data.data.data
                          ?.filter(
                            post =>
                              !user?.blockedUsers.includes(post?.poster?.id)
                          )
                          ?.filter(
                            post => !user?.hiddenPosts.includes(post?._id)
                          )
                          ?.map(post => {
                            const {
                              content,
                              title,
                              poll,
                              poster,
                              images,
                              createdAt,
                              lastCommentedAt,
                              _id,
                              likes,
                              commentCount,
                              modFavored
                            } = post;
                            return (
                              <div key={_id}>
                                <PostCard
                                  user={user}
                                  postId={_id}
                                  content={content}
                                  poll={poll}
                                  title={title}
                                  likes={likes}
                                  commentCount={commentCount}
                                  images={images}
                                  createdAt={createdAt}
                                  lastCommentedAt={lastCommentedAt}
                                  poster={poster}
                                  posterPhoto={poster?.photo}
                                  posterUsername={poster?.username}
                                  posterProfileName={poster?.profileName}
                                  posterId={poster?._id}
                                  posterRole={poster?.role}
                                  refetch={refetch}
                                  pageIndex={index}
                                  oldPagesArray={data}
                                  modFavored={modFavored}
                                />
                              </div>
                            );
                          })
                      : group.data.data.data?.map(post => {
                          const {
                            content,
                            title,
                            poll,
                            poster,
                            images,
                            createdAt,
                            lastCommentedAt,
                            _id,
                            likes,
                            commentCount,
                            modFavored
                          } = post;
                          return (
                            <div key={_id}>
                              <PostCard
                                user={user}
                                postId={_id}
                                content={content}
                                poll={poll}
                                title={title}
                                likes={likes}
                                commentCount={commentCount}
                                images={images}
                                createdAt={createdAt}
                                lastCommentedAt={lastCommentedAt}
                                poster={poster}
                                posterPhoto={poster?.photo}
                                posterUsername={poster?.username}
                                posterProfileName={poster?.profileName}
                                posterId={poster?._id}
                                posterRole={poster?.role}
                                refetch={refetch}
                                pageIndex={index}
                                oldPagesArray={data}
                                modFavored={modFavored}
                              />
                            </div>
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
            itemString="post"
            itemsString="posts"
          />
        </div>
      </Container>
    </Box>
  );
};

export default SearchedPosts;
