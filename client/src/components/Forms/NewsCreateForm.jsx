import React, { useState, useMemo, useRef } from "react";
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
  Radio,
  RadioGroup,
  Container,
} from "@mantine/core";
import { Formik } from "formik";
import * as yup from "yup";
import useCreateNews from "./../../react-query-hooks/useNews/useCreateNews";
import useUser from "./../../react-query-hooks/useUser/useUser";
import { useDidUpdate } from "@mantine/hooks";
import { useNavigate } from "react-router-dom";
import { RichTextEditor } from "@mantine/rte";
import { showError } from "../../utility/showNotifications";
import { Photo } from "tabler-icons-react";

const useStyles = createStyles((theme) => ({
  wrapper: {
    minHeight: 400,
    boxSizing: "border-box",
    maxWidth: 800,
    paddingTop: 120,
    // backgroundColor: theme.colors.gray[4],

    // backgroundImage: `linear-gradient(-60deg, ${
    //   theme.colors[theme.primaryColor][4]
    // } 0%, ${theme.colors[theme.primaryColor][7]} 100%)`,
    borderRadius: theme.radius.md,
    // padding: theme.spacing.xl * 2.5,

    // [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
    //   padding: theme.spacing.xl * 1.5,
    // },
  },

  title: {
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    color: theme.white,
    lineHeight: 1,
  },

  description: {
    color: theme.colors[theme.primaryColor][0],
    maxWidth: 300,

    [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
      maxWidth: "100%",
    },
  },

  form: {
    backgroundColor: theme.white,
    padding: theme.spacing.xl,
    borderRadius: theme.radius.md,
    boxShadow: theme.shadows.lg,
  },

  input: {
    backgroundColor: theme.white,
    borderColor: theme.colors.gray[4],
    color: theme.black,

    "&::placeholder": {
      color: theme.colors.gray[5],
    },
  },

  inputLabel: {
    color: theme.black,
  },

  control: {
    backgroundColor: theme.colors[theme.primaryColor][6],
  },
}));

const radiosArray = [
  "General",
  "L",
  "G",
  "B",
  "T",
  "Q",
  "I",
  "A",
  "2S",
  "+More",
];

export default function NewsCreateForm() {
  const { classes } = useStyles();

  const { data: user } = useUser();
  const { mutate: createNews, isSuccess } = useCreateNews();

  const navigate = useNavigate();
  const photoRef = useRef();

  // useDidUpdate(() => {
  //   if (isSuccess) navigate(`/news`);
  // }, [isSuccess]);

  const [radioValue, setRadioValue] = useState("General");
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  const handleSelectedPhoto = (e) => {
    if (e.target.files[0].size > 10485760)
      return showError("This image is too big.");
    setSelectedPhoto(e.target.files[0]);
  };

  return (
    <Container className={classes.wrapper}>
      <Formik
        initialValues={{
          // content: "",
          title: "",
          link: "",
          authorName: "",
          file: null,
        }}
        onSubmit={(values, actions) => {
          const fd = new FormData();
          // fd.append("content", values.content);
          fd.append("title", values.title);
          fd.append("authorName", values.authorName);
          fd.append("link", values.link);
          fd.append("about", radioValue);
          fd.append("image", selectedPhoto);

          createNews(fd);
          // createNews({
          //   content: values.content,
          //   title: values.title,
          //   authorName: values.authorName,
          //   link: values.link,
          //   about: radioValue,
          //   image: selectedPhoto,
          // });

          actions.setSubmitting(false);
          actions.resetForm();
          setRadioValue("General");
          setSelectedPhoto(null);
        }}
      >
        {(formik) => (
          <form onSubmit={formik.handleSubmit}>
            <div className={classes.form}>
              <TextInput
                label="Title"
                mt="md"
                classNames={{ input: classes.input, label: classes.inputLabel }}
                id="title"
                name="title"
                value={formik.values.title}
                onChange={formik.handleChange}
                error={formik.touched.title && Boolean(formik.errors.title)}
                helperText={formik.touched.title && formik.errors.title}
              />
              <TextInput
                label="Link"
                mt="md"
                classNames={{ input: classes.input, label: classes.inputLabel }}
                id="link"
                name="link"
                value={formik.values.link}
                onChange={formik.handleChange}
                error={formik.touched.link && Boolean(formik.errors.link)}
                helperText={formik.touched.link && formik.errors.link}
              />
              <TextInput
                label="Author"
                mt="md"
                classNames={{ input: classes.input, label: classes.inputLabel }}
                id="authorName"
                name="authorName"
                value={formik.values.authorName}
                onChange={formik.handleChange}
                error={
                  formik.touched.authorName && Boolean(formik.errors.authorName)
                }
                helperText={
                  formik.touched.authorName && formik.errors.authorName
                }
              />

              {/* <Textarea
                placeholder="Content"
                mt="md"
                id="content"
                name="content"
                value={formik.values.content}
                onChange={formik.handleChange}
              /> */}
              <Group sx={{ marginTop: 10 }}>
                <Group
                  onClick={() => photoRef.current.click()}
                  spacing={1}
                  sx={{ cursor: "pointer", marginBottom: -3 }}
                >
                  <ActionIcon variant="transparent">
                    <Photo size={22} color={"black"} />
                  </ActionIcon>
                  <Text>Image({selectedPhoto && 1})</Text>
                </Group>

                <input
                  type="file"
                  accept="image/*"
                  name="newsImage"
                  hidden
                  ref={photoRef}
                  onChange={(e) => handleSelectedPhoto(e)}
                />
                <RadioGroup
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
                </RadioGroup>
              </Group>

              <Group position="right" mt="md">
                <Button className={classes.button} type="submit">
                  Submit
                </Button>
                {/* <Button onClick={formik.handleReset}></Button> */}
              </Group>
            </div>
          </form>
        )}
      </Formik>
    </Container>
  );
}
