import React, { useState, useEffect, useRef, useCallback } from 'react';
import { RichTextEditor } from '@mantine/rte';
import { Button, Modal, Group } from '@mantine/core';
import { useQueryClient } from 'react-query';
import useCreateStoryReply from './../../../react-query-hooks/useStoryReplies/useCreateStoryReply';
import { useDidUpdate } from '@mantine/hooks';
import isRichTextEmpty from './../../../utility/isRichTextEmpty';
import { showError, showSuccess } from './../../../utility/showNotifications';
import backendApi from './../../../utility/backendApi';
import axios from 'axios';

export default function StoryReplyCreateForm({
  user,
  storyId,
  storyCommentId,
  setOpenReply,
  refetch,
  index,
  invalidatePinned,
  invalidateStoryComment,
  invalidateStoryCommentPage,
  repliedTo
}) {
  const queryClient = useQueryClient();
  const [richTextReply, setRichTextReply] = useState(repliedTo || '');
  const { mutate: createStoryReply, status, isLoading } = useCreateStoryReply();

  const handleSubmit = () => {
    createStoryReply({
      content: richTextReply,
      // post: postId,
      storyComment: storyCommentId
    });
  };

  const handleKeyDown = e => {
    if (e.key === 'Enter' && e.ctrlKey) {
      createStoryReply({
        content: richTextReply,
        // post: postId,
        storyComment: storyCommentId
      });
    }
  };

  const handleCancel = () => {
    setRichTextReply('');

    setOpenReply(false);
  };

  useDidUpdate(() => {
    if (status === 'success') {
      // if (invalidatePinned) queryClient.invalidateQueries(invalidatePinned);
      // if (refetch) refetch({ refetchPage: (page, i) => i === index });
      queryClient.invalidateQueries(['story', storyId, 'comments']);
      if (invalidateStoryCommentPage)
        queryClient.invalidateQueries(invalidateStoryCommentPage);
      setRichTextReply('');
      showSuccess('Your reply was successfully created');
      setOpenReply(false);
    }
  }, [status]);

  const handleImageUpload = useCallback(async file => {
    const formData = new FormData();
    formData.append('image', file);

    const url = await axios
      .post(`${backendApi}users/replyImageUpload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          ACL: 'public-read'
        },
        withCredentials: true
      })
      .catch(err => {
        if (err.response.status === 900) {
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
      <div>
        <RichTextEditor
          placeholder="Reply here"
          mt="md"
          id={`storyReply${storyCommentId}`}
          name={`storyReply${storyCommentId}`}
          key={`storyReply${storyCommentId}`}
          value={richTextReply}
          onChange={setRichTextReply}
          onImageUpload={handleImageUpload}
          onKeyDown={e => handleKeyDown(e)}
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
            disabled={isRichTextEmpty(richTextReply) || isLoading}
          >
            Reply
          </Button>
        </Group>
      </div>
    </>
  );
}
