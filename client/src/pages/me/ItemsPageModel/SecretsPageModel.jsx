import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  createStyles,
  TextInput,
  ActionIcon,
  Menu,
  ScrollArea,
  Container,
  Box,
  Loader,
  Center,
  Title,
  Text,
  Divider
} from '@mantine/core';
import { Search, ArrowRight, ArrowLeft } from 'tabler-icons-react';
import { useQueryClient } from 'react-query';
import SideNavbarNested from '../components/SideNavbarNested';
import useUser from '../../../react-query-hooks/useUser/useUser';
import PaginationForComments from './../../Stories/Story/StoryComments/PaginationForComments';
import SecretCard from '../../../components/Cards/SecretCard';

export default function SecretsPageModel({
  secrets,
  isLoading,
  title,
  total,
  setPage,
  page,
  user
}) {
  const useStyles = createStyles(theme => ({
    root: {
      backgroundColor: theme.colors.green[2],
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

  const { theme, classes } = useStyles();
  const queryClient = useQueryClient();

  const searchRef = useRef('');

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

          <Container sx={{ width: '600px' }}>
            {isLoading && (
              <Center sx={{ paddingTop: '50px' }}>
                <Loader />
              </Center>
            )}
            {secrets?.length === 0 && (
              <Center sx={{ paddingTop: '50px' }}>
                <Title order={4}>No matching results found.</Title>
              </Center>
            )}
            {secrets?.length > 0 &&
              secrets.map(secret => {
                return (
                  <div key={secret._id}>
                    <SecretCard secret={secret} user={user} />
                  </div>
                );
              })}
          </Container>
          {total && total > 1 && (
            <PaginationForComments
              activePage={page}
              setActivePage={setPage}
              total={total}
            />
          )}
        </div>
      </Box>
    </Box>
  );
}
