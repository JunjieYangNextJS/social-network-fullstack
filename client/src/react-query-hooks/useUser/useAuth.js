import axios from 'axios';
import { useMutation, useQueryClient } from 'react-query';
import backendApi from '../../utility/backendApi';
import { showError } from '../../utility/showNotifications';

export function useLogin() {
  const queryClient = useQueryClient();
  return useMutation(
    values =>
      axios
        .post(`${backendApi}users/login`, values, {
          withCredentials: true,
          credentials: 'include'
        })
        .then(res => res.data.data.user),

    {
      onSuccess: data => {
        queryClient.setQueryData(['user'], data);
      }
    }
  );
}

export function useForgotPassword() {
  return useMutation(values =>
    axios
      .post(`${backendApi}users/forgotPassword`, values, {
        withCredentials: true,
        credentials: 'include'
      })
      .then(res => res.data)
  );
}

export function useResetPassword(token) {
  return useMutation(values =>
    axios
      .patch(`${backendApi}users/resetPassword/${token}`, values)
      .then(res => res.data)
  );
}

export function useChangePassword() {
  return useMutation(values =>
    axios
      .patch(`${backendApi}users/updateMyPassword`, values, {
        withCredentials: true
      })
      .catch(err => {
        showError(
          err.response.data.error.message ||
            'Your request was unsuccessful, please try again or later'
        );
        // if (err.response.status === 401) {
        //   console.log(err.response);
        //   showError('Your current password is invalid');
        // } else {
        //   showError('Changing password was unsuccessful');
        // }
      })
      .then(res => res.data.data.user)
  );
}
export function useChangeBirthday() {
  const queryClient = useQueryClient();
  return useMutation(
    values =>
      axios
        .patch(`${backendApi}users/updateBirthday`, values, {
          withCredentials: true
        })

        .then(res => res.data.data),
    {
      onSuccess: data => {
        queryClient.setQueryData(['user'], data);
      }
    }
  );
}

export function useChangeEmailOrUsername(type) {
  const queryClient = useQueryClient();
  return useMutation(
    values =>
      axios
        .patch(`${backendApi}users/updateEmailOrUsername`, values, {
          withCredentials: true
        })
        .catch(err => {
          if (err.response.status === 401) {
            showError('Your current password is invalid');
          } else if (err.response.status === 403) {
            showError(`This ${type} is not allowed`);
          } else if (err.response.status === 400) {
            showError(`Your ${type} is taken.`);
          } else {
            showError('Update was unsuccessful');
          }
        })
        .then(res => res.data.data),

    {
      onSuccess: data => {
        queryClient.setQueryData(['user'], data);
      }
    }
  );
}

export function useDeleteMyAccount() {
  const queryClient = useQueryClient();
  return useMutation(
    values =>
      axios
        .patch(`${backendApi}users/deleteMyAccount`, values, {
          withCredentials: true
        })
        .catch(err => {})

    // {
    //   onSuccess: () => {
    //     queryClient.setQueryData(['user'], null);
    //   }
    // }
  );
}
