import React, { useState } from 'react';
import {
  createStyles,
  Text,
  TextInput,
  Textarea,
  Button,
  Group,
  Checkbox,
  ActionIcon,
  NumberInput,
  Container
} from '@mantine/core';
import { Pencil } from 'tabler-icons-react';
import { Formik } from 'formik';
import backgroundImage from './../../../images/hollow-tree.jpeg';

import useCreateSecret from '../../../react-query-hooks/useSecrets/useCreateSecret';

import { useDidUpdate, useClickOutside } from '@mantine/hooks';
import { useNavigate } from 'react-router-dom';

import SecretCreateSelects from '../../../pages/SecretWall/Secret/SecretCreateSelects';

const useStyles = createStyles(theme => ({
  background: {
    minHeight: '100vh',
    width: '100%',
    backgroundSize: 'cover',
    backgroundAttachment: 'fixed',
    backgroundImage: `url(${backgroundImage})`
  },

  wrapper: {
    minHeight: 400,
    boxSizing: 'border-box',
    maxWidth: 800,
    paddingTop: 140,
    // backgroundColor: theme.colors.gray[4],

    // backgroundImage: `linear-gradient(-60deg, ${
    //   theme.colors[theme.primaryColor][4]
    // } 0%, ${theme.colors[theme.primaryColor][7]} 100%)`,
    borderRadius: theme.radius.md
    // padding: theme.spacing.xl * 2.5,

    // [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
    //   padding: theme.spacing.xl * 1.5,
    // },
  },
  container: {
    padding: '120px 0 30px 0',
    opacity: 1

    // minHeight: 400,
    // boxSizing: "border-box",
    // backgroundImage: `linear-gradient(-60deg, ${
    //   theme.colors[theme.primaryColor][4]
    // } 0%, ${theme.colors[theme.primaryColor][7]} 100%)`,
    // borderRadius: theme.radius.md,
    // padding: theme.spacing.xl * 2.5,

    // [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
    //   padding: theme.spacing.xl * 1.5,
    // },
  },

  title: {
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    color: theme.white,
    lineHeight: 1
  },

  description: {
    color: theme.colors[theme.primaryColor][0],
    maxWidth: 300,

    [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
      maxWidth: '100%'
    }
  },

  form: {
    padding: theme.spacing.xl,
    borderRadius: theme.radius.sm,
    boxShadow: theme.shadows.lg,
    backgroundColor: theme.white
  },

  input: {
    backgroundColor: theme.white,
    borderColor: theme.colors.gray[4],
    color: theme.black,

    '&::placeholder': {
      color: theme.colors.gray[5]
    }
  },

  inputLabel: {
    color: theme.black
  },

  control: {
    backgroundColor: theme.colors[theme.primaryColor][6]
  }
}));

export default function SecretCreateForm() {
  const { classes } = useStyles();

  const { mutate: createNewSecret, isSuccess, data } = useCreateSecret();

  const [text, setText] = useState('');

  const [tempUsername, setTempUsername] = useState('Anonymous user');
  const [editTU, setEditTU] = useState(false);
  const TUref = useClickOutside(() => setEditTU(false));

  const [day, setDay] = useState(30);

  const [selectValue, setSelectValue] = useState(['everyone']);
  const [genderValue, setGenderValue] = useState(['everyone']);
  const [exposedToValue, setExposedToValue] = useState('public');
  const [willNotify, setWillNotify] = useState(true);

  const navigate = useNavigate();

  useDidUpdate(() => {
    if (isSuccess) navigate(`/tree-hollow/${data.id}`);
  }, [isSuccess]);

  return (
    <div className={classes.background}>
      <Container className={classes.wrapper}>
        <Formik
          initialValues={{
            content: ''
          }}
          onSubmit={values => {
            createNewSecret({
              content: text,
              tempUsername,
              expiredAt: Date.now() + day * 60 * 24 * 60000,
              sexuality: selectValue,
              gender: genderValue,
              exposedTo: exposedToValue,
              willNotify
            });
          }}
        >
          {formik => (
            <form onSubmit={formik.handleSubmit}>
              <div className={classes.form}>
                <Textarea
                  placeholder="What is in your mind?"
                  mt="md"
                  size="md"
                  id="secretContent"
                  name="secretContent"
                  minRows={3}
                  value={text}
                  onChange={event => setText(event.currentTarget.value)}
                />
                <Group sx={{ marginTop: 30, marginBottom: 10 }}>
                  {editTU ? (
                    <Group spacing={5}>
                      <Text component="span">by</Text>
                      <TextInput
                        ref={TUref}
                        value={tempUsername}
                        variant="unstyled"
                        sx={{ borderBottom: '1px solid #373A40', width: 140 }}
                        onChange={event =>
                          setTempUsername(event.currentTarget.value)
                        }
                      />
                    </Group>
                  ) : (
                    <Group spacing={1}>
                      <Text>by</Text>
                      <Text sx={{ fontStyle: 'italic', marginLeft: 5 }}>
                        {tempUsername}
                      </Text>
                      <ActionIcon onClick={() => setEditTU(true)}>
                        <Pencil />
                      </ActionIcon>
                    </Group>
                  )}

                  <Group spacing={5}>
                    <Text component="span" size="md">
                      Expires in
                    </Text>
                    <NumberInput
                      hideControls
                      value={day}
                      onChange={val => setDay(val)}
                      min={1}
                      styles={{
                        input: {
                          width: 45,
                          textAlign: 'center'
                        }
                      }}
                    />{' '}
                    <Text component="span" size="md">
                      days
                    </Text>
                  </Group>
                </Group>
                <div style={{ margin: '20px 0' }}>
                  <Text
                    sx={{ fontWeight: 600, color: 'black', marginBottom: -12 }}
                    underline
                  >
                    Pick your listeners
                  </Text>
                  <SecretCreateSelects
                    selectValue={selectValue}
                    setSelectValue={setSelectValue}
                    label="Sexuality"
                    data={[
                      { value: 'everyone', label: 'Every' },
                      { value: 'gay', label: 'Gay' },
                      { value: 'lesbian', label: 'Lesbian' },
                      { value: 'bisexual', label: 'Bisexual' },
                      { value: 'bicurious', label: 'Bicurious' },
                      { value: 'pansexual', label: 'Pansexual' },
                      { value: 'asexual', label: 'Asexual' },
                      { value: 'queer', label: 'Queer' },
                      { value: 'questioning', label: 'Questioning' },
                      { value: 'androsexual', label: 'AndroSexual' },
                      { value: 'gynesexual', label: 'Gynesexual' },
                      { value: 'demisexual', label: 'Demisexual' },
                      { value: 'polyamory', label: 'Polyamory' },
                      { value: 'kink', label: 'Kink' }
                    ]}
                    genderValue={genderValue}
                    setGenderValue={setGenderValue}
                    genderLabel="Gender"
                    genderData={[
                      { value: 'everyone', label: 'Every' },
                      { value: 'male', label: 'Male' },
                      { value: 'female', label: 'Female' },
                      { value: 'mtf', label: 'MTF' },
                      { value: 'ftm', label: 'FTM' },
                      { value: 'agender', label: 'Agender' },
                      { value: 'androgyne', label: 'Androgyne' },
                      { value: 'bigender', label: 'Bigender' },
                      { value: 'intersex', label: 'Intersex' },
                      { value: 'two-spirit', label: 'Two-Spirit' },
                      { value: 'queer', label: 'Queer' },
                      { value: 'questioning', label: 'Questioning' }
                    ]}
                    exposedToValue={exposedToValue}
                    setExposedToValue={setExposedToValue}
                    exposedToLabel="Can be viewed by"
                    exposedToData={[
                      { value: 'public', label: 'Anyone' },
                      {
                        value: 'friendsAndFollowersOnly',
                        label: 'Only my friends and followers'
                      },
                      { value: 'friendsOnly', label: 'Only my friends' },
                      { value: 'private', label: 'Only me' }
                    ]}
                  />
                </div>

                <Checkbox
                  checked={willNotify}
                  label="I want to be notified when people reply"
                  onChange={event => setWillNotify(event.currentTarget.checked)}
                />

                <Group position="right" mt="md">
                  <Button
                    className={classes.control}
                    type="submit"
                    disabled={!text}
                  >
                    Submit
                  </Button>
                </Group>
              </div>
            </form>
          )}
        </Formik>
      </Container>
    </div>
  );
}
