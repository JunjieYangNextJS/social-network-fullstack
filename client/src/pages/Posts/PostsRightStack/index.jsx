import React, { useState } from 'react';
import { Stack, Group, Container, Button } from '@mantine/core';
import { Link } from 'react-router-dom';
import OurCommunityCard from './../../../components/Cards/OurCommunityCard';
import AboutGrids from '../../../components/Grids/AboutGrids';
import WhatIsNewCard from '../../../components/Cards/WhatIsNewCard';
import FooterGrids from '../../../components/Grids/FooterGrids';

export default function PostsRightStack({ user, route, capLabel }) {
  return (
    <Stack
      sx={{
        width: '300px',
        position: 'relative',
        '@media only screen and (max-width: 700px)': {
          display: 'none'
        }
      }}
    >
      <Button
        component={Link}
        to={
          // user ?
          `/${route}/create`
          // : "/login"
        }
        color={route === 'stories' ? 'grape' : 'default'}
      >
        Create {capLabel}
      </Button>
      <AboutGrids route={route} />
      <OurCommunityCard route={route} />
      <Stack sx={{ position: 'sticky', top: -400 }}>
        <WhatIsNewCard route={route} />
        <FooterGrids />
      </Stack>
    </Stack>
  );
}
