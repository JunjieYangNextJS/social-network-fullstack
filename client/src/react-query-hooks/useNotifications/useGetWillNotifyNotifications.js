import { useQuery } from 'react-query';
import axios from 'axios';
import backendApi from './../../utility/backendApi';

export default function useGetWillNotifyNotifications() {
  return useQuery(['willNotifyNotifications'], () =>
    axios
      .get(`${backendApi}users/willNotifyNotifications`, {
        withCredentials: true,
        credentials: 'include'
      })
      .then(res => res.data.data)
  );
}
