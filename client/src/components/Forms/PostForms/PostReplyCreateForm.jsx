import React, { useState, useEffect, useRef, useCallback } from 'react';
import { RichTextEditor } from '@mantine/rte';
import { Button, Modal, Group } from '@mantine/core';
import { useQueryClient } from 'react-query';
import useCreatePostReply from './../../../react-query-hooks/usePostReplies/useCreatePostReply';
import { useDidUpdate } from '@mantine/hooks';
import isRichTextEmpty from './../../../utility/isRichTextEmpty';
import { showError, showSuccess } from './../../../utility/showNotifications';
import axios from 'axios';
import backendApi from '../../../utility/backendApi';

export default function PostReplyCreateForm({
  user,
  postId,
  postCommentId,
  setOpenReply,
  refetch,
  index,
  invalidatePinned,
  invalidatePostComment,
  repliedTo,
  invalidatePostCommentPage
}) {
  const queryClient = useQueryClient();
  const [richTextReply, setRichTextReply] = useState(repliedTo || '');
  const { mutate: createPostReply, status, isLoading } = useCreatePostReply();

  const handleSubmit = () => {
    createPostReply({
      content: richTextReply,
      // post: postId,
      postComment: postCommentId
    });
  };

  const handleKeyDown = e => {
    if (e.key === 'Enter' && e.ctrlKey) {
      createPostReply({
        content: richTextReply,
        // post: postId,
        postComment: postCommentId
      });
    }
  };

  const handleCancel = () => {
    setRichTextReply('');

    setOpenReply(false);
  };

  useDidUpdate(() => {
    if (status === 'success') {
      if (invalidatePinned) queryClient.invalidateQueries(invalidatePinned);
      if (invalidatePostCommentPage)
        queryClient.invalidateQueries(invalidatePostCommentPage);
      if (refetch) refetch({ refetchPage: (page, i) => i === index });
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
          id={`postReply${postCommentId}`}
          name={`postReply${postCommentId}`}
          key={`postReply${postCommentId}`}
          value={richTextReply}
          onChange={setRichTextReply}
          onImageUpload={handleImageUpload}
          onKeyDown={e => handleKeyDown(e)}
          // controls={[
          //   ["bold", "italic", "underline", "strike", "clean"],
          //   ["unorderedList", "orderedList", "sup", "sub"],
          //   ["link", "codeBlock", "blockquote"],
          //   ["alignLeft", "alignCenter", "alignRight"],
          // ]}
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
