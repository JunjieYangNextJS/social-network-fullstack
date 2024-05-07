import { useEffect, useState } from 'react';
import { Modal, Button, Group, NumberInput } from '@mantine/core';

export default function StoryBehindModal() {
  const [opened, setOpened] = useState(false);

  useEffect(() => {
    const isStoryRead = localStorage.getItem('isStoryRead');
    setTimeout(() => {
      setOpened(!isStoryRead);
    }, [1000]);
  }, []);

  const onClose = () => {
    setOpened(false);
    localStorage.setItem('isStoryRead', 'true');
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      closeOnClickOutside={false}
      trapFocus={false}
      //   withCloseButton={false}
      centered
      size="lg"
    >
      <div style={{ padding: '0 7px' }}>
        <h2
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginTop: -35,
            fontWeight: '700'
          }}
        >
          The Story Behind "Priders.net"
        </h2>
        <p>
          &ensp; When I first came to the US at 12, my mom and I spoke very
          little English. Connecting with people felt impossible. So we went to
          a local Christian church, hoping for a friendly face. That's where I
          met Sam (not his real name). He was my first friend here, accepting me
          despite the language barrier. We had a great time until one day Sam
          stopped coming to church.
        </p>
        <p>
          &ensp; Later, I heard that he attempted suicide because his family
          couldn't accept him for being gay. He had no one to talk to, no one to
          lift him up. I lost contact with him but I still remember him till
          this day.
        </p>
        <p>
          &ensp; Priders.net was born from that experience. It's a social media
          app promoting positivity and understanding. Unlike platforms with
          isolated communities, Priders.net encourages interaction and respect
          for everyone. It's a safe space to be yourself and lift each other up.
        </p>
      </div>
    </Modal>
  );
}
