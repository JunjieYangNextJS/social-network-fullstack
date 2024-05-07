import react, { useState, useEffect } from 'react';
import { Menu, Divider, Text, Box } from '@mantine/core';
import {
  Settings,
  Search,
  Photo,
  MessageCircle,
  Trash,
  Pencil,
  BellOff,
  BellRinging,
  ArrowsLeftRight,
  Eye,
  EyeOff
} from 'tabler-icons-react';
import { useClipboard, useDisclosure, useDidUpdate } from '@mantine/hooks';
import { useNavigate } from 'react-router-dom';
import findGenre from './../../utility/findGenre';
import { usePatchArrayMethod } from './../../react-query-hooks/useUser/usePatchUser';
import ReportModal from './../Modals/ReportModal';

import DeleteModal from '../Modals/DeleteModal';
import usePatchCreation from '../../react-query-hooks/usePatchCreaton';
import { showSuccess } from './../../utility/showNotifications';

export default function SecretActionMenu({
  secret,
  userId,
  setReadOnly,
  entered,
  hiddenSecrets
}) {
  const { secretTeller, id, willNotify, hidden } = secret;

  const [opened, handlers] = useDisclosure(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const navigate = useNavigate();
  const clipboard = useClipboard({ timeout: 600 });

  const [isNotifying, setIsNotifying] = useState(true);

  const { mutate: patchCreationWillNotify } = usePatchCreation(
    'secrets/patchWillNotify',
    id
  );

  const {
    mutate: addSecretHide,
    isSuccess: isHideSuccess
  } = usePatchArrayMethod('addHiddenSecret');
  const { mutate: removeSecretHide } = usePatchArrayMethod(
    'removeHiddenSecret'
  );

  useEffect(() => {
    setIsNotifying(willNotify);
  }, [willNotify]);

  useDidUpdate(() => {
    if (isHideSuccess) {
      navigate('/tree-hollow');
      showSuccess('This voice has been hidden');
    }
  }, [isHideSuccess]);

  const handleChangeWillNotify = () => {
    patchCreationWillNotify({ willNotify: !isNotifying });
    setIsNotifying(!isNotifying);

    handlers.close();
  };

  const handleClipboard = () => {
    clipboard.copy(window.location.href);
    setTimeout(() => {
      handlers.close();
    }, 500);
  };

  //   const handleHide = () => {
  //     if (!userId) return navigate("/login");
  //     patchUserPostHide(itemId);
  //     handlers.close();
  //   };

  const handleReport = () => {
    if (!userId) return navigate('/login');
    setReportOpen(true);
    handlers.close();
  };

  const handleDelete = () => {
    setDeleteOpen(true);

    handlers.close();
  };

  const handleEdit = () => {
    setReadOnly(false);

    handlers.close();
  };

  const handleHide = () => {
    if (!userId) return navigate('/login');

    if (hiddenSecrets?.includes(id)) {
      removeSecretHide(id);
    } else {
      addSecretHide(id);
    }

    handlers.close();
  };

  const stopPropagationAndPreventDefault = e => {
    e.stopPropagation();
    e.preventDefault();
  };

  return (
    <Box sx={{ opacity: entered ? 1 : 0, transition: '0.15s' }}>
      <Menu
        onClick={e => stopPropagationAndPreventDefault(e)}
        opened={opened}
        onOpen={handlers.open}
        onClose={handlers.close}
        closeOnItemClick={false}
      >
        <Menu.Item icon={<Photo size={14} />} onClick={() => handleClipboard()}>
          {clipboard.copied ? 'Copied' : 'Copy link'}
        </Menu.Item>

        {/* <Menu.Item icon={<Settings size={14} />} onClick={() => handleHide()}>
          Hide
        </Menu.Item> */}
        <Menu.Item
          icon={<MessageCircle size={14} />}
          onClick={() => handleReport()}
        >
          Report
        </Menu.Item>
        <Menu.Item
          icon={
            hiddenSecrets?.includes(id) ? (
              <Eye size={14} />
            ) : (
              <EyeOff size={14} />
            )
          }
          onClick={() => handleHide()}
        >
          {hiddenSecrets?.includes(id) ? 'Show' : 'Hide'}
        </Menu.Item>

        {secretTeller === userId && (
          <>
            <Divider />
            <Menu.Item
              onClick={() => handleChangeWillNotify()}
              // color="red"
              icon={
                isNotifying ? <BellOff size={14} /> : <BellRinging size={14} />
              }
            >
              {isNotifying ? 'Turn off notifications' : 'Turn on notifications'}
            </Menu.Item>
            <Menu.Item
              onClick={() => handleEdit()}
              // color="red"
              icon={<Pencil size={14} />}
            >
              Edit my secret
            </Menu.Item>

            <Menu.Item
              onClick={() => handleDelete()}
              color="red"
              icon={<Trash size={14} />}
            >
              Delete my secret
            </Menu.Item>
          </>
        )}
      </Menu>
      <ReportModal
        setOpened={setReportOpen}
        opened={reportOpen}
        itemId={id}
        userId={userId}
        itemEndpoint={'secrets'}
      />
      {/* <DeleteModal
        setOpened={setDeleteOpen}
        opened={deleteOpen}
        itemId={id}
       
        itemEndpoint={'secrets'}
        handleDeleteItem={handleDeleteItem}
        deleteStatus={deleteStatus}
        navigateToOrigin={navigateToOrigin}
      /> */}
    </Box>
  );
}
