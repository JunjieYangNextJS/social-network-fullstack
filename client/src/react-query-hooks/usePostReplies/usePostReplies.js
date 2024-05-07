import { useQuery } from 'react-query';
import axios from 'axios';
import backendApi from '../../utility/backendApi';

export default function usePostReplies() {
  return useQuery(['postReplies'], () =>
    axios
      .get(`${backendApi}postReplies`, {
        withCredentials: true
      })
      .then(res => res.data.data.data)
  );
}
