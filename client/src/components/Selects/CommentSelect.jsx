import { useState } from "react";
import { Select } from "@mantine/core";

export default function CommentSelect({ setSortByValue, sortByValue }) {
  return (
    <Select
      sx={{ width: 80, height: 10 }}
      value={sortByValue}
      onChange={setSortByValue}
      data={[
        { value: "-createdAt", label: "New" },
        { value: "-likesCount", label: "Top" },
        { value: "-replyCount", label: "Hot" },
        { value: "createdAt", label: "Old" },
      ]}
      // label={`sort by: `}
    />
  );
}
