import React, { useState, useEffect, useMemo, useCallback } from 'react';
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
import { useParams } from 'react-router-dom';
import useDraftPost from './../../../react-query-hooks/usePosts/useDraftPost';
import Cookies from 'js-cookie';
import { useQueryClient } from 'react-query';
import { showNotification } from '@mantine/notifications';
import { Check } from 'tabler-icons-react';
import useDraftStory from './../../../react-query-hooks/useStories/useDraftStory';
import usePatchStory from '../../../react-query-hooks/useStories/usePatchStory';
import SendStoryButton from './SendStoryButton';
import axios from 'axios';
import { showError } from '../../../utility/showNotifications';

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

export default function StoryDraftCreateForm() {
  const { classes } = useStyles();
  const { storyId } = useParams();

  const { data: draft } = useDraftStory(storyId);

  const { data: user } = useUser();
  // const { mutate: createNewPost, isSuccess, data } = useCreatePost();
  // const { mutate: deleteDraftPost } = useDeletePost();

  const { mutate: patchStory, isLoading, isSuccess } = usePatchStory(storyId);

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  useDidUpdate(() => {
    if (isSuccess) {
      queryClient.invalidateQueries(['draftStories']);

      navigate(`/stories/${storyId}`);

      showNotification({
        title: 'Awesome',
        message: 'Your new story has been created!',
        color: 'teal',
        icon: <Check />,
        autoClose: 5000
      });
    }
  }, [isSuccess]);

  const [richText, setRichText] = useState(
    localStorage.getItem(`draft-${storyId}`)
  );
  const [selectValue, setSelectValue] = useState(draft?.about);
  const [exposedToValue, setExposedToValue] = useState(draft?.exposedTo);
  const [draftTitle, setDraftTitle] = useState('');
  const [hours, setHours] = useState(0);
  const [willNotify, setWillNotify] = useState(true);

  useEffect(() => {
    if (draft) {
      setSelectValue(draft?.about);
      setDraftTitle(draft?.title);
      setExposedToValue(draft?.exposedTo);
    }
  }, [draft]);

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
          // title: draft.title,
          file: draft?.file
        }}
        onSubmit={() => {
          patchStory({
            content: richText,
            title: draftTitle,
            about: selectValue,
            createdAt: Date.now() + hours * 1000 * 60 * 60,
            lastCommentedAt: Date.now() + hours * 1000 * 60 * 60,
            draft: false,
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
                classNames={{
                  input: classes.input,
                  label: classes.inputLabel
                }}
                id={`draft-${storyId}-title`}
                name={`draft-${storyId}-title`}
                key={`draft-${storyId}-title`}
                value={draftTitle}
                onChange={e => setDraftTitle(e.currentTarget.value)}
                error={formik.touched.title && Boolean(formik.errors.title)}
                helperText={formik.touched.title && formik.errors.title}
              />

              <RichTextEditor
                placeholder="Content..."
                mt="md"
                id={`draft-${storyId}-content`}
                name={`draft-${storyId}-content`}
                key={`draft-${storyId}-content`}
                value={richText}
                onChange={setRichText}
                sx={{ minHeight: 200 }}
                onImageUpload={handleImageUpload}
              />
              {/* <RadioGroup
                value={radioValue}
                onChange={setRadioValue}
                size="sm"
                spacing="sm"
                // label="Select your favorite framework/library"
                // description="This is anonymous"
                // required
              >
                {radiosArray.map((radio) => (
                  <Radio key={radio} value={radio} label={radio} />
                ))}
              </RadioGroup> */}
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
                {/* <Button
                  className={classes.control}
                  type="submit"
                  disabled={!formik.values.title.trim() || !richText}
                >
                  Submit
                </Button> */}
                <SendStoryButton
                  richText={richText}
                  title={draftTitle}
                  hours={hours}
                  setHours={setHours}
                  isDraft={true}
                  storyId={storyId}
                  about={selectValue}
                  userId={user?._id}
                  navigate={navigate}
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
