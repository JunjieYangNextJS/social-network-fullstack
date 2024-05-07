import { useState, useEffect } from 'react';
import {
  Modal,
  Button,
  Group,
  Container,
  Divider,
  Text,
  ActionIcon,
  useMantineTheme
} from '@mantine/core';
import { useDraftPosts } from '../../react-query-hooks/usePosts/useDraftPost';
import { useNavigate, useParams } from 'react-router-dom';
import Cookies from 'js-cookie';
import { Trash } from 'tabler-icons-react';
import calcTimeAgo from '../../utility/calcTimeAgo';
import useDeletePost from './../../react-query-hooks/usePosts/useDeletePost';
import { useQueryClient } from 'react-query';

export default function PostStoryDraftModal({
  opened,
  setOpened,
  data,
  itemId,
  itemsString
}) {
  const [deleteFirstClick, setDeleteFirstClick] = useState('');
  const queryClient = useQueryClient();
  const theme = useMantineTheme();

  const { mutate, isSuccess } = useDeletePost();

  const navigate = useNavigate();

  const navigateToPostsDraft = (id, content) => {
    localStorage.setItem(`draft-${id}`, content);
    navigate(`/${itemsString}/draft/${id}`);

    if (itemId?.length === id.length) {
      window.location.reload();
    }
  };

  useEffect(() => {
    queryClient.invalidateQueries(['draftPosts']);
  }, [isSuccess, queryClient]);

  return (
    <>
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        withCloseButton={false}
        // title="Post-drafts"

        size="lg"
        padding="lg"
      >
        <div>
          <Text
            color="#373A40"
            weight={500}
            sx={{ fontSize: '17px', marginBottom: 12, marginLeft: 2 }}
          >
            Post-drafts ({data?.length})
          </Text>
          <Divider />
          {data &&
            data.map(({ title, createdAt, about, id, content }) => (
              <div key={id}>
                <Group
                  spacing={1}
                  sx={{
                    padding: '5px 0',
                    '&:hover': {
                      background: theme.colors.gray[0]
                    }
                  }}
                >
                  <span>
                    {deleteFirstClick === id ? (
                      <Button
                        sx={{ width: 60, marginLeft: -16 }}
                        compact
                        variant="subtle"
                        color="red"
                        onClick={() => mutate(id)}
                      >
                        Delete
                      </Button>
                    ) : (
                      <ActionIcon
                        onClick={() => setDeleteFirstClick(id)}
                        sx={{ marginRight: 15 }}
                      >
                        <Trash strokeWidth={1.5} size={20} />
                      </ActionIcon>
                    )}
                  </span>

                  <span
                    style={{
                      cursor: 'pointer',
                      flexGrow: 1
                    }}
                    onClick={() => navigateToPostsDraft(id, content)}
                  >
                    <Text color="black">{title}</Text>
                    <Text color="dimmed" size="xs">
                      Saved {calcTimeAgo(createdAt)}{' '}
                      <Text component="span" color="black" size="xs">
                        [ {about} ]
                      </Text>
                    </Text>
                  </span>
                </Group>
                <Divider />
              </div>
            ))}
        </div>
      </Modal>
    </>
  );
}
