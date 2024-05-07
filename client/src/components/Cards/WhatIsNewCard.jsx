import React from 'react';
import {
  Card,
  Image,
  Text,
  Badge,
  Button,
  Group,
  Stack,
  useMantineTheme
} from '@mantine/core';
import NewsCard from './../../pages/News/NewsCard';
import useGetWhatIsNew from './../../react-query-hooks/useNews/useGetWhatIsNew';
import { useNavigate } from 'react-router-dom';

export default function WhatIsNewCard({ route }) {
  const { data } = useGetWhatIsNew(3);

  const theme = useMantineTheme();
  const navigate = useNavigate();

  const secondaryColor =
    theme.colorScheme === 'dark' ? theme.colors.dark[1] : theme.colors.gray[7];

  return (
    // <div style={{ width: 340, margin: "auto" }}>
    <Card shadow="xl" p="lg">
      <div style={{ marginBottom: 12, marginTop: theme.spacing.sm }}>
        <Text weight={500}>What is New?</Text>
      </div>
      <Stack>
        {data?.map(data => (
          <NewsCard news={data} key={data?.id} imageless={true} />
        ))}
      </Stack>

      <Button
        variant="light"
        fullWidth
        style={{ marginTop: 14 }}
        onClick={() => navigate('/news')}
        color={route === 'stories' ? 'grape' : theme.primaryColor}
      >
        See more
      </Button>
    </Card>
    // </div>
  );
}
