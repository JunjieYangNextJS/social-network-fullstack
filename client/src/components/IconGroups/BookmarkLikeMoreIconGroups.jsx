import React from "react";
import { createStyles, ActionIcon, Group } from "@mantine/core";
import { Share } from "tabler-icons-react";
import BookmarkIconButton from "../IconButtons/BookmarkIconButton";
import LikeIconButton from "../IconButtons/LikeIconButton";

const useStyles = createStyles((theme) => ({
  card: {
    backgroundColor:
      theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white,
  },

  title: {
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
  },

  footer: {
    padding: `${theme.spacing.xs}px ${theme.spacing.lg}px`,
    marginTop: theme.spacing.md,
    borderTop: `1px solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[5] : theme.colors.gray[2]
    }`,
  },
}));

export default function BookmarkLikeMoreIconGroups({
  navigate,
  user,
  userBookmarkedItems,
  single,
  bookmarkAddMethod,
  bookmarkRemoveMethod,
  itemLikes,
  patchEndPoint,
  userLikedItems,
  // setUserLikedItems,
  arrayMethod,
  moreMenu,
  queryName,
  likedProperty,
  bookmarkedProperty,
  itemId,
  itemModel,
  queryParentName,
  notFunctional,
}) {
  const { theme } = useStyles();

  return (
    <>
      {itemId && (
        <Group spacing={1}>
          <LikeIconButton
            itemLikes={itemLikes}
            itemId={itemId}
            user={user}
            // userLikedItems={userLikedItems}
            // single={single}
            // setUserLikedItems={setUserLikedItems}
            navigate={navigate}
            // arrayMethod={arrayMethod}
            // patchEndPoint={patchEndPoint}
            theme={theme}
            queryName={queryName}
            likedProperty={likedProperty}
            itemModel={itemModel}
            notFunctional={notFunctional}
          />
          <BookmarkIconButton
            navigate={navigate}
            itemId={itemId}
            user={user}
            userBookmarkedItems={userBookmarkedItems}
            bookmarkAddMethod={bookmarkAddMethod}
            bookmarkRemoveMethod={bookmarkRemoveMethod}
            theme={theme}
            queryName={queryName}
            bookmarkedProperty={bookmarkedProperty}
            itemModel={itemModel}
            notFunctional={notFunctional}
          />
          {moreMenu && moreMenu}
        </Group>
      )}
    </>
  );
}
