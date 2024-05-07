import React, { useState, useMemo, forwardRef } from 'react';
import {
  createStyles,
  Header,
  Autocomplete,
  Group,
  Burger,
  Anchor,
  Center,
  Text,
  TextInput,
  ActionIcon,
  Paper,
  UnstyledButton,
  Box
} from '@mantine/core';
import {
  Search,
  BuildingCarousel,
  Bulb,
  Sunrise,
  BrightnessUp,
  ArrowRight,
  ArrowLeft
} from 'tabler-icons-react';
import { Link, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const useStyles = createStyles(theme => ({
  // header: {
  //   radius: theme.radius.sm,
  //   shadow: theme.shadows.xl,
  // },

  inner: {
    height: 56,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginRight: '10px'
  },

  links: {
    [theme.fn.smallerThan('xs')]: {
      display: 'none'
    },
    '@media only screen and (max-width: 940px)': {
      display: 'none'
    }
  },

  //   search: {
  //     [theme.fn.smallerThan("xs")]: {
  //       display: "none",
  //     },
  //   },

  link: {
    display: 'block',
    lineHeight: 1,
    padding: '8px 10px',
    borderRadius: theme.radius.sm,
    textDecoration: 'none',
    cursor: 'pointer',
    color:
      theme.colorScheme === 'dark'
        ? theme.colors.dark[0]
        : theme.colors.gray[7],
    fontSize: theme.fontSizes.sm,
    fontWeight: 500,

    '&:hover': {
      backgroundColor:
        theme.colorScheme === 'dark'
          ? theme.colors.dark[6]
          : theme.colors.gray[0]
    }
  },

  // searchBarContainer: {
  //   '@media only screen and (max-width: 940px)': {
  //     display: 'none'
  //   }
  // },
  newTopHotContainer: {
    '@media only screen and (max-width: 940px)': {
      display: 'none'
    }
  }
}));

export default function ParentCreationsFilterBar({
  last,
  itemString,
  itemsString,
  sortByValue,
  setSortByValue
}) {
  const { classes, theme } = useStyles();
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

  const links = [
    { label: 'New', value: '-lastCommentedAt', icon: <Bulb size={24} /> },
    { label: 'Top', value: '-likesCount', icon: <Sunrise size={24} /> },
    {
      label: 'Hot',
      value: '-commentCount',

      icon: <BrightnessUp size={24} />
    }
  ];

  const elements = links.map(link => (
    <UnstyledButton
      key={link.label}
      value={link.value}
      onClick={() => setSortByValue(link.value)}
      className={classes.link}
      sx={{
        backgroundColor:
          itemsString === 'stories'
            ? link.value === sortByValue && theme.colors.grape[0]
            : link.value === sortByValue && theme.colors[theme.primaryColor][0],

        color:
          itemsString === 'stories'
            ? link.value === sortByValue && theme.colors.grape[7]
            : link.value === sortByValue && theme.colors[theme.primaryColor][7]
      }}

      //   onClick={(event) => event.preventDefault()}
    >
      <Group spacing={3}>
        {link.icon}
        <Text>{link.label}</Text>
      </Group>
    </UnstyledButton>
  ));

  return (
    <Paper height={56} shadow="md" mb={20}>
      <div>
        <Group className={classes.inner}>
          <Group ml={50} spacing={5} className={classes.links}>
            {elements}
          </Group>
          <Box>
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
                    color={itemsString === 'stories' ? 'grape' : 'default'}
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
                    color={itemsString === 'stories' ? 'grape' : 'default'}
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
          </Box>
        </Group>
      </div>
    </Paper>
  );
}
