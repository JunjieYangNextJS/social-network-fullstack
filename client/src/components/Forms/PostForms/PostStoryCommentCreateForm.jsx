import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback
} from 'react';
import { RichTextEditor } from '@mantine/rte';
import { Button, Modal, Group } from '@mantine/core';
import useCreatePostComment from '../../../react-query-hooks/usePostComments/useCreatePostComment';
import { useDidUpdate } from '@mantine/hooks';
import isRichTextEmpty from '../../../utility/isRichTextEmpty';
import axios from 'axios';
import backendApi from './../../../utility/backendApi';
import { showError } from '../../../utility/showNotifications';

export default function PostStoryCommentCreateForm({
  user,
  // postId,
  // poster,
  postTitle,
  willNotify,
  commentFormOpen,
  setCommentFormOpen,
  creationId,
  creator,
  creationString,
  creatorString,
  useCreateComment,
  status,
  isLoading,
  mutate
}) {
  const [richText, setRichText] = useState('');

  const handleSubmit = () => {
    mutate({
      content: richText,
      [creationString]: creationId,
      [creatorString]: creator
    });
  };

  const handleKeyDown = e => {
    if (e.key === 'Enter' && e.ctrlKey) {
      mutate({
        content: richText,
        [creationString]: creationId,
        [creatorString]: creator
      });
    }
  };

  const richTextRef = useRef('');

  const handleCancel = () => {
    setRichText('');
    richTextRef.current.value = '';
    setCommentFormOpen(false);
  };

  useEffect(() => {
    if (commentFormOpen) richTextRef.current.focus();
  }, [commentFormOpen]);

  useDidUpdate(() => {
    if (status === 'loading') {
      setRichText('');
      richTextRef.current.value = '';
      setCommentFormOpen(false);
    }
  }, [status]);

  const handleImageUpload = useCallback(async file => {
    const formData = new FormData();
    formData.append('image', file);

    const url = await axios
      .post(`${backendApi}users/commentImageUpload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          ACL: 'public-read'
        },
        withCredentials: true
      })
      .catch(err => {
        if (err.response.status === 401) {
          showError('You cannot upload more than 50 images a day');
        } else {
          showError("Uploading image wasn't successful");
        }
      })
      .then(res => res.data.data);

    return url;
  }, []);

  return (
    <>
      {/* <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title="Introduce yourself!"
      > */}
      <div style={{ marginTop: 40 }}>
        <RichTextEditor
          placeholder="Comment here..."
          mt="md"
          id="createCommentContent"
          key="createCommentContent"
          ref={richTextRef}
          value={richText}
          onChange={setRichText}
          onImageUpload={handleImageUpload}
          onKeyDown={e => handleKeyDown(e)}
          sx={{ fontSize: 15 }}
        />
        <Group position="right" sx={{ paddingTop: 5 }} spacing={8}>
          <Button
            variant="subtle"
            color="gray"
            // className={classes.control}
            onClick={() => handleCancel()}
          >
            Cancel
          </Button>
          <Button
            variant="subtle"
            color="gray"
            // className={classes.control}
            onClick={() => handleSubmit()}
            disabled={isRichTextEmpty(richText) || isLoading}
          >
            Comment
          </Button>
        </Group>
      </div>
      {/* </Modal>

      <Group position="center">
        <Button onClick={() => setOpened(true)}>Open Modal</Button>
      </Group> */}
    </>
  );
}
