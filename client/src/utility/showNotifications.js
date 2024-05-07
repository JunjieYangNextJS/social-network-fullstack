import { showNotification } from '@mantine/notifications';
import { Check, X } from 'tabler-icons-react';

export const showSuccess = message => {
  showNotification({
    title: 'Great',
    message,
    color: 'teal',
    icon: <Check />,
    autoClose: 5000
  });
};

export const showError = message => {
  showNotification({
    title: 'Oops',
    message,
    color: 'red',
    icon: <X />,
    autoClose: 5000
  });
};

export const showLoading = message => {
  showNotification({
    loading: true,
    title: 'Loading',
    disallowClose: true,
    message
  });
};

export const showTitleless = message => {
  showNotification({
    // loading: true,
    title: 'Cool',
    disallowClose: true,
    message
  });
};

export const showChangesAreUpdated = () => {
  showNotification({
    title: 'Great',
    message: 'Changes are updated.',
    color: 'teal',
    icon: <Check />,
    autoClose: 5000
  });
};

export const showChangesAreMemorized = () => {
  showNotification({
    // loading: true,
    title: 'Cool',
    // disallowClose: true,
    message: 'Changes are memorized until you refresh, but not updated'
  });
};
