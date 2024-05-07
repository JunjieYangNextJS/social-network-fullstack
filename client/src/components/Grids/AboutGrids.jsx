import { SimpleGrid, Text, Paper, Box } from "@mantine/core";
import { Link, useNavigate } from "react-router-dom";

export default function AboutGrids({ route }) {
  const aboutArray = [
    { label: "Lesbian", to: "L" },
    { label: "Intersex", to: "I" },
    { label: "Gay", to: "G" },
    { label: "Asexual", to: "A" },
    { label: "Bisexual", to: "B" },
    { label: "Two-Spirit", to: "2S" },
    { label: "Transgender", to: "T" },
    { label: "+More", to: "+More" },
    { label: "Queer/Questioning", to: "Q" },
  ];

  const urlParts = window.location.href.split("/");

  const last = urlParts[urlParts.length - 1];

  let option;

  switch (last) {
    case "L":
      option = "L";
      break;
    case "G":
      option = "G";
      break;
    case "B":
      option = "B";
      break;
    case "T":
      option = "T";
      break;
    case "Q":
      option = "Q";
      break;
    case "I":
      option = "I";
      break;
    case "A":
      option = "A";
      break;
    case "2S":
      option = "2S";
      break;
    case "+More":
      option = "+More";
      break;
    default:
      option = null;
  }

  const navigate = useNavigate();

  const handleNavigate = (to) => {
    if (last === to) {
      navigate("/posts");
    } else {
      navigate(`/${route}/${to}`);
    }
  };

  return (
    <Paper shadow="xl" p="md">
      <SimpleGrid cols={2}>
        {aboutArray.map(({ label, to }) => (
          <Box
            onClick={() => handleNavigate(to)}
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
              option && {
                color:
                  last === to ? theme.colors.dark[4] : theme.colors.dark[1],
                fontWeight: last === to ? "500" : "default",
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
