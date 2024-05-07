import { SimpleGrid, Text, Paper, Box, NativeSelect } from "@mantine/core";
import { ChevronDown } from "tabler-icons-react";

export default function CreatedAtSelect({
  setNewOrOldFilter,
  newOrOldFilter,
  items,
}) {
  //   const timeArray = ["From newest", "From oldest"];

  return (
    <Paper shadow="xl" p="md">
      <NativeSelect
        label={`${items} from`}
        value={newOrOldFilter}
        onChange={(event) => setNewOrOldFilter(event.currentTarget.value)}
        data={[
          "Newest",
          "Oldest",
          "Last Year",
          "Last Month",
          "Last Week",
          "Last Day",
        ]}
        rightSection={<ChevronDown size={14} />}
        rightSectionWidth={40}
      />
      {/* <SimpleGrid cols={2}>
        {timeArray.map((el) => (
          <Box
            onClick={() => setNewOrOldFilter(el)}
            sx={(theme) => [
              {
                cursor: "pointer",
                color:
                  newOrOldFilter === el
                    ? theme.colors.dark[4]
                    : theme.colors.dark[1],
                fontWeight: newOrOldFilter === el ? "500" : "default",
                fontSize: 15,
                "&:hover": {
                  fontWeight: "500",
                  color: theme.colors.dark[4],
                },
              },
            ]}
            key={el}
          >
            {el}
          </Box>
        ))}
      </SimpleGrid> */}
    </Paper>
  );
}
