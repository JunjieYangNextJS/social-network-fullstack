import React, { useState, useEffect, useRef, Fragment } from 'react';
import { Container, Box } from '@mantine/core';
import { Helmet } from 'react-helmet-async';
import PostCard from './../../components/Cards/PostCard';
import useUser from './../../react-query-hooks/useUser/useUser';

import { useInfiniteQuery, useQuery } from 'react-query';
import backendApi from '../../utility/backendApi';
import axios from 'axios';
import useIntersectionObserver from './../../Hooks/useIntersectionObserverHook';

import PostsRightStack from './PostsRightStack';

import ParentCreationsFilterBar from './../../components/Navbars/ParentCreationsFilterBar';

const limit = 20;

const Posts = () => {
  const { data: user } = useUser();

  const urlParts = window.location.href.split('/');

  const last = urlParts[urlParts.length - 1] || 'general';

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

  const fetchPosts = ({ pageParam = 0 }) => {
    return axios.get(
      `${backendApi}posts?about=${option}&sort=${sortByValue}&limit=${limit}&page=${pageParam}`,
      {
        withCredentials: true
      }
    );
  };

  const fetchStickyPosts = () => {
    return axios
      .get(`${backendApi}posts/stickyPosts`, {
        withCredentials: true
      })
      .then(res => res.data.data);
  };

  const { data: stickyPosts } = useQuery(['stickyPosts'], fetchStickyPosts, {
    enabled: option === 'general'
  });

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,

    refetch
  } = useInfiniteQuery(
    ['posts', { sort: sortByValue }, { about: option }],
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
        backgroundColor: theme.colors.blue[2],
        minHeight: 'calc(100vh - 120px)',
        paddingTop: 120
      })}
    >
      <Helmet>
        <title>Priders.net - Posts</title>
        <meta name="description" content="Priders.net - stories" />
        <link rel="canonical" href={'/posts'} />
        <meta name="robots" content="index, follow" />
      </Helmet>
      <Container>
        <div style={{ display: 'flex', flexDirection: 'row', gap: '30px' }}>
          <div>
            <ParentCreationsFilterBar
              // last={last}
              itemsString="posts"
              itemString="post"
              sortByValue={sortByValue}
              setSortByValue={setSortByValue}
            />
            <div>
              {stickyPosts &&
                data &&
                stickyPosts.map(post => {
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
                    modFavored,
                    sticky
                  } = post;
                  return (
                    <PostCard
                      key={_id}
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
                      modFavored={modFavored}
                      sticky={sticky}
                      user={user}
                    />
                  );
                })}
            </div>
            <div>
              {data &&
                data.pages.map((group, index) => {
                  return (
                    <Fragment key={index}>
                      {user
                        ? group?.data.data.data
                            ?.filter(
                              post =>
                                !user?.blockedUsers.includes(post?.poster?.id)
                              // user?.blockedUsers.filter(function (id) {
                              //   return post?.poster?._id === id;
                              // }).length === 0
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
                                <PostCard
                                  key={_id}
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
                              );
                            })
                        : group?.data.data.data?.map(post => {
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
                              <PostCard
                                key={_id}
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
          <PostsRightStack user={user} route="posts" capLabel="Post" />
        </div>
      </Container>
    </Box>
  );
};

export default Posts;
