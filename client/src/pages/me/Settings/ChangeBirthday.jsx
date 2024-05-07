import React, { useEffect, useState } from 'react';

import {
  createStyles,
  Paper,
  Title,
  Text,
  TextInput,
  Button,
  Container,
  Group,
  Box,
  PasswordInput,
  NumberInput
} from '@mantine/core';

import { useParams } from 'react-router-dom';
import { useDidUpdate } from '@mantine/hooks';
import { showSuccess } from '../../../utility/showNotifications';
import useUser from './../../../react-query-hooks/useUser/useUser';
import SideNavbarNested from './../components/SideNavbarNested';
import { useChangeBirthday } from './../../../react-query-hooks/useUser/useAuth';

const useStyles = createStyles(theme => ({
  title: {
    fontSize: 26,
    fontWeight: 900,
    fontFamily: `Greycliff CF, ${theme.fontFamily}`
  },

  controls: {
    [theme.fn.smallerThan('xs')]: {
      flexDirection: 'column-reverse'
    }
  },

  control: {
    [theme.fn.smallerThan('xs')]: {
      width: '100%',
      textAlign: 'center'
    }
  }
}));

export default function ChangeBirthday() {
  const { data: user } = useUser();

  const { classes } = useStyles();
  const [year, setYear] = useState(null);
  const [month, setMonth] = useState(null);
  const [day, setDay] = useState(null);

  const [disable, setDisable] = useState(false);
  const { mutate, isLoading, isSuccess, isError } = useChangeBirthday();

  useEffect(() => {
    if (!user) return;
    if (user.birthDay) setDay(user.birthDay);
    if (user.birthYear) setYear(user.birthYear);
    if (user.birthMonth) setMonth(user.birthMonth);
  }, [user]);

  useDidUpdate(() => {
    if (isLoading) {
      setDisable(true);
    }
    if (isSuccess) {
      showSuccess('Your birthday has been changed');

      setDisable(false);
    }
    if (isError) {
      setDisable(false);
    }
  }, [isLoading, isSuccess, isError]);

  const handleChangeBirthday = () => {
    if (!disable)
      mutate({
        birthMonth: month,
        birthDay: day,
        birthYear: year
      });
  };

  return (
    <Box
      sx={{
        // backgroundColor: "#F1F3F5",
        paddingTop: 115,
        minHeight: `calc(100vh - 115px)`
      }}
    >
      {user && (
        <Container>
          <SideNavbarNested />
          <Container size={460} my={30}>
            <Title className={classes.title} align="center">
              Change my Birthday
            </Title>
            <Text color="dimmed" size="sm" align="center">
              Enter your new birthday
            </Text>

            <Paper withBorder shadow="md" p={30} radius="md" mt="xl">
              <Group align="flex-end" mt="md">
                <NumberInput
                  hideControls
                  label="Month"
                  placeholder="Month"
                  styles={{
                    input: {
                      width: 70,
                      textAlign: 'center',
                      color: (month > 12 || month < 1) && 'red'
                    }
                    // label: { fontSize: 16 }
                  }}
                  max={12}
                  min={1}
                  value={month}
                  onChange={val => setMonth(val)}
                />
                <NumberInput
                  hideControls
                  placeholder="Day"
                  label="Day"
                  styles={{
                    input: {
                      width: 70,
                      textAlign: 'center',
                      color: (day > 31 || day < 1) && 'red'
                    }
                  }}
                  max={31}
                  min={1}
                  value={day}
                  onChange={val => setDay(val)}
                />
                <NumberInput
                  hideControls
                  placeholder="Year"
                  max={new Date().getFullYear()}
                  min={1920}
                  label="Year"
                  styles={{
                    input: {
                      width: 70,
                      textAlign: 'center',
                      color:
                        (year > new Date().getFullYear() || year < 1920) &&
                        'red'
                    }
                    // root: { borderColor: "red" },
                  }}
                  value={year}
                  onChange={val => setYear(val)}
                />
              </Group>
              <Group position="right" mt="lg" className={classes.controls}>
                <Button
                  className={classes.control}
                  onClick={() => handleChangeBirthday()}
                  disabled={disable || !day || !month || !year}
                >
                  Confirm
                </Button>
              </Group>
            </Paper>
          </Container>
        </Container>
      )}
    </Box>
  );
}
