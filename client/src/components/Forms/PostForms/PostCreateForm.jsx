import React, { useState, useMemo, useCallback } from 'react';
import axios from 'axios';
import {
  createStyles,
  Text,
  Title,
  SimpleGrid,
  TextInput,
  Textarea,
  Button,
  Group,
  ActionIcon,
  RadioGroup,
  Radio,
  Checkbox
} from '@mantine/core';
import { Formik } from 'formik';
import * as yup from 'yup';
import useCreatePost from '../../../react-query-hooks/usePosts/useCreatePost';
import useUser from './../../../react-query-hooks/useUser/useUser';
import { useDidUpdate } from '@mantine/hooks';
import { useNavigate } from 'react-router-dom';
import AboutSelect from './../../Selects/AboutSelect';
import { RichTextEditor } from '@mantine/rte';
import backendApi from './../../../utility/backendApi';
import PostContent from '../../../pages/Posts/Post/PostContent';
import usePost from '../../../react-query-hooks/usePosts/usePost';
import SendPostButton from './SendPostButton';
import { showError, showSuccess } from './../../../utility/showNotifications';
import PollForm from './PollForm';

const useStyles = createStyles(theme => ({
  wrapper: {
    minHeight: 400,
    boxSizing: 'border-box',
    backgroundImage: `linear-gradient(-60deg, ${
      theme.colors[theme.primaryColor][4]
    } 0%, ${theme.colors[theme.primaryColor][7]} 100%)`,
    borderRadius: theme.radius.md,
    padding: theme.spacing.xl * 2.5,

    [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
      padding: theme.spacing.xl * 1.5
    }
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
    backgroundColor: theme.white,
    padding: theme.spacing.xl,
    borderRadius: theme.radius.md,
    boxShadow: theme.shadows.lg
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

export default function PostCreateForm() {
  const { classes } = useStyles();

  const { data: user } = useUser();
  const { mutate: createNewPost, isSuccess, data } = useCreatePost();

  const navigate = useNavigate();

  useDidUpdate(() => {
    if (isSuccess) {
      navigate(`/posts/${data._id}`);
      showSuccess('Your new post is successfully created');
    }
  }, [isSuccess]);

  const [richText, setRichText] = useState('');
  const [selectValue, setSelectValue] = useState('General');
  const [exposedToValue, setExposedToValue] = useState('public');
  const [hours, setHours] = useState(0);
  const [willNotify, setWillNotify] = useState(true);

  // poll
  const [hasPoll, setHasPoll] = useState(false);
  const [pollDays, setPollDays] = useState(30);

  const [optionOne, setOptionOne] = useState('');
  const [optionTwo, setOptionTwo] = useState('');
  const [optionThree, setOptionThree] = useState('');
  const [optionFour, setOptionFour] = useState('');
  const [optionFive, setOptionFive] = useState('');
  const [optionSix, setOptionSix] = useState('');
  const [optionSeven, setOptionSeven] = useState('');
  const [optionEight, setOptionEight] = useState('');
  const [optionNine, setOptionNine] = useState('');
  const [optionTen, setOptionTen] = useState('');

  const handleImageUpload = useCallback(async file => {
    const formData = new FormData();
    formData.append('image', file);

    const url = await axios
      .post(`${backendApi}users/postStoryImageUpload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          ACL: 'public-read'
        },
        withCredentials: true
      })
      .catch(err => {
        if (err.response.status === 401) {
          showError('You cannot upload more than 50 images a day');
        } else {
          showError("Uploading image wasn't successful");
        }
      })
      .then(res => res.data.data);

    return url;
  }, []);

  return (
    <div>
      <Formik
        initialValues={{
          title: ''
        }}
        onSubmit={values => {
          let pollArray = [];

          const appendOptions = (...args) => {
            for (const arg of args) {
              if (arg) pollArray.push({ label: arg });
            }
          };

          appendOptions(
            optionOne,
            optionTwo,
            optionThree,
            optionFour,
            optionFive,
            optionSix,
            optionSeven,
            optionEight,
            optionNine,
            optionTen
          );

          createNewPost({
            content: richText,
            title: values.title,
            about: selectValue,
            willNotify,
            createdAt: Date.now() + hours * 1000 * 60 * 60,
            lastCommentedAt: Date.now() + hours * 1000 * 60 * 60,
            poll: pollArray,
            pollEndsAt: Date.now() + (pollDays || 0) * 1000 * 60 * 60 * 24,
            exposedTo: exposedToValue
          });
        }}
      >
        {formik => (
          <form onSubmit={formik.handleSubmit}>
            <div className={classes.form}>
              <TextInput
                placeholder="Title"
                mt="md"
                id="title"
                name="title"
                value={formik.values.title}
                onChange={formik.handleChange}
                error={formik.touched.title && Boolean(formik.errors.title)}
                helperText={formik.touched.title && formik.errors.title}
              />

              <RichTextEditor
                placeholder="Content..."
                mt="md"
                id="postCreate"
                name="postCreate"
                key="postCreate"
                value={richText}
                onChange={setRichText}
                onImageUpload={handleImageUpload}
                sx={{ minHeight: 200 }}
              />
              <PollForm
                hasPoll={hasPoll}
                days={pollDays}
                setDays={setPollDays}
                setHasPoll={setHasPoll}
                optionOne={optionOne}
                setOptionOne={setOptionOne}
                optionTwo={optionTwo}
                setOptionTwo={setOptionTwo}
                optionThree={optionThree}
                setOptionThree={setOptionThree}
                optionFour={optionFour}
                setOptionFour={setOptionFour}
                optionFive={optionFive}
                setOptionFive={setOptionFive}
                optionSix={optionSix}
                setOptionSix={setOptionSix}
                optionSeven={optionSeven}
                setOptionSeven={setOptionSeven}
                optionEight={optionEight}
                setOptionEight={setOptionEight}
                optionNine={optionNine}
                setOptionNine={setOptionNine}
                optionTen={optionTen}
                setOptionTen={setOptionTen}
              />
              <AboutSelect
                selectValue={selectValue}
                setSelectValue={setSelectValue}
                label="This is about?"
                data={[
                  { value: 'General', label: 'General' },
                  { value: 'L', label: 'Lesbian' },
                  { value: 'G', label: 'Gay' },
                  { value: 'B', label: 'Bisexual' },
                  { value: 'T', label: 'Transgender' },
                  { value: 'Q', label: 'Queer/ Questioning' },
                  { value: 'I', label: 'Intersex' },
                  { value: 'A', label: 'Asexual' },
                  { value: '2S', label: 'Two-Spirit' },
                  { value: '+More', label: '+More' }
                ]}
                exposedToValue={exposedToValue}
                setExposedToValue={setExposedToValue}
                exposedToLabel="Can be viewed by?"
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
              <Checkbox
                checked={willNotify}
                label="I want to be notified when people reply"
                onChange={event => setWillNotify(event.currentTarget.checked)}
              />
              <Group position="right" mt="md">
                <SendPostButton
                  richText={richText}
                  title={formik.values.title}
                  willNotify={willNotify}
                  about={selectValue}
                  userId={user?._id}
                  navigate={navigate}
                  hours={hours}
                  setHours={setHours}
                  exposedTo={exposedToValue}
                />
              </Group>
            </div>
          </form>
        )}
      </Formik>
    </div>
  );
}
