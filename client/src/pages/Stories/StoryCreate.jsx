import React, { useState } from 'react';
import StoryCreateForm from './../../components/Forms/StoryForms/StoryCreateForm';
import { Container, Button, Box, Text, Group } from '@mantine/core';
import PostStoryDraftModal from '../../components/Modals/PostStoryDraftModal';
import RulesGrids from '../../components/Grids/RulesGrids';
import CreateRightStack from './../../components/SorterStack/CreateRightStack';
import { useDraftStories } from '../../react-query-hooks/useStories/useDraftStory';
import { useParams } from 'react-router-dom';

const StoryCreate = () => {
  const [draftsOpen, setDraftsOpen] = useState(false);

  const { data } = useDraftStories();
  const { storyId } = useParams();

  return (
    <Box
      sx={theme => ({
        backgroundColor: theme.colors.grape[2],
        paddingTop: 120,
        minHeight: 'calc(100vh - 120px)'
      })}
    >
      <Container>
        <div style={{ display: 'flex', flexDirection: 'row', gap: '30px' }}>
          <div>
            <PostStoryDraftModal
              opened={draftsOpen}
              setOpened={setDraftsOpen}
              data={data}
              itemId={storyId}
              itemsString="stories"
            />
            <Group
              position="apart"
              sx={theme => ({
                backgroundColor: theme.white,
                padding: '10px 10px 10px 25px',
                borderRadius: theme.radius.sm,
                boxShadow: theme.shadows.sm,
                marginBottom: 20
              })}
            >
              <Text weight={500} size="md">
                Create my Story
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

            <StoryCreateForm
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

export default StoryCreate;
