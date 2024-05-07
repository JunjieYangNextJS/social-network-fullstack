import React from 'react';
import { renderToString } from 'react-dom/server';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { NotificationsProvider } from '@mantine/notifications';
import { MantineProvider } from '@mantine/core';
import SignUpPage from './pages/SignUpPage';
import LoginPage from './pages/LoginPage';
import ForgotMyPasswordPage from './pages/ForgotMyPasswordPage';
import AboutUsPage from './pages/AboutUsPage';
import ContentPolicyPage from './pages/ContentPolicyPage';
import HelpPage from './pages/HelpPage';
import PrivacyPage from './pages/PrivacyPage';
import TermsOfServicePage from './pages/TermsOfServicePage';
import PageNotFound from './pages/PageNotFound';
import Privacy from './pages/me/Settings/Privacy';
import Notifications from './pages/me/Notifications';
import MyPosts from './pages/me/MyCreations/MyPosts';
import MyStories from './pages/me/MyCreations/MyStories';
import MySecrets from './pages/me/MyCreations/MySecrets';
import LikedPosts from './pages/me/Liked/LikedPosts';
import LikedStories from './pages/me/Liked/LikedStories';
import Posts from './pages/Posts';
import SearchedPosts from './pages/Posts/SearchedPosts';
import Post from './pages/Posts/Post';
import Stories from './pages/Stories';
import StoryCreate from './pages/Stories/StoryCreate';
import Story from './pages/Stories/Story';
import SecretWall from './pages/SecretWall';
import Secret from './pages/SecretWall/Secret';
import LayoutNav from './pages/LayoutNav';
import PostCreate from './pages/Posts/PostCreate';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import OtherUserProfilePage from './pages/Users/User/OtherUserProfilePage';
import { ChatRoomObjProvider } from './contexts/ChatRoomObjContext';
import Home from './pages/me/Profile/Home';
import SecretCreate from './pages/SecretWall/SecretCreate';
import BlockedUsers from './pages/me/Hidden/BlockedUsers';
import HiddenPosts from './pages/me/Hidden/HiddenPosts';
import News from './pages/News';
import SearchedNews from './pages/News/SearchedNews';
import NewsCreate from './pages/News/NewsCreate';
import PostDraftCreate from './pages/Posts/PostDraftCreate';
import { SecretTellerUsernameProvider } from './contexts/SecretTellerUsernameContext';
import DM from './pages/DMs/DM';
import PostCommentPage from './pages/Comments/PostCommentPage/PostCommentPage';
import StoryCommentPage from './pages/Comments/StoryCommentPage/StoryCommentPage';
import FriendListPage from './pages/me/FriendList/FriendListPage';
import SearchedStories from './pages/Stories/SearchedStories';
import Followers from './pages/me/Follows/Followers';
import Following from './pages/me/Follows/Following';
import StoryDraftCreate from './pages/Stories/StoryDraftCreate';
import BookmarkedPosts from './pages/me/Bookmarked/BookmarkedPosts';
import BookmarkedStories from './pages/me/Bookmarked/BookmarkedStories';
import HiddenStories from './pages/me/Hidden/HiddenStories';
import MyPostComments from './pages/me/MyComments/MyPostComments';
import BookmarkedPostComments from './pages/me/Bookmarked/BookmarkedPostComments';
import LikedPostComments from './pages/me/Liked/LikedPostComments';
import MyPostReplies from './pages/me/MyComments/MyPostReplies';
import LikedStoryComments from './pages/me/Liked/LikedStoryComments';
import BookmarkedStoryComments from './pages/me/Bookmarked/BookmarkedStoryComments';
import MyStoryComments from './pages/me/MyComments/MyStoryComments';
import MyStoryReplies from './pages/me/MyComments/MyStoryReplies';
import LikedPostReplies from './pages/me/Liked/LikedPostReplies';
import LikedStoryReplies from './pages/me/Liked/LikedStoryReplies';
import ResetMyPasswordPage from './pages/ResetMyPasswordPage';
import ChangePassword from './pages/me/Settings/ChangePassword';
import ChangeEmail from './pages/me/Settings/ChangeEmail';
import ChangeUsername from './pages/me/Settings/ChangeUsername';
import PrivateSecretComment from './pages/SecretWall/Secret/PrivateSecretComment';
import HiddenSecrets from './pages/me/Hidden/HiddenSecrets';
import ChangeBirthday from './pages/me/Settings/ChangeBirthday';
import DeleteMyAccount from './pages/me/Settings/DeleteMyAccount';
import StoryBehindModal from './components/Modals/StoryBehindModal';
// import Loan from './pages/Loan';

function App() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: 0,
        retryDelay: 1000,
        refetchOnWindowFocus: false
      }
    }
  });

  const helmetContext = {};

  return (
    <HelmetProvider context={helmetContext}>
      <GoogleOAuthProvider clientId="158875989411-9elr3akd4v0u006ro3eil7lcii8mqc9p.apps.googleusercontent.com">
        <QueryClientProvider client={queryClient}>
          <MantineProvider
            defaultProps={{ Text: { color: '#343a40' } }}
            theme={{
              colors: {
                black: [
                  '#343a40',
                  '#343a40',
                  '#343a40',
                  '#343a40',
                  '#343a40',
                  '#343a40',
                  '#343a40',
                  '#343a40',
                  '#343a40',
                  '#343a40'
                ],
                whiteBorder: [
                  '#EFF3F4',
                  '#EFF3F4',
                  '#EFF3F4',
                  '#EFF3F4',
                  '#EFF3F4',
                  '#EFF3F4',
                  '#EFF3F4',
                  '#EFF3F4',
                  '#EFF3F4',
                  '#EFF3F4'
                ]
              }
            }}
          >
            <NotificationsProvider>
              <SecretTellerUsernameProvider>
                <ChatRoomObjProvider>
                  <BrowserRouter>
                    <LayoutNav>
                      <Routes>
                        <Route path="*" element={<PageNotFound />} />
                        <Route index element={<Posts />} />
                        <Route path="signup" element={<SignUpPage />} />
                        <Route path="login" element={<LoginPage />} />
                        {/* <Route path="loan" element={<Loan />} /> */}
                        <Route
                          path="reset-password/:token"
                          element={<ResetMyPasswordPage />}
                        />
                        <Route
                          path="forgot-my-password"
                          element={<ForgotMyPasswordPage />}
                        />

                        <Route path="about-us" element={<AboutUsPage />} />
                        <Route
                          path="content-policy"
                          element={<ContentPolicyPage />}
                        />

                        <Route path="privacy" element={<PrivacyPage />} />
                        <Route path="help" element={<HelpPage />} />
                        <Route
                          path="terms-of-service"
                          element={<TermsOfServicePage />}
                        />

                        <Route path="me">
                          {/* <Route
                          path="change-my-password"
                          element={<UpdateMyPassword />}
                        /> */}
                          <Route path="home" element={<Home />} />
                          <Route path="home/stories" element={<Home />} />
                          <Route path="privacy" element={<Privacy />} />
                          <Route
                            path="change-my-password"
                            element={<ChangePassword />}
                          />
                          <Route
                            path="change-my-email"
                            element={<ChangeEmail />}
                          />
                          <Route
                            path="change-my-username"
                            element={<ChangeUsername />}
                          />
                          <Route
                            path="change-my-birthday"
                            element={<ChangeBirthday />}
                          />
                          <Route
                            path="delete-my-account"
                            element={<DeleteMyAccount />}
                          />

                          <Route
                            path="notifications"
                            element={<Notifications />}
                          />
                          <Route
                            path="friend-list"
                            element={<FriendListPage />}
                          />
                          {/* <Route path="bookmarks" element={<Bookmarks />} /> */}
                          <Route
                            path="hidden-posts"
                            element={<HiddenPosts />}
                          />
                          <Route
                            path="hidden-stories"
                            element={<HiddenStories />}
                          />
                          <Route
                            path="hidden-voices"
                            element={<HiddenSecrets />}
                          />
                          {/* <Route path="hidden-posts" element={<HiddenPosts />} /> */}
                          <Route
                            path="blocked-users"
                            element={<BlockedUsers />}
                          />
                          <Route path="my-posts" element={<MyPosts />} />
                          <Route path="my-stories" element={<MyStories />} />
                          <Route path="my-voices" element={<MySecrets />} />
                          <Route
                            path="my-post-comments"
                            element={<MyPostComments />}
                          />
                          <Route
                            path="my-post-replies"
                            element={<MyPostReplies />}
                          />
                          <Route
                            path="my-story-comments"
                            element={<MyStoryComments />}
                          />
                          <Route
                            path="my-story-replies"
                            element={<MyStoryReplies />}
                          />
                          <Route path="liked-posts" element={<LikedPosts />} />
                          <Route
                            path="liked-post-comments"
                            element={<LikedPostComments />}
                          />
                          <Route
                            path="liked-post-replies"
                            element={<LikedPostReplies />}
                          />
                          <Route
                            path="liked-stories"
                            element={<LikedStories />}
                          />
                          <Route
                            path="liked-story-comments"
                            element={<LikedStoryComments />}
                          />
                          <Route
                            path="liked-story-replies"
                            element={<LikedStoryReplies />}
                          />

                          <Route
                            path="bookmarked-posts"
                            element={<BookmarkedPosts />}
                          />
                          <Route
                            path="bookmarked-post-comments"
                            element={<BookmarkedPostComments />}
                          />
                          <Route
                            path="bookmarked-stories"
                            element={<BookmarkedStories />}
                          />
                          <Route
                            path="bookmarked-story-comments"
                            element={<BookmarkedStoryComments />}
                          />

                          <Route
                            path=":username/followers"
                            element={<Followers />}
                          />
                          <Route
                            path=":username/following"
                            element={<Following />}
                          />
                        </Route>

                        <Route path="users">
                          <Route
                            path=":username/followers"
                            element={<Followers />}
                          />
                          <Route
                            path=":username/following"
                            element={<Following />}
                          />
                          <Route
                            path=":username/stories"
                            element={<OtherUserProfilePage />}
                          />
                          <Route
                            path=":username"
                            element={<OtherUserProfilePage />}
                          />
                        </Route>

                        <Route path="posts">
                          <Route index element={<Posts />} />
                          <Route path="create" element={<PostCreate />} />
                          <Route
                            path="draft/:postId"
                            element={<PostDraftCreate />}
                          />

                          <Route path="L" element={<Posts />} />
                          <Route path="G" element={<Posts />} />
                          <Route path="B" element={<Posts />} />
                          <Route path="T" element={<Posts />} />
                          <Route path="Q" element={<Posts />} />
                          <Route path="I" element={<Posts />} />
                          <Route path="A" element={<Posts />} />
                          <Route path="2s" element={<Posts />} />
                          <Route path="+More" element={<Posts />} />

                          <Route path=":postId" element={<Post />} />
                        </Route>
                        <Route path="posts-search">
                          <Route path=":search" element={<SearchedPosts />} />
                        </Route>
                        <Route
                          path="post-comment/:postCommentId"
                          element={<PostCommentPage />}
                        />

                        <Route path="stories">
                          <Route index element={<Stories />} />
                          <Route path="create" element={<StoryCreate />} />
                          <Route
                            path="draft/:storyId"
                            element={<StoryDraftCreate />}
                          />
                          <Route path="L" element={<Stories />} />
                          <Route path="G" element={<Stories />} />
                          <Route path="B" element={<Stories />} />
                          <Route path="T" element={<Stories />} />
                          <Route path="Q" element={<Stories />} />
                          <Route path="I" element={<Stories />} />
                          <Route path="A" element={<Stories />} />
                          <Route path="2s" element={<Stories />} />
                          <Route path="+More" element={<Stories />} />
                          <Route path=":storyId" element={<Story />} />
                        </Route>
                        <Route path="stories-search">
                          <Route path=":search" element={<SearchedStories />} />
                        </Route>
                        <Route
                          path="story-comment/:storyCommentId"
                          element={<StoryCommentPage />}
                        />

                        <Route path="tree-hollow">
                          <Route index element={<SecretWall />} />
                          <Route path="create" element={<SecretCreate />} />
                          <Route
                            path="private/:secretCommentId"
                            element={<PrivateSecretComment />}
                          />
                          <Route path=":secretId" element={<Secret />} />
                        </Route>

                        <Route path="news">
                          <Route index element={<News />} />
                          <Route path="create" element={<NewsCreate />} />
                        </Route>
                        <Route path="news-search">
                          <Route index element={<News />} />
                          <Route path=":search" element={<SearchedNews />} />
                        </Route>
                        <Route path="DM">
                          <Route path=":username" element={<DM />} />
                        </Route>
                      </Routes>
                      <ReactQueryDevtools initialIsOpen={true} />
                      <StoryBehindModal />
                    </LayoutNav>
                  </BrowserRouter>
                </ChatRoomObjProvider>
              </SecretTellerUsernameProvider>
            </NotificationsProvider>
          </MantineProvider>
        </QueryClientProvider>
      </GoogleOAuthProvider>
    </HelmetProvider>
  );
}

export default App;
