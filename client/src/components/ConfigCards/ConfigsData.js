export const getSelectConfigs = (
  message,
  setMessage,
  posts,
  setPosts,
  stories,
  setStories,
  secrets,
  setSecrets
) => {
  return [
    {
      title: 'Who can chat with me',
      description:
        'Only your chosen group of users can start a new chat with you',
      value: message,
      onChange: setMessage,

      selectData: [
        { value: 'anyone', label: 'Everyone' },
        { value: 'friendsOnly', label: 'Friends' },

        { value: 'none', label: 'None' }
      ]
    },

    {
      title: 'Who can see my non-private posts listed in my personal page',
      description:
        'Only your chosen group of users can see your posts listed in your page',
      value: posts,
      onChange: setPosts,
      selectData: [
        { value: 'public', label: 'Everyone' },
        { value: 'friendsOnly', label: 'Friends only' },
        {
          value: 'friendsAndFollowersOnly',
          label: 'Friends and followers'
        },
        { value: 'private', label: 'Myself only' }
      ]
    },
    {
      title: 'Who can see my non-private stories listed in my personal page',
      description:
        'Only your chosen group of users can see your stories listed in your page',
      value: stories,
      onChange: setStories,
      selectData: [
        { value: 'public', label: 'Everyone' },
        { value: 'friendsOnly', label: 'Friends only' },
        {
          value: 'friendsAndFollowersOnly',
          label: 'Friends and followers'
        },
        { value: 'private', label: 'Myself only' }
      ]
    },
    {
      title: 'Who can see my anonymous secrets listed in my personal page',
      description:
        'Only your chosen group of users can see your secrets listed in your page',
      value: secrets,
      onChange: setSecrets,
      selectData: [
        { value: 'private', label: 'Myself only' },
        { value: 'friendsOnly', label: 'Friends only' },
        {
          value: 'friendsAndFollowersOnly',
          label: 'Friends and followers'
        },
        { value: 'public', label: 'Everyone' }
      ]
    }
  ];
};

export const getSwitchConfigs = (
  allowFollowing,
  setAllowFollowing,
  allowFriending,
  setAllowFriending
) => {
  return [
    {
      title: 'Allow new followers',

      checked: allowFollowing,
      onChange: event => setAllowFollowing(event.currentTarget.checked)
    },

    {
      title: 'Allow new friend requests',

      checked: allowFriending,
      onChange: event => setAllowFriending(event.currentTarget.checked)
    }
  ];
};
