import { SimpleGrid, Text, Paper, Box, NativeSelect } from "@mantine/core";
import { ChevronDown } from "tabler-icons-react";
import { Link, useNavigate } from "react-router-dom";

export default function HotTopSelect({ setHotOrTopFilter, hotOrTopFilter }) {
  return (
    <Paper shadow="xl" p="md">
      <NativeSelect
        label="Sort by"
        value={hotOrTopFilter}
        onChange={(event) => setHotOrTopFilter(event.currentTarget.value)}
        data={[
          "Default",
          "Hot: most to least",
          "Hot: least to most",
          "Top: most to least",
          "Top: least to most",
        ]}
        rightSection={<ChevronDown size={14} />}
        rightSectionWidth={40}
      />
    </Paper>
  );
}
