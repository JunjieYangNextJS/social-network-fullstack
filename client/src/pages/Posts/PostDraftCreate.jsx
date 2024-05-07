import React, { useState } from "react";
import PostCreateForm from "./../../components/Forms/PostForms/PostCreateForm";
import { Container, Button, Text, Group, Box } from "@mantine/core";
import PostStoryDraftModal from "../../components/Modals/PostStoryDraftModal";
import DraftCreateForm from "./../../components/Forms/PostForms/DraftCreateForm";
import { useDraftPosts } from "../../react-query-hooks/usePosts/useDraftPost";
import CreateRightStack from "./../../components/SorterStack/CreateRightStack";
import { useParams } from "react-router-dom";

const PostDraftCreate = () => {
  const [draftsOpen, setDraftsOpen] = useState(false);

  const { data } = useDraftPosts();
  const { postId } = useParams();

  return (
    <Box
      sx={(theme) => ({
        backgroundColor: theme.colors.blue[2],
        paddingTop: 120,
        height: `calc(100vh - 120px)`,
      })}
    >
      <Container>
        <div style={{ display: "flex", flexDirection: "row", gap: "30px" }}>
          <div>
            <PostStoryDraftModal
              opened={draftsOpen}
              setOpened={setDraftsOpen}
              data={data}
              itemId={postId}
              itemsString="posts"
            />
            <Group
              position="apart"
              sx={(theme) => ({
                backgroundColor: theme.white,
                padding: "10px 10px 10px 25px",
                borderRadius: theme.radius.sm,
                boxShadow: theme.shadows.sm,
                marginBottom: 20,
              })}
            >
              <Text weight={500} size="md">
                Create my post
              </Text>
              {data?.length !== 0 ? (
                <Button
                  variant="subtle"
                  onClick={() => setDraftsOpen(!draftsOpen)}
                >
                  drafts ({data?.length})
                </Button>
              ) : (
                <Button
                  variant="subtle"
                  onClick={() => setDraftsOpen(!draftsOpen)}
                >
                  drafts
                </Button>
              )}
            </Group>

            <DraftCreateForm
              draftsOpen={draftsOpen}
              setDraftsOpen={setDraftsOpen}
            />
            {/* <RichTextForm /> */}
          </div>
          <CreateRightStack />
        </div>
      </Container>
    </Box>
  );
};

export default PostDraftCreate;
