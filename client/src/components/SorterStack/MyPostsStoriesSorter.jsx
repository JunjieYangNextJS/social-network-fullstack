import React, { useState } from 'react';
import { Stack, Group, Container, Button } from '@mantine/core';
import RoutelessAboutGrids from '../Grids/RoutelessAboutGrids';
import CreatedAtSelect from '../Selects/CreatedAtSelect';
import HotTopSelect from '../Selects/HotTopSelect';
import FooterGrids from '../Grids/FooterGrids';

export default function MyPostsStoriesSorter({
  setAboutFilter,
  aboutFilter,
  setNewOrOldFilter,
  newOrOldFilter,
  setHotOrTopFilter,
  hotOrTopFilter,
  items
}) {
  return (
    <Stack
      sx={{
        width: 300,
        '@media only screen and (max-width: 700px)': {
          display: 'none'
        }
      }}
    >
      <RoutelessAboutGrids
        setAboutFilter={setAboutFilter}
        aboutFilter={aboutFilter}
      />
      <CreatedAtSelect
        setNewOrOldFilter={setNewOrOldFilter}
        newOrOldFilter={newOrOldFilter}
        items={items}
      />
      <HotTopSelect
        setHotOrTopFilter={setHotOrTopFilter}
        hotOrTopFilter={hotOrTopFilter}
      />
      <FooterGrids />
    </Stack>
  );
}
