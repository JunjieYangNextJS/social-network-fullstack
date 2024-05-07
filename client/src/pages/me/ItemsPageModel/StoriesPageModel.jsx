import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  createStyles,
  TextInput,
  ActionIcon,
  Container,
  Box,
  Loader,
  Center,
  Title,
  Text
} from '@mantine/core';
import { Search, ArrowRight } from 'tabler-icons-react';

import SideNavbarNested from '../components/SideNavbarNested';

import MyPostsStoriesSorter from '../../../components/SorterStack/MyPostsStoriesSorter';
import StoryCard from './../../../components/Cards/StoryCard';
import useUser from './../../../react-query-hooks/useUser/useUser';

export default function StoriesPageModel({ stories, isLoading, title }) {
  const { data: user } = useUser();

  const useStyles = createStyles(theme => ({
    root: {
      backgroundColor: theme.colors.grape[2],
      paddingTop: 60,
      minHeight: '100vh'
    },

    container: {
      marginTop: 60,
      marginLeft: 400,
      display: 'flex',
      flexDirection: 'row',
      gap: '30px'
    },

    searchBar: {
      maxWidth: 400,
      marginBottom: 20
    }
  }));

  const { classes } = useStyles();

  const searchRef = useRef('');

  const [titleFilter, setTitleFilter] = useState('');
  const [aboutFilter, setAboutFilter] = useState([]);
  const [newOrOldFilter, setNewOrOldFilter] = useState('Newest');
  const [hotOrTopFilter, setHotOrTopFilter] = useState('');

  const filtered = useMemo(() => {
    if (stories) {
      let newArray = [...stories];

      if (titleFilter)
        newArray = newArray.filter(el =>
          el.title.toLowerCase().includes(titleFilter.toLowerCase())
        );

      if (aboutFilter.length !== 0)
        newArray = newArray.filter(el => aboutFilter.includes(el.about));

      switch (newOrOldFilter) {
        case 'Newest':
          break;

        case 'Oldest':
          newArray = newArray.reverse();
          break;

        case 'Last Year':
          newArray = newArray
            .filter(el => Date.parse(el.createdAt) > Date.now() - 31540000000)
            .reverse();
          break;

        case 'Last Month':
          newArray = newArray
            .filter(el => Date.parse(el.createdAt) > Date.now() - 2629800000)
            .reverse();
          break;

        case 'Last Week':
          newArray = newArray
            .filter(el => Date.parse(el.createdAt) > Date.now() - 604800000)
            .reverse();
          break;

        case 'Last Day':
          newArray = newArray
            .filter(el => Date.parse(el.createdAt) > Date.now() - 86400000)
            .reverse();
          break;

        default:
          alert('error');
      }

      switch (hotOrTopFilter) {
        case 'Default':
          break;

        case 'Hot: most to least':
          newArray = newArray.sort(
            (a, b) => new Date(b.commentCount) - new Date(a.commentCount)
          );
          break;

        case 'Hot: least to most':
          newArray = newArray.sort(
            (a, b) => new Date(a.commentCount) - new Date(b.commentCount)
          );
          break;

        case 'Top: most to least':
          newArray = newArray.sort(
            (a, b) => new Date(b.likes.length) - new Date(a.likes.length)
          );
          break;

        case 'Top: least to most':
          newArray = newArray.sort(
            (a, b) => new Date(a.likes.length) - new Date(b.likes.length)
          );
          break;

        default:
          break;
      }

      return newArray;
    }
  }, [titleFilter, stories, aboutFilter, newOrOldFilter, hotOrTopFilter]);

  return (
    <Box className={classes.root}>
      <SideNavbarNested />
      <Box className={classes.container}>
        <div>
          <Text
            color="#373A40"
            size="xl"
            weight={700}
            sx={{ marginBottom: 25, marginLeft: 5 }}
          >
            {title}
          </Text>

          <TextInput
            icon={<Search size={18} />}
            radius="xl"
            size="md"
            className={classes.searchBar}
            rightSection={
              <ActionIcon
                onClick={() => setTitleFilter(searchRef.current.value)}
                size={32}
                radius="xl"
                color="blue"
                variant="filled"
              >
                <ArrowRight size={18} />
              </ActionIcon>
            }
            placeholder="Search"
            ref={searchRef}
            rightSectionWidth={42}
          />
          <Container sx={{ width: '600px' }}>
            {isLoading && (
              <Center sx={{ paddingTop: '50px' }}>
                <Loader />
              </Center>
            )}
            {filtered?.length === 0 && (
              <Center sx={{ paddingTop: '50px' }}>
                <Title order={4}>No matching results found.</Title>
              </Center>
            )}
            {filtered?.length > 0 &&
              filtered.map(story => {
                const {
                  content,
                  title,
                  storyTeller,
                  images,
                  createdAt,
                  lastCommentedAt,
                  _id,
                  likes,
                  commentCount
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
                    storyTellerProfileName={storyTeller?.profileName}
                    storyTellerId={storyTeller?._id}
                    storyTellerRole={storyTeller?.role}
                    withBorder={true}
                    notFunctional={true}
                  />
                );
              })}
          </Container>
        </div>
        <MyPostsStoriesSorter
          setAboutFilter={setAboutFilter}
          aboutFilter={aboutFilter}
          setNewOrOldFilter={setNewOrOldFilter}
          newOrOldFilter={newOrOldFilter}
          setHotOrTopFilter={setHotOrTopFilter}
          hotOrTopFilter={hotOrTopFilter}
          items="Stories"
        />
      </Box>
    </Box>
  );
}
