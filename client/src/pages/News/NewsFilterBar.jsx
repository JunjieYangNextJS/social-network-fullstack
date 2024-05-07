import React, { useState, useEffect } from "react";
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
  Select,
  Button,
} from "@mantine/core";
import {
  Search,
  BuildingCarousel,
  Bulb,
  Sunrise,
  BrightnessUp,
  ArrowRight,
  ArrowLeft,
} from "tabler-icons-react";
import { Link, useNavigate } from "react-router-dom";
import { useDidUpdate } from "@mantine/hooks";
import AboutSelect from "../../components/Selects/AboutSelect";

const useStyles = createStyles((theme) => ({
  // header: {
  //   paddingLeft: theme.spacing.md,
  //   paddingRight: theme.spacing.md,
  // },

  inner: {
    height: 56,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  links: {
    [theme.fn.smallerThan("xs")]: {
      display: "none",
    },
  },

  //   search: {
  //     [theme.fn.smallerThan("xs")]: {
  //       display: "none",
  //     },
  //   },

  link: {
    display: "block",
    lineHeight: 1,
    padding: "8px 12px",
    borderRadius: theme.radius.sm,
    textDecoration: "none",
    cursor: "pointer",
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[0]
        : theme.colors.gray[7],
    fontSize: theme.fontSizes.sm,
    fontWeight: 500,

    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[6]
          : theme.colors.gray[0],
    },
  },
}));

export default function NewsFilterBar({
  selectValue,
  setSelectValue,
  setOpenCalendarModal,
}) {
  const { classes, theme } = useStyles();
  const [value, setValue] = useState("");

  const navigate = useNavigate();

  const handleSearchQuery = () => {
    navigate(`/news-search/${value}`);
  };

  // const links = [
  //   { label: "L", icon: <Bulb size={24} /> },
  //   { label: "G", icon: <BrightnessUp size={24} /> },
  //   { label: "B", icon: <Sunrise size={24} /> },
  // ];

  // const items = links.map((link) => (
  //   <Anchor
  //     key={link.label}
  //     component={Link}
  //     to={`/news/${link.label}`}
  //     className={classes.link}
  //     underline={false}
  //     sx={{
  //       backgroundColor:
  //         link.label === last && theme.colors[theme.primaryColor][0],
  //       color: link.label === last && theme.colors[theme.primaryColor][7],
  //     }}
  //   >
  //     <Group spacing={3}>
  //       {link.icon}
  //       <Text>{link.label}</Text>
  //     </Group>
  //   </Anchor>
  // ));

  return (
    <Header height={56} className={classes.header} mb={20}>
      {/* <div className={classes.inner}> */}
      <Group position="center">
        <TextInput
          icon={<Search size={18} />}
          radius="xl"
          size="sm"
          rightSection={
            <ActionIcon
              onClick={() => handleSearchQuery()}
              size={32}
              radius="xl"
              color={theme.primaryColor}
              variant="filled"
            >
              {theme.dir === "ltr" ? (
                <ArrowRight size={18} />
              ) : (
                <ArrowLeft size={18} />
              )}
            </ActionIcon>
          }
          placeholder="Search"
          value={value}
          onChange={(event) => setValue(event.currentTarget.value)}
          rightSectionWidth={42}
        />
        <AboutSelect
          selectValue={selectValue}
          setSelectValue={setSelectValue}
          // label="Your interest"
          data={[
            { value: "General", label: "General" },
            { value: "L", label: "Lesbian" },
            { value: "G", label: "Gay" },
            { value: "B", label: "Bisexual" },
            { value: "T", label: "Transgender" },
            { value: "Q", label: "Queer/ Questioning" },
            { value: "I", label: "Intersex" },
            { value: "A", label: "Asexual" },
            { value: "2S", label: "Two-Spirit" },
            { value: "+More", label: "+More" },
          ]}
          onlyOne={true}
        />

        <Button onClick={() => setOpenCalendarModal(true)} variant="subtle">
          Date picker
        </Button>
      </Group>
      {/* </div> */}
    </Header>
  );
}
