import { SimpleGrid, Text, Paper, Box } from "@mantine/core";
import { Link, useNavigate } from "react-router-dom";

export default function RoutelessAboutGrids({ setAboutFilter, aboutFilter }) {
  const aboutArray = [
    { label: "Lesbian", about: "L" },
    { label: "Intersex", about: "I" },
    { label: "Gay", about: "G" },
    { label: "Asexual", about: "A" },
    { label: "Bisexual", about: "B" },
    { label: "Two-Spirit", about: "2S" },
    { label: "Transgender", about: "T" },
    { label: "Others", about: "Others" },
    { label: "Queer/Questioning", about: "Q" },
    { label: "General", about: "General" },
  ];

  const handleAboutFilter = (about) => {
    if (about === "General") return setAboutFilter([]);

    if (aboutFilter.includes(about)) {
      setAboutFilter((prev) => prev.filter((el) => el !== about));
    } else {
      setAboutFilter((prev) => [...prev, about]);
    }
  };

  return (
    <Paper shadow="xl" p="md">
      <SimpleGrid cols={2}>
        {aboutArray.map(({ label, about }) => (
          <Box
            onClick={() => handleAboutFilter(about)}
            sx={(theme) => [
              {
                cursor: "pointer",
                fontWeight: "400",
                color: theme.colors.dark[8],
                fontSize: 15,
                "&:hover": {
                  fontWeight: "500",
                  color: theme.colors.dark[4],
                },
              },
              aboutFilter.length !== 0 && {
                color: aboutFilter.includes(about)
                  ? theme.colors.dark[4]
                  : theme.colors.dark[1],
                fontWeight: aboutFilter.includes(about) ? "500" : "default",
              },
            ]}
            key={label}
          >
            {label}
          </Box>
        ))}
      </SimpleGrid>
    </Paper>
  );
}
