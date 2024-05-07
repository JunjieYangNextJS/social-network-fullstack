import React from 'react';
import { Stack } from '@mantine/core';

import OurCommunityCard from './../../../components/Cards/OurCommunityCard';

import FooterGrids from '../../../components/Grids/FooterGrids';
import RelatedPostCard from '../../../components/Cards/RelatedPostsCard';

export default function PostRightStack({
  user,
  related,
  route,
  routeWithFirstLetterCapitalized,
  unresponsed
}) {
  return (
    <Stack
      sx={{
        width: '300px',
        position: 'relative',
        '@media only screen and (max-width: 1111px)': {
          display: 'none'
        }
      }}
    >
      <OurCommunityCard route={route} />
      <Stack sx={{ position: 'sticky', top: 50 }}>
        <RelatedPostCard
          items={related}
          route={route}
          routeWithFirstLetterCapitalized={routeWithFirstLetterCapitalized}
          user={user}
          message="You might also like"
        />
        {unresponsed && unresponsed.length > 0 && (
          <RelatedPostCard
            items={unresponsed}
            route={route}
            routeWithFirstLetterCapitalized={routeWithFirstLetterCapitalized}
            user={user}
            message="Waiting for responses"
          />
        )}

        <FooterGrids />
      </Stack>
    </Stack>
  );
}
