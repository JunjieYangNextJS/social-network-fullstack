import react, { useState, useEffect } from 'react';
import {
  Menu,
  Divider,
  Text,
  Modal,
  Button,
  Box,
  Alert,
  Group
} from '@mantine/core';
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
  EyeOff,
  Eye
} from 'tabler-icons-react';
import {
  useClipboard,
  useDisclosure,
  useDidUpdate,
  useClickOutside
} from '@mantine/hooks';
import { useNavigate } from 'react-router-dom';
import { AlertCircle } from 'tabler-icons-react';
import ReportModal from '../../../../components/Modals/ReportModal';
import DeleteModal from '../../../../components/Modals/DeleteModal';
import useDeleteSecretComment from '../../../../react-query-hooks/useSecrets/useSecretComments/useDeleteSecretComment';
import usePatchCreation from './../../../../react-query-hooks/usePatchCreaton';
import { usePatchSecretCommentHiddenBy } from './../../../../react-query-hooks/useSecrets/useSecretComments/useModifySecretReply';
import { usePatchArrayMethod } from '../../../../react-query-hooks/useUser/usePatchUser';
import es from 'date-fns/esm/locale/es/index.js';

export default function SecretReplyActionMenu({
  userId,
  reply,
  setReadOnly,
  entered,
  commentInfo,
  index
}) {
  const { _id, hiddenBy, willNotify, secretTeller, secret } = commentInfo;

  const [opened, handlers] = useDisclosure(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const navigate = useNavigate();

  const [isNotifying, setIsNotifying] = useState(true);
  const [isHiddenBy, setIsHiddenBy] = useState('');

  const { mutate: patchCreationWillNotify } = usePatchCreation(
    'secretComments/patchWillNotify',
    _id
  );
  const { mutate: patchCreationHiddenBy } = usePatchSecretCommentHiddenBy(
    _id,
    secret
  );

  useEffect(() => {
    setIsHiddenBy(hiddenBy);
    setIsNotifying(willNotify);
  }, [willNotify, hiddenBy]);

  const { mutate: deleteSecretReply } = useDeleteSecretComment();

  const handleReport = () => {
    if (!userId) return navigate('/login');
    setReportOpen(true);
    handlers.close();
  };

  const handleDelete = () => {
    setDeleteOpen(true);

    handlers.close();
  };

  const handleDeleteReply = () => {
    deleteSecretReply({
      secretReplyId: reply._id,
      secretCommentId: _id
    });
    setDeleteOpen(false);
  };

  const handleEdit = () => {
    setReadOnly(false);

    handlers.close();
  };

  const handleChangeWillNotify = () => {
    patchCreationWillNotify({ willNotify: !isNotifying });
    setIsNotifying(!isNotifying);

    handlers.close();
  };

  const handleChangeHiddenBy = () => {
    patchCreationHiddenBy({ hiddenBy: isHiddenBy ? '' : userId });
    setIsHiddenBy(isHiddenBy ? '' : userId);

    handlers.close();
  };

  const stopPropagationAndPreventDefault = e => {
    e.stopPropagation();
    e.preventDefault();
  };

  return (
    <Box
      sx={{
        opacity: entered ? 1 : 0,
        transition: '0.15s',
        visibility:
          secretTeller !== userId && reply.replier !== userId && 'hidden'
      }}
    >
      <Menu
        onClick={e => stopPropagationAndPreventDefault(e)}
        opened={opened}
        onOpen={handlers.open}
        onClose={handlers.close}
        closeOnItemClick={false}
      >
        {/* <Menu.Item icon={<Settings size={14} />} onClick={() => handleHide()}>
            Hide
          </Menu.Item> */}
        {/* <Menu.Item
          icon={<MessageCircle size={14} />}
          onClick={() => handleReport()}
        >
          Report
        </Menu.Item> */}
        {secretTeller === userId && (
          <>
            <Menu.Item
              icon={<MessageCircle size={14} />}
              onClick={() => handleReport()}
            >
              Report
            </Menu.Item>

            {index && (
              <Menu.Item
                onClick={() => handleChangeHiddenBy()}
                color="red"
                icon={<Trash size={14} />}
              >
                Delete and block
              </Menu.Item>
            )}
          </>
        )}
        {reply.replier === userId && (
          <>
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
              Edit my reply
            </Menu.Item>

            <Menu.Item
              onClick={() => handleDelete()}
              color="red"
              icon={<Trash size={14} />}
            >
              Delete my reply
            </Menu.Item>
          </>
        )}
      </Menu>
      <Modal
        centered
        withCloseButton={false}
        opened={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        padding={0}
      >
        <Alert
          sx={{ padding: '20px 15px 10px 15px' }}
          title="Be careful!"
          icon={<AlertCircle size={16} />}
          color="red"
        >
          Deleting this first message would also delete the entire conversation.
          <Group position="right">
            <Button
              size="sm"
              variant="subtle"
              color="gray"
              onClick={() => setDeleteOpen(false)}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              variant="subtle"
              color="gray"
              onClick={() => handleDeleteReply()}
            >
              Delete
            </Button>
          </Group>
        </Alert>
      </Modal>
    </Box>
  );
}
