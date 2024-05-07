import React, { useState } from "react";
import { Text, Pagination, Group, NumberInput, Button } from "@mantine/core";

export default function PaginationForComments({
  activePage,
  setActivePage,
  total,
}) {
  const [inputPage, setInputPage] = useState(null);

  const headToPage = () => {
    if (!Number.isInteger(inputPage)) return;
    if (inputPage > total) {
      setActivePage(total);
    } else if (inputPage < 1) {
      setActivePage(1);
    } else {
      setActivePage(inputPage);
    }
  };

  return (
    <Group sx={{ marginBottom: 10 }}>
      <Pagination
        color="gray"
        page={activePage}
        onChange={setActivePage}
        total={total}
        withControls={false}
        size="sm"
      />

      {/* <NumberInput
        size="xs"
        sx={{ width: 40, height: 30 }}
        hideControls
        onChange={(val) => setInputPage(val)}
      /> */}
    </Group>
  );
}
