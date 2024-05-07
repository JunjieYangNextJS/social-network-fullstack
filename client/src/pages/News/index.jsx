import React, { useState, useRef, Fragment } from 'react';
import {
  Image,
  Text,
  Container,
  ThemeIcon,
  Title,
  SimpleGrid,
  createStyles,
  Button
} from '@mantine/core';
import { useInfiniteQuery } from 'react-query';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import dayjs from 'dayjs';
import { useDidUpdate } from '@mantine/hooks';
import useIntersectionObserver from './../../Hooks/useIntersectionObserverHook';
import backendApi from './../../utility/backendApi';
import NewsCard from './NewsCard';
import CalendarWithRange from './../../components/Calanders/CalendarWithRange';
import CalendarWithRangeModal from '../../components/Modals/CalendarWithRangeModal';
import NewsFilterBar from './NewsFilterBar';

const useStyles = createStyles(theme => ({
  wrapper: {
    paddingTop: 80,
    paddingBottom: 50
  },

  item: {
    display: 'flex'
  },

  itemIcon: {
    padding: theme.spacing.xs,
    marginRight: theme.spacing.md
  },

  itemTitle: {
    marginBottom: theme.spacing.xs / 2
  },

  supTitle: {
    textAlign: 'center',
    textTransform: 'uppercase',
    fontWeight: 800,
    fontSize: theme.fontSizes.sm,
    color:
      theme.colors[theme.primaryColor][theme.colorScheme === 'dark' ? 4 : 8],
    letterSpacing: 0.5
  },

  title: {
    lineHeight: 1,
    textAlign: 'center',
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.xl
  },

  description: {
    textAlign: 'center',
    marginTop: theme.spacing.xs
  },

  highlight: {
    backgroundColor:
      theme.colorScheme === 'dark'
        ? theme.fn.rgba(theme.colors[theme.primaryColor][6], 0.55)
        : theme.colors[theme.primaryColor][0],
    padding: 5,
    paddingTop: 0,
    borderRadius: theme.radius.sm,
    display: 'inline-block',
    color: theme.colorScheme === 'dark' ? theme.white : 'inherit'
  }
}));

const News = () => {
  const { classes } = useStyles();

  const [selectValue, setSelectValue] = useState('General');

  // for date range
  const [openCalendarModal, setOpenCalendarModal] = useState(false);
  const [dateValues, setDateValues] = useState([
    new Date('2022-6-1'),
    new Date('2023-6-1')
  ]);

  const limit = 6;

  const dateOne = dateValues[0]?.valueOf();
  const dateTwo = dateValues[1]?.valueOf();

  const fetchNews = ({ pageParam = 0 }) => {
    // if (searchValue) {
    //   return axios.get(
    //     `${backendApi}news/search?title=${searchValue}&createdAt[gte]=${dateOne}&createdAt[lte]=${dateTwo}&limit=${limit}&page=${pageParam}`
    //     // {
    //     //   withCredentials: true,
    //     // }
    //   );
    // }
    // if (selectValue) {
    return axios.get(
      `${backendApi}news?about=${selectValue}&createdAt[gte]=${dateOne}&createdAt[lte]=${dateTwo}&limit=${limit}&page=${pageParam}`
      // {
      //   withCredentials: true,
      // }
    );
    // }
    // return axios.get(
    //   `${backendApi}news?createdAt[gte]=${dateOne}&createdAt[lte]=${dateTwo}&limit=${limit}&page=${pageParam}`
    //   // {
    //   //   withCredentials: true,
    //   // }
    // );
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
    selectValue ? ['news', selectValue] : ['news'],
    fetchNews,
    {
      getNextPageParam: (lastPage, pages) => {
        if (pages.length < lastPage.data.totalDocsInDB / limit) {
          return pages.length + 1;
        } else {
          return undefined;
        }
      },
      enabled: !!(dateValues[0] && dateValues[1])
    }
  );

  useDidUpdate(() => {
    if (selectValue === null) setSelectValue('General');
    refetch();
  }, [selectValue]);

  const loadMoreRef = useRef();

  useIntersectionObserver({
    target: loadMoreRef,
    onIntersect: fetchNextPage,
    enabled: hasNextPage
  });

  return (
    <Container size={700} className={classes.wrapper}>
      <NewsFilterBar
        selectValue={selectValue}
        setSelectValue={setSelectValue}
        setOpenCalendarModal={setOpenCalendarModal}
      />
      <Title
        className={classes.title}
        order={2}
        sx={{ margin: '40px 0 60px 0' }}
      >
        LGBTQIA2S+ News
      </Title>
      <CalendarWithRangeModal
        setOpened={setOpenCalendarModal}
        opened={openCalendarModal}
        setValues={setDateValues}
        values={dateValues}
      />

      {/* <Container size={660} p={0}>
       

        
      </Container> */}

      <SimpleGrid
        cols={2}
        spacing={50}
        breakpoints={[{ maxWidth: 550, cols: 1, spacing: 40 }]}
        style={{ marginTop: 30 }}
      >
        {data?.pages.map((group, index) => {
          return (
            <Fragment key={index}>
              {group?.data.data.data?.map(el => {
                return <NewsCard key={el.id} news={el} />;
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
      </SimpleGrid>
    </Container>
  );
};

export default News;
