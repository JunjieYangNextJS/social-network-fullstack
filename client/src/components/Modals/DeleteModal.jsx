import React, { useState } from 'react';
import { Modal, Button, Group, Text } from '@mantine/core';
import { useQueryClient } from 'react-query';
import { useDidUpdate } from '@mantine/hooks';
import { useNavigate } from 'react-router-dom';

function DeleteModal({
  itemId,
  opened,
  setOpened,
  oldPagesArray,
  itemEndpoint,
  handleDeleteItem,
  deleteStatus,
  navigateToOrigin,
  setDataName,
  setRteText,
  understated
}) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  useDidUpdate(() => {
    if (deleteStatus === 'loading' && oldPagesArray) {
      setOpened(false);

      const newPagesArray = oldPagesArray?.pages.map(page => {
        return {
          ...page,
          data: {
            ...page.data,
            results: page.data.results - 1,
            data: {
              ...page.data.data,
              data: [...page.data.data.data.filter(val => val.id !== itemId)]
            }
          }
        };
      });

      queryClient.setQueryData(setDataName || itemEndpoint, data => ({
        pages: newPagesArray,
        pageParams: data?.pageParams
      }));

      return;
    }
    if (deleteStatus === 'loading' && navigateToOrigin) {
      setOpened(false);
      navigate(-1);

      return;
    }
    if (deleteStatus === 'loading') {
      setOpened(false);
    }

    if (deleteStatus === 'success') {
      if (understated) {
        queryClient.invalidateQueries(setDataName);
      }

      if (setRteText)
        setRteText.current?.editor?.setText(
          '[ This content has been deleted. ]'
        );
    }
  }, [deleteStatus]);

  const stopPropagationAndPreventDefault = e => {
    e.stopPropagation();
    e.preventDefault();
  };

  return (
    <>
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        onClick={e => stopPropagationAndPreventDefault(e)}
        withCloseButton={false}
        centered
        size="sm"
        padding="xl"
      >
        <div style={{ padding: '10px 10px 0 10px' }}>
          <Text color="#373A40" size="lg" weight={700}>
            Delete this?
          </Text>
          <Text sx={{ fontSize: 15, marginTop: 20, marginBottom: 20 }}>
            This will be deleted permanently.
          </Text>
          <Group position="right">
            <Button
              size="sm"
              variant="subtle"
              onClick={() => handleDeleteItem(itemId)}
            >
              Delete
            </Button>
            <Button size="sm" variant="subtle" onClick={() => setOpened(false)}>
              Cancel
            </Button>
          </Group>
        </div>
      </Modal>
    </>
  );
}

export default DeleteModal;
