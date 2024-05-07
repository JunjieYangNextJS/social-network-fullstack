import React, { useState, useMemo, forwardRef } from 'react';

import {
  Card,
  Image,
  Text,
  Badge,
  Button,
  Group,
  Stack,
  useMantineTheme,
  Autocomplete,
  ActionIcon,
  TextInput,
  NativeSelect,
  Select
} from '@mantine/core';
import { useNavigate, Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import { ArrowLeft, ArrowRight, Search } from 'tabler-icons-react';

export default function SearchedItemsCard({
  itemString,
  itemsString,
  timeSelect,
  setTimeSelect
}) {
  const theme = useMantineTheme();

  const [value, setValue] = useState('');

  const navigate = useNavigate();

  const handleSearchQuery = () => {
    const historyArrayStrings = Cookies.get(`${itemString}SearchHistory`);
    if (historyArrayStrings) {
      // read cookiesStrings as normal array of strings
      const historyArray = JSON.parse(historyArrayStrings);

      if (!historyArray.includes(value)) {
        let cloned = [value, ...historyArray];
        if (cloned.length > 15) cloned.pop();

        Cookies.set(`${itemString}SearchHistory`, JSON.stringify(cloned));
      }
    } else {
      Cookies.set(`${itemString}SearchHistory`, JSON.stringify([value]));
    }

    navigate(`/${itemsString}-search/${value}`);
  };

  return (
    // <div style={{ width: 340, margin: "auto" }}>
    <Card shadow="xl" p="lg">
      {Cookies.get(`${itemString}SearchHistory`) ? (
        <Autocomplete
          icon={<Search size={18} />}
          radius="xl"
          size="md"
          rightSection={
            <ActionIcon
              onClick={() => handleSearchQuery()}
              size={32}
              radius="xl"
              color={itemsString === 'stories' ? 'grape' : theme.primaryColor}
              variant="filled"
            >
              {theme.dir === 'ltr' ? (
                <ArrowRight size={18} />
              ) : (
                <ArrowLeft size={18} />
              )}
            </ActionIcon>
          }
          placeholder="Search"
          value={value}
          onChange={setValue}
          // data={[""]}
          data={JSON.parse(Cookies.get(`${itemString}SearchHistory`))}
          rightSectionWidth={42}
        />
      ) : (
        <TextInput
          icon={<Search size={18} />}
          radius="xl"
          size="md"
          rightSection={
            <ActionIcon
              onClick={() => handleSearchQuery()}
              size={32}
              radius="xl"
              color={itemsString === 'stories' ? 'grape' : theme.primaryColor}
              variant="filled"
            >
              {theme.dir === 'ltr' ? (
                <ArrowRight size={18} />
              ) : (
                <ArrowLeft size={18} />
              )}
            </ActionIcon>
          }
          placeholder="Search"
          value={value}
          onChange={e => setValue(e.currentTarget.value)}
          rightSectionWidth={42}
        />
      )}
      <Select
        label="Posted "
        value={timeSelect}
        onChange={setTimeSelect}
        data={[
          { value: 604800000, label: 'Last week' },
          { value: 2629800000, label: 'Last month' },
          { value: 31540000000, label: 'Last year' },
          { value: 0, label: 'All time' }
        ]}
      />
    </Card>
    // </div>
  );
}
