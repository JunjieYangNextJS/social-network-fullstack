import React, { useMemo } from 'react';
import { Stack } from '@mantine/core';

import RelatedPeopleCard from '../Cards/RelatedPeopleCard/RelatedPeopleCard';

import FooterGrids from './../Grids/FooterGrids';
import {
  useGetLikeMindedPeople,
  useGetPopularPeople
} from './../../react-query-hooks/useOtherUsers/useOtherUser';
import SearchedItemsCard from './../Cards/SearchedItemsCard';

export default function RelatedPeopleRightStack({
  user,
  timeSelect,
  setTimeSelect,
  itemString,
  itemsString
}) {
  const { data: popular } = useGetPopularPeople();
  const { data: likeMinded } = useGetLikeMindedPeople(user?.id);

  const newLikeMinded = useMemo(() => {
    if (likeMinded && popular)
      return likeMinded.filter(
        el => !popular.map(e => (e = e._id)).includes(el._id)
      );
    // popular.map(el => el = el._id)
  }, [likeMinded, popular]);

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
      {itemString && (
        <SearchedItemsCard
          itemString={itemString}
          itemsString={itemsString}
          timeSelect={timeSelect}
          setTimeSelect={setTimeSelect}
        />
      )}

      {popular && (
        <Stack sx={{ position: 'sticky', top: 50 }}>
          <RelatedPeopleCard
            user={user}
            items={popular}
            message="People to follow"
          />
          {newLikeMinded && (
            <RelatedPeopleCard
              user={user}
              items={newLikeMinded}
              message="Like-minded"
            />
          )}
          <FooterGrids />
        </Stack>
      )}
    </Stack>
  );
}
