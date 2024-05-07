import { useState, useRef, useEffect } from 'react';
import {
  Modal,
  Button,
  Group,
  createStyles,
  Text,
  Title,
  SimpleGrid,
  TextInput,
  Textarea,
  ActionIcon,
  Select,
  Avatar,
  Input
} from '@mantine/core';
import { Formik } from 'formik';
import { BrandTwitter } from 'tabler-icons-react';

import { usePatchUserWithFormData } from './../../react-query-hooks/useUser/usePatchUser';
import { showError } from '../../utility/showNotifications';
import { useDidUpdate } from '@mantine/hooks';

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
    display: 'flex',
    flexDirection: 'column',
    gap: 5,
    // backgroundColor: theme.white,
    padding: theme.spacing.xl
    // borderRadius: theme.radius.md,
    // boxShadow: theme.shadows.lg,
  },

  social: {
    color: theme.white,

    '&:hover': {
      color: theme.colors[theme.primaryColor][1]
    }
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

export default function EditProfileModal({ user, opened, setOpened }) {
  const [bio, setBio] = useState('');

  const [genderArray, setGenderArray] = useState([
    'Male',
    'Female',
    'MTF',
    'FTM',
    'Agender',
    'Androgyne',
    'Bigender',
    'Intersex',
    'Queer',
    'Questioning',
    'Two-Spirit',
    'Prefer not to answer'
  ]);
  const [gender, setGender] = useState('');

  const [sexualityArray, setSexualityArray] = useState([
    'Gay',
    'Lesbian',
    'Bisexual',
    'Bicurious',
    'Pansexual',
    'Asexual',
    'Queer',
    'Questioning',
    'AndroSexual',
    'Gynesexual',
    'Demisexual',
    'Polyamory',
    'Kink',
    'Prefer not to answer'
  ]);
  const [sexuality, setSexuality] = useState('');

  const { classes } = useStyles();
  const { mutate: updateMyProfile, isLoading } = usePatchUserWithFormData();
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [preview, setPreview] = useState();

  const photoRef = useRef();
  useEffect(() => {
    if (!selectedPhoto) {
      setPreview(undefined);
      return;
    }

    const objectUrl = URL.createObjectURL(selectedPhoto);

    setPreview(objectUrl);

    // free memory when ever this component is unmounted
    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedPhoto]);

  useDidUpdate(() => {
    if (isLoading) setOpened(false);
  }, [isLoading]);

  useEffect(() => {
    if (!genderArray.includes(user.gender) && user.gender) {
      setGenderArray(prev => [user.gender, ...prev]);
    }

    if (!sexualityArray.includes(user.sexuality) && user.sexuality) {
      setSexualityArray(prev => [user.sexuality, ...prev]);
    }
  }, [user, genderArray, sexualityArray]);

  useEffect(() => {
    user?.bio && setBio(user?.bio);
    user?.gender && setGender(user?.gender);
    user?.sexuality && setSexuality(user?.sexuality);
  }, [user]);

  const handleSelectedPhoto = e => {
    if (e.target.files[0].size > 10485760)
      return showError('This image is too big.');
    setSelectedPhoto(e.target.files[0]);
  };

  return (
    <>
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title="Edit profile"
        centered
      >
        <Formik
          initialValues={{
            profileName: user?.profileName,
            location: user?.location || '',
            twitter: user?.twitter || '',
            gender: user?.gender || '',
            sexuality: user?.sexuality || '',
            bio: user?.bio || '',
            photo: user?.photo,
            profileImage: user?.profileImage || null
          }}
          onSubmit={values => {
            // values.bio = bio;

            const fd = new FormData();
            fd.append('profileName', values.profileName);
            fd.append('location', values.location);
            fd.append('twitter', values.twitter);
            fd.append('bio', bio);

            if (sexuality !== 'Prefer not to answer') {
              fd.append('sexuality', sexuality);
            } else {
              fd.append('sexuality', '');
            }
            if (gender !== 'Prefer not to answer') {
              fd.append('gender', gender);
            } else {
              fd.append('gender', '');
            }

            if (selectedPhoto) fd.append('photo', selectedPhoto);
            if (values.profileImage)
              fd.append('profileImage', values.profileImage);
            // fd.append("_method", "PATCH");

            updateMyProfile(fd);
          }}
        >
          {formik => (
            <form onSubmit={formik.handleSubmit}>
              <div className={classes.form}>
                <Avatar
                  src={preview || user?.photo}
                  alt="User photo"
                  radius="xl"
                  size={70}
                  onClick={() => photoRef.current.click()}
                  sx={{ cursor: 'pointer' }}
                />
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  name="avatarImage"
                  ref={photoRef}
                  onChange={e => handleSelectedPhoto(e)}
                />

                <TextInput
                  label="Profile name"
                  id="profileName"
                  name="profileName"
                  classNames={{
                    input: classes.input,
                    label: classes.inputLabel
                  }}
                  value={formik.values.profileName}
                  onChange={formik.handleChange}
                />
                <TextInput
                  label="Location"
                  placeholder="New York, NY"
                  id="location"
                  name="location"
                  // mt="md"
                  classNames={{
                    input: classes.input,
                    label: classes.inputLabel
                  }}
                  value={formik.values.location}
                  onChange={formik.handleChange}
                />
                <Select
                  id="gender"
                  name="gender"
                  key="gender"
                  searchable
                  creatable
                  value={gender}
                  onChange={setGender}
                  getCreateLabel={query => `I refer to myself as: ${query}`}
                  onCreate={query => {
                    setGenderArray(current => [query, ...current]);
                    return query;
                  }}
                  data={genderArray}
                  placeholder="Pick or specify your own"
                  label="Gender"
                />
                <Select
                  id="sexuality"
                  name="sexuality"
                  key="sexuality"
                  searchable
                  creatable
                  value={sexuality}
                  onChange={setSexuality}
                  getCreateLabel={query => `I refer to myself as: ${query}`}
                  onCreate={query => {
                    setSexualityArray(current => [query, ...current]);

                    return query;
                  }}
                  data={sexualityArray}
                  placeholder="Pick or specify your own"
                  label="Sexuality"
                />

                <TextInput
                  id="twitter"
                  name="twitter"
                  label="Twitter"
                  icon={<BrandTwitter size={16} />}
                  placeholder="Your twitter"
                  value={formik.values.twitter}
                  onChange={formik.handleChange}
                />

                <Textarea
                  value={bio}
                  onChange={e => setBio(e.currentTarget.value)}
                  label="Bio"
                  id="bio"
                  name="bio"
                  placeholder="I am a..."
                  minRows={4}
                  // mt="md"
                  classNames={{
                    input: classes.input,
                    label: classes.inputLabel
                  }}
                />

                <Group position="right" mt="md">
                  <Button type="submit" className={classes.control}>
                    Save
                  </Button>
                </Group>
              </div>
            </form>
          )}
        </Formik>
      </Modal>
    </>
  );
}
