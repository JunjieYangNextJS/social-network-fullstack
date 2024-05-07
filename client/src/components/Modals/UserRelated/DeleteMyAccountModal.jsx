import React, { useState } from 'react';
import { Modal, Button, Group, Container, Text } from '@mantine/core';
import { useDidUpdate } from '@mantine/hooks';
import { usePatchUserFriendList } from '../../../react-query-hooks/useUser/usePatchUser';
import { useDeleteMyAccount } from '../../../react-query-hooks/useUser/useAuth';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from 'react-query';
import backendApi from '../../../utility/backendApi';
import axios from 'axios';

export default function DeleteMyAccountModal({ opened, setOpened, password }) {
  const [disable, setDisable] = useState(false);
  const { mutate, isLoading, isSuccess, isError } = useDeleteMyAccount();

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const res = await axios.get(`${backendApi}users/logout`, {
        withCredentials: true
      });
      if ((res.data.status = 'success')) {
        queryClient.removeQueries(['user', { exact: true }]);

        navigate('/', { push: true });
        window.location.reload();
      }
    } catch (err) {
      alert('logout was unsuccessful');
    }
  };

  useDidUpdate(() => {
    if (isLoading) {
      setDisable(true);
    }
    if (isSuccess) {
      handleLogout();
    }
    if (isError) {
      setDisable(false);
    }
  }, [isLoading, isSuccess, isError]);

  const handleDeleteAccount = () => {
    if (!disable)
      mutate({
        password
      });
  };

  return (
    <Modal
      size="sm"
      opened={opened}
      onClose={() => setOpened(false)}
      withCloseButton={false}
      centered
      padding="xl"
    >
      <div style={{ padding: '10px 10px 0 10px' }}>
        <Text color="#373A40" size="lg" weight={700}>
          Delete your account?
        </Text>
        <Text sx={{ fontSize: 15, marginTop: 20, marginBottom: 20 }}>
          Nobody will have access to your account or view your personal page. If
          you regret this decision. please contact us for assistance.
        </Text>
        <Group position="right">
          <Button
            size="sm"
            variant="subtle"
            onClick={() => handleDeleteAccount()}
            disabled={isLoading}
          >
            Delete
          </Button>
          <Button size="sm" variant="subtle" onClick={() => setOpened(false)}>
            Cancel
          </Button>
        </Group>
      </div>
    </Modal>
  );
}
