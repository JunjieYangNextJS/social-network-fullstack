const User = require('./../models/userModel');

const getMentionedUsers = async (
  content,
  user,
  creatorId,
  willNotify,
  comment,
  postSubscribers
) => {
  const mentionedUsernames = content
    .split(/[<u></u>]+/)
    .filter(str => str.startsWith('@'))
    .map(s => s.slice(1));
  // const atArray = splitted.filter(str => str.startsWith('@'));
  // const usernames = atArray.map(s => s.slice(1));

  const mentionedUsers = [];

  if (mentionedUsernames.length !== 0) {
    const promises = [];

    mentionedUsernames.forEach(
      el =>
        el !== user.username &&
        promises.push(User.findOne({ username: el }).select('id'))
    );

    const mentionedUserObjs = await Promise.all(promises);

    mentionedUserObjs.forEach(el => mentionedUsers.push(el?.id));
  }

  // add poster and commenter into mentionedUsers notifications
  // if (creatorId !== user.id && willNotify) {
  //   mentionedUsers.push(creatorId);
  // }

  const notifiedUsers = [...mentionedUsers];

  const addCreatorToNotifications = el => {
    if (el && creatorId !== user.id && !el.underStated && willNotify) {
      notifiedUsers.push(creatorId);
      return;
    }

    if (creatorId !== user.id && willNotify) {
      notifiedUsers.push(creatorId);
    }
  };

  addCreatorToNotifications(comment || '');

  if (
    comment &&
    comment.commenter.id !== user.id &&
    comment.willNotifyCommenter
  ) {
    notifiedUsers.push(comment.commenter.id.toString());
  }

  if (comment && comment.subscribers)
    comment.subscribers.forEach(el => notifiedUsers.push(el.toString()));
  // notifiedUsers.push(...comment.subscribers);

  if (postSubscribers)
    postSubscribers.forEach(el => notifiedUsers.push(el.toString()));

  const receiverIds = [...new Set(notifiedUsers)];

  const receivers = receiverIds
    .filter(el => el !== user.id)
    .map(id => ({
      receiver: id,
      read: false,
      checked: false,
      receiverIsMentioned: mentionedUsers.includes(id)
    }));

  return receivers;
};

module.exports = getMentionedUsers;
