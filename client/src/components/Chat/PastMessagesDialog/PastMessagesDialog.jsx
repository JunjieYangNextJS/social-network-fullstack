import React, { useState, useEffect, useRef } from "react";
import {
  Button,
  Center,
  Container,
  Dialog,
  Group,
  ScrollArea,
  Text,
} from "@mantine/core";
import axios from "axios";
import backendApi from "../../../utility/backendApi";
import { useDidUpdate } from "@mantine/hooks";
import { useQuery, useQueryClient } from "react-query";
import Message from "./../ChatRoom/Message";
import PaginationForComments from "./../../../pages/Stories/Story/StoryComments/PaginationForComments";

export default function PastMessagesDialog({
  opened,
  setOpened,
  user,
  chatRoomObjId,
  chatRoomUsers,
}) {
  const queryClient = useQueryClient();

  const limit = 20;

  const fetchChatMessages = (page = 1) => {
    return axios
      .get(
        `${backendApi}chatMessages/previous/${chatRoomObjId}?&limit=${limit}&page=` +
          (page + 0.5),
        {
          withCredentials: true,
        }
      )
      .then((res) => res.data);
  };

  const [page, setPage] = useState(
    sessionStorage.getItem(`${chatRoomObjId}-chatMessages-page`) * 1 || 1
  );

  useDidUpdate(() => {
    sessionStorage.setItem(`${chatRoomObjId}-chatMessages-page`, page);
    // window.location.reload();
  }, [page]);

  const { status, data, error, isFetching, isPreviousData } = useQuery(
    [`${chatRoomObjId}-chatMessages-page`, { page }],
    () => fetchChatMessages(page),
    { keepPreviousData: true, staleTime: 1000, enabled: opened }
  );

  const total = Math.ceil(data?.totalDocsInDB / limit) - 1;

  //   // Prefetch the next page!
  //   useEffect(() => {
  //     if (data?.totalDocsInDB > (page + 1) * limit) {
  //       queryClient.prefetchQuery(
  //         [`${chatRoomObjId}-chatMessages-page`, { page: page + 1 }],
  //         () => fetchChatMessages(page + 1)
  //       );
  //     }
  //   }, [data, page, queryClient]);

  const prevMessagesEndRef = useRef();

  // const scrollToBottom = () => {
  //   prevMessagesEndRef?.current?.scrollIntoView({
  //     behavior: "smooth",
  //   });

  // };

  useEffect(() => {
    // if (cancelScroll === 2) return;
    prevMessagesEndRef?.current?.scrollIntoView();
    // setCancelScroll((prev) => prev + 1);
  }, [data?.data]);

  return (
    <Dialog
      opened={opened}
      withCloseButton
      onClose={() => setOpened(false)}
      size="lg"
      radius="md"
      position={{ bottom: 50, right: 500 }}
    >
      <Text size="sm" style={{ marginBottom: 10 }} weight={500}>
        Past messages
      </Text>

      <div>
        <ScrollArea
          style={{ height: "600px", marginBottom: 10 }}
          type="never"
          // onScrollPositionChange={() => setScrollPosition()}
        >
          {data &&
            data.data.map((message) => {
              const { content, createdAt, edited, id, sender } = message;
              return (
                <Message
                  key={id}
                  content={content}
                  createdAt={createdAt}
                  edited={edited}
                  sender={sender}
                  chatRoomUsers={chatRoomUsers}
                  user={user}
                />
              );
            })}
          <div ref={prevMessagesEndRef} />
        </ScrollArea>
        {total > 1 && (
          <PaginationForComments
            activePage={page}
            setActivePage={setPage}
            total={total}
          />
        )}
      </div>
    </Dialog>
  );
}
