import React, { useState, useEffect, useMemo, useRef } from "react";
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
  Divider,
} from "@mantine/core";
import { Search, ArrowRight, ArrowLeft } from "tabler-icons-react";
import { useQueryClient } from "react-query";
import SideNavbarNested from "../components/SideNavbarNested";
import PostCard from "../../../components/Cards/PostCard";
import useUser from "../../../react-query-hooks/useUser/useUser";
import PostCommentCard from "../../../components/Cards/CommentCards/PostCommentCard";
import PaginationForComments from "./../../Stories/Story/StoryComments/PaginationForComments";
import StoryCommentCard from "../../../components/Cards/CommentCards/StoryCommentCard";
import StoryReplyCard from "./../../../components/Cards/CommentCards/StoryReplyCard";
import PostReplyCard from "./../../../components/Cards/CommentCards/PostReplyCard";

export default function RepliesPageModel({
  replies,
  isLoading,
  title,
  total,
  setPage,
  page,
  user,
  isStory,
}) {
  const useStyles = createStyles((theme) => ({
    root: {
      backgroundColor: theme.colors.red[1],
      paddingTop: 60,
      minHeight: "100vh",
    },

    container: {
      marginTop: 60,
      marginLeft: 400,
      display: "flex",
      flexDirection: "row",
      gap: "30px",
    },

    searchBar: {
      maxWidth: 400,
      marginBottom: 20,
    },
  }));

  const { theme, classes } = useStyles();
  const queryClient = useQueryClient();

  const searchRef = useRef("");

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

          {/* <TextInput
            icon={<Search size={18} />}
            radius="xl"
            size="md"
            className={classes.searchBar}
            rightSection={
              <ActionIcon
                // onClick={() => setTitleFilter(searchRef.current.value)}
                size={32}
                radius="xl"
                color="red"
                variant="filled"
              >
                <ArrowRight size={18} />
              </ActionIcon>
            }
            placeholder="Search"
            // value={searchRef.current.value}
            // onChange={(e) => setValue(e.currentTarget.value)}
            ref={searchRef}
            rightSectionWidth={42}
          /> */}
          <Container sx={{ width: "600px" }}>
            {isLoading && (
              <Center sx={{ paddingTop: "50px" }}>
                <Loader />
              </Center>
            )}
            {replies?.length === 0 && (
              <Center sx={{ paddingTop: "50px" }}>
                <Title order={4}>No matching results found.</Title>
              </Center>
            )}
            {replies?.length > 0 &&
              replies.map((reply) => {
                return (
                  <div key={reply._id}>
                    {isStory ? (
                      <StoryReplyCard user={user} storyReply={reply} />
                    ) : (
                      <PostReplyCard user={user} postReply={reply} />
                    )}
                  </div>
                );
              })}
          </Container>
          {total > 1 && (
            <PaginationForComments
              activePage={page}
              setActivePage={setPage}
              total={total}
            />
          )}
        </div>
        {/* <MyCommentsStoriesSorter
          setAboutFilter={setAboutFilter}
          aboutFilter={aboutFilter}
          setNewOrOldFilter={setNewOrOldFilter}
          newOrOldFilter={newOrOldFilter}
          setHotOrTopFilter={setHotOrTopFilter}
          hotOrTopFilter={hotOrTopFilter}
          items="Comments"
        /> */}
      </Box>
    </Box>
  );
}
