import React from 'react';
import { Stack } from '@mantine/core';
import RulesGrids from './../Grids/RulesGrids';
import OurCommunityCard from './../Cards/OurCommunityCard';
import FooterGrids from './../Grids/FooterGrids';

export default function CreateRightStack() {
  return (
    <Stack
      sx={{
        width: 300,
        '@media only screen and (max-width: 800px)': {
          display: 'none'
        }
      }}
      spacing="xl"
    >
      <OurCommunityCard />
      <RulesGrids />
      <FooterGrids />
    </Stack>
  );
}
