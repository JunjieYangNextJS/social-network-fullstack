import React, { useState } from 'react';
import MainHeader from './../components/Navbars/MainHeader';
import Chat from './../components/Chat';
import useUser from './../react-query-hooks/useUser/useUser';
import { AspectRatio, Image, Transition } from '@mantine/core';
import unicorn from './../images/unicorn.png';

const LayoutNav = ({ children }) => {
  const { data: user } = useUser();

  const [unicornClicked, setUnicornClicked] = useState(false);

  const toggleUnicorn = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setUnicornClicked(!unicornClicked);
  };

  return (
    <>
      <section>
        <MainHeader user={user} />
        {children}
        {user && <Chat user={user} />}

        <div
          style={{
            width: 100,
            marginLeft: 'auto',
            marginRight: 'auto',
            position: 'fixed',
            bottom: 30,
            left: 30,
            cursor: 'pointer'
          }}
        >
          {/* <a href="https://www.buymeacoffee.com/priders.net" target="_blank">
            <img
              src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png"
              alt="Buy Me A Coffee"
              style="height: 60px !important;width: 217px !important;"
            >
          </a> */}
          {unicornClicked && (
            <a
              href="https://www.buymeacoffee.com/priders.net"
              rel="noreferrer"
              target="_blank"
            >
              <Image
                src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png"
                alt="Buy Me A Coffee"
                sx={{ width: 160, height: 40 }}
              />
            </a>
          )}

          <Image src={unicorn} radius="md" onClick={() => toggleUnicorn()} />
        </div>
      </section>
    </>
  );
};

export default LayoutNav;
