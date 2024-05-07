import React from 'react';

import { Container, Box, Text } from '@mantine/core';

import SideNavbarNested from './../components/SideNavbarNested';

import useUser from './../../../react-query-hooks/useUser/useUser';

import PrivacyCard from './../../../components/ConfigCards/PrivacyCard';

const Privacy = () => {
  const { data: user } = useUser();

  return (
    <Box
      sx={{
        paddingTop: 115,
        minHeight: `calc(100vh - 115px)`
      }}
    >
      {user && (
        <Container>
          <SideNavbarNested />
          <Container>
            <Text
              color="#373A40"
              size="xl"
              weight={700}
              sx={{ marginBottom: 25 }}
            >
              Privacy
            </Text>

            <PrivacyCard user={user} />
          </Container>
        </Container>
      )}
    </Box>
  );
};

export default Privacy;
