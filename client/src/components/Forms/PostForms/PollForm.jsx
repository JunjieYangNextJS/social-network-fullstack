import React, { useState } from "react";
import {
  ActionIcon,
  Button,
  Group,
  List,
  NumberInput,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { Trash } from "tabler-icons-react";

export default function PollForm({
  hasPoll,
  setHasPoll,
  days,
  setDays,
  optionOne,
  setOptionOne,
  optionTwo,
  setOptionTwo,
  optionThree,
  setOptionThree,
  optionFour,
  setOptionFour,
  optionFive,
  setOptionFive,
  optionSix,
  setOptionSix,
  optionSeven,
  setOptionSeven,
  optionEight,
  setOptionEight,
  optionNine,
  setOptionNine,
  optionTen,
  setOptionTen,
}) {
  const [addOnOptions, setAddOnOptions] = useState([]);

  const removeOption = (n) => {
    setAddOnOptions(addOnOptions.filter((el) => el !== n));

    switch (n) {
      case 0:
        setOptionThree("");

        break;
      case 1:
        setOptionFour("");

        break;
      case 2:
        setOptionFive("");

        break;
      case 3:
        setOptionSix("");

        break;
      case 4:
        setOptionSeven("");

        break;
      case 5:
        setOptionEight("");

        break;
      case 6:
        setOptionNine("");

        break;
      case 7:
        setOptionTen("");

        break;

      default:
        break;
    }
  };

  const handleCancelPoll = () => {
    setOptionOne("");
    setOptionTwo("");
    setOptionThree("");
    setOptionFour("");
    setOptionFive("");
    setOptionSix("");
    setOptionSeven("");
    setOptionEight("");
    setOptionNine("");
    setOptionTen("");
    setAddOnOptions([]);
    setHasPoll(false);
    setDays(30);
  };

  return (
    <div>
      {hasPoll ? (
        <div style={{ marginTop: 25, marginBottom: 15 }}>
          <Group position="apart" align="flex-start">
            <div>
              <Text
                weight={600}
                sx={{
                  marginLeft: 5,
                  fontSize: 15,
                  marginBottom: 5,
                  marginTop: -5,
                }}
              >
                *Tips
              </Text>
              <List size="sm">
                <List.Item>Voting can last as long as you would like</List.Item>
                <List.Item>Clean and shorter options would be great </List.Item>
                <List.Item>You can have up to 10 options</List.Item>
                <List.Item>Options are not editable after posting</List.Item>
                <List.Item>Voting options are not saved in draft</List.Item>
              </List>
              <Button
                variant="subtle"
                size="xs"
                color="red"
                sx={{
                  marginTop: 5,
                }}
                onClick={() => handleCancelPoll()}
              >
                Cancel the poll
              </Button>
            </div>

            <div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                }}
              >
                <Group spacing={14}>
                  <span style={{ marginLeft: 10, color: "red" }}>*</span>
                  <TextInput
                    placeholder="option one"
                    value={optionOne}
                    onChange={(event) =>
                      setOptionOne(event.currentTarget.value)
                    }
                    // sx={{ minWidth: 500 }}
                  />
                </Group>

                <Group spacing={14}>
                  <span style={{ marginLeft: 10, color: "red" }}>*</span>
                  <TextInput
                    placeholder="option two"
                    value={optionTwo}
                    onChange={(event) =>
                      setOptionTwo(event.currentTarget.value)
                    }
                  />
                </Group>

                {addOnOptions.includes(0) && (
                  <Group spacing={4}>
                    <ActionIcon
                      onClick={() => removeOption(0)}
                      sx={{
                        visibility:
                          addOnOptions[addOnOptions.length - 1] === 0
                            ? "default"
                            : "hidden",
                      }}
                    >
                      <Trash strokeWidth={1.2} size={18} />
                    </ActionIcon>

                    <TextInput
                      placeholder="option three"
                      value={optionThree}
                      onChange={(event) =>
                        setOptionThree(event.currentTarget.value)
                      }
                    />
                  </Group>
                )}

                {addOnOptions.includes(1) && (
                  <Group spacing={4}>
                    <ActionIcon
                      onClick={() => removeOption(1)}
                      sx={{
                        visibility:
                          addOnOptions[addOnOptions.length - 1] === 1
                            ? "default"
                            : "hidden",
                      }}
                    >
                      <Trash strokeWidth={1.2} size={18} />
                    </ActionIcon>

                    <TextInput
                      placeholder="option four"
                      value={optionFour}
                      onChange={(event) =>
                        setOptionFour(event.currentTarget.value)
                      }
                    />
                  </Group>
                )}
                {addOnOptions.includes(2) && (
                  <Group spacing={4}>
                    <ActionIcon
                      onClick={() => removeOption(2)}
                      sx={{
                        visibility:
                          addOnOptions[addOnOptions.length - 1] === 2
                            ? "default"
                            : "hidden",
                      }}
                    >
                      <Trash strokeWidth={1.2} size={18} />
                    </ActionIcon>

                    <TextInput
                      placeholder="option five"
                      value={optionFive}
                      onChange={(event) =>
                        setOptionFive(event.currentTarget.value)
                      }
                    />
                  </Group>
                )}
                {addOnOptions.includes(3) && (
                  <Group spacing={4}>
                    <ActionIcon
                      onClick={() => removeOption(3)}
                      sx={{
                        visibility:
                          addOnOptions[addOnOptions.length - 1] === 3
                            ? "default"
                            : "hidden",
                      }}
                    >
                      <Trash strokeWidth={1.2} size={18} />
                    </ActionIcon>

                    <TextInput
                      placeholder="option six"
                      value={optionSix}
                      onChange={(event) =>
                        setOptionSix(event.currentTarget.value)
                      }
                    />
                  </Group>
                )}

                {addOnOptions.includes(4) && (
                  <Group spacing={4}>
                    <ActionIcon
                      onClick={() => removeOption(4)}
                      sx={{
                        visibility:
                          addOnOptions[addOnOptions.length - 1] === 4
                            ? "default"
                            : "hidden",
                      }}
                    >
                      <Trash strokeWidth={1.2} size={18} />
                    </ActionIcon>

                    <TextInput
                      placeholder="option seven"
                      value={optionSeven}
                      onChange={(event) =>
                        setOptionSeven(event.currentTarget.value)
                      }
                    />
                  </Group>
                )}

                {addOnOptions.includes(5) && (
                  <Group spacing={4}>
                    <ActionIcon
                      onClick={() => removeOption(5)}
                      sx={{
                        visibility:
                          addOnOptions[addOnOptions.length - 1] === 5
                            ? "default"
                            : "hidden",
                      }}
                    >
                      <Trash strokeWidth={1.2} size={18} />
                    </ActionIcon>

                    <TextInput
                      placeholder="option eight"
                      value={optionEight}
                      onChange={(event) =>
                        setOptionEight(event.currentTarget.value)
                      }
                    />
                  </Group>
                )}

                {addOnOptions.includes(6) && (
                  <Group spacing={4}>
                    <ActionIcon
                      onClick={() => removeOption(6)}
                      sx={{
                        visibility:
                          addOnOptions[addOnOptions.length - 1] === 6
                            ? "default"
                            : "hidden",
                      }}
                    >
                      <Trash strokeWidth={1.2} size={18} />
                    </ActionIcon>

                    <TextInput
                      placeholder="option nine"
                      value={optionNine}
                      onChange={(event) =>
                        setOptionNine(event.currentTarget.value)
                      }
                    />
                  </Group>
                )}

                {addOnOptions.includes(7) && (
                  <Group spacing={4}>
                    <ActionIcon
                      onClick={() => removeOption(7)}
                      sx={{
                        visibility:
                          addOnOptions[addOnOptions.length - 1] === 7
                            ? "default"
                            : "hidden",
                      }}
                    >
                      <Trash strokeWidth={1.2} size={18} />
                    </ActionIcon>

                    <TextInput
                      placeholder="option ten"
                      value={optionTen}
                      onChange={(event) =>
                        setOptionTen(event.currentTarget.value)
                      }
                    />
                  </Group>
                )}
              </div>
              <Stack align="flex-end" spacing={1} sx={{ marginTop: 5 }}>
                <Button
                  variant="subtle"
                  disabled={addOnOptions.length === 8}
                  onClick={() =>
                    setAddOnOptions([...addOnOptions, addOnOptions.length])
                  }
                >
                  Add option
                </Button>
                <NumberInput
                  label={`Voting ends in ${days || 0} days`}
                  size="xs"
                  styles={{
                    input: {
                      width: 50,
                      textAlign: "center",
                    },
                  }}
                  //   label="Step on hold"
                  //   description="Step the value when clicking and holding the arrows"
                  hideControls
                  value={days}
                  min={0}
                  onChange={(val) => setDays(val)}
                />
              </Stack>
            </div>
          </Group>
        </div>
      ) : (
        <Group position="right">
          <Button
            variant="subtle"
            sx={{
              marginTop: 5,
            }}
            size="sm"
            onClick={() => setHasPoll(true)}
          >
            Start a poll
          </Button>
        </Group>
      )}
    </div>
  );
}
