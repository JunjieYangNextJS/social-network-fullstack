import React, { useEffect, useRef, Fragment } from 'react';
import { Container, Button, Box } from '@mantine/core';
import { Link } from 'react-router-dom';

import useUser from './../../react-query-hooks/useUser/useUser';
import backgroundImage from './../../images/hollow-tree.jpeg';
import { useInfiniteQuery } from 'react-query';
import backendApi from '../../utility/backendApi';
import axios from 'axios';
import useIntersectionObserver from './../../Hooks/useIntersectionObserverHook';
import SecretCard from '../../components/Cards/SecretCard';
import SecretsRightStack from './Secret/SecretsRightStack';

const Secrets = () => {
  // const [secrets, setPosts] = useState(null);

  const { data: user } = useUser();

  const limit = 20;

  const fetchSecrets = ({ pageParam = 0 }) => {
    return axios.get(`${backendApi}secrets?limit=${limit}&page=${pageParam}`, {
      withCredentials: true
    });
  };

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,

    isFetching,
    refetch
  } = useInfiniteQuery(['secrets'], fetchSecrets, {
    getNextPageParam: (lastPage, pages) => {
      if (pages.length < lastPage.data.totalDocsInDB / limit) {
        return pages.length + 1;
      } else {
        return undefined;
      }
    }
  });

  useEffect(() => {
    refetch();
  }, [refetch]);

  const loadMoreRef = useRef();

  useIntersectionObserver({
    target: loadMoreRef,
    onIntersect: fetchNextPage,
    enabled: hasNextPage
  });

  return (
    <Box
      sx={theme => ({
        backgroundSize: 'cover',
        backgroundAttachment: 'fixed',
        backgroundImage: `url(${backgroundImage})`,
        minHeight: '100vh',
        paddingTop: 120,
        position: 'relative'
      })}
    >
      <Container>
        <Button
          component={Link}
          to={user ? `/tree-hollow/create` : '/login'}
          sx={{
            marginBottom: 10,
            '@media (min-width: 800px)': {
              display: 'none'
            }
          }}
        >
          Create voice
        </Button>
        <div style={{ display: 'flex', flexDirection: 'row', gap: '70px' }}>
          <div>
            {data && data?.pages[0].data.data.length !== 0 ? (
              data.pages.map((group, index) => {
                return (
                  <Fragment key={index}>
                    {group?.data.data?.map(secret => {
                      return <SecretCard key={secret._id} secret={secret} />;
                    })}
                  </Fragment>
                );
              })
            ) : (
              <div style={{ width: 600, height: 100 }} />
            )}
            <div
              ref={loadMoreRef}
              sx={{ visibility: !hasNextPage ? 'hidden' : 'default' }}
            >
              {isFetchingNextPage ? 'Loading more...' : ''}
            </div>
          </div>
          <SecretsRightStack user={user} />
        </div>
      </Container>
    </Box>
  );
};

export default Secrets;

// import React, { useState, useEffect, useRef, Fragment } from "react";
// import {
//   Container,
//   Button,
//   Box,
//   createStyles,
//   Pagination,
// } from "@mantine/core";
// import { useNavigate, Link } from "react-router-dom";
// import treeHollow from "./../../images/treeHollow.png";
// import useUser from "./../../react-query-hooks/useUser/useUser";

// import { useQuery } from "react-query";
// import backendApi from "../../utility/backendApi";
// import axios from "axios";
// import useIntersectionObserver from "./../../Hooks/useIntersectionObserverHook";
// import SecretCard from "../../components/Cards/SecretCard";

// const useStyles = createStyles((theme) => ({
//   wrapper: {
//     minHeight: "100vh",
//     width: "100%",
//     backgroundSize: "cover",
//     backgroundImage: `url(https://images.unsplash.com/photo-1573834633983-c21ad1ea2ab8?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80)`,
//     // backgroundImage: `url(${treeHollow})`,
//     // paddingTop: 120,
//   },

//   container: {
//     paddingTop: 120,
//   },

//   form: {
//     borderRight: `1px solid ${
//       theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.colors.gray[3]
//     }`,
//     minHeight: 900,
//     maxWidth: 450,
//     padding: "100px 30px 0 30px",

//     [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
//       maxWidth: "100%",
//     },
//   },
// }));

// const Secrets = () => {
//   // const [Secrets, setSecrets] = useState(null);
//   const { data: user } = useUser();
//   const limit = 6;
//   const { classes } = useStyles();

//   const [page, setPage] = React.useState(0);

//   const getSecrets = (page = 0) =>
//     axios
//       .get(`${backendApi}secrets?page=${page}&limit=${limit}`, {
//         withCredentials: true,
//       })
//       .then((res) => res.data);

//   const { isLoading, isError, error, data, isFetching, isPreviousData } =
//     useQuery(["secrets", page], () => getSecrets(page), {
//       keepPreviousData: true,
//     });

//   return (
//     <Box
//       sx={(theme) => ({
//         // backgroundColor: theme.colors.green[3],
//         height: "120vh",
//         paddingTop: 120,
//       })}
//     >
//       <Container
//       // className={classes.container}
//       >
//         <Button component={Link} to={user ? "/tree-hollow/create" : "/login"}>
//           Create Secret
//         </Button>
//         {data && data.data.map((el) => <SecretCard secret={el} key={el.id} />)}
//         <Pagination
//           page={page}
//           onChange={setPage}
//           total={Math.ceil(data?.totalDocsInDB / limit)}
//         />
//       </Container>
//     </Box>
//   );
// };

// export default Secrets;
