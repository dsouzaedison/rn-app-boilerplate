import {useEffect, useState} from 'react';
import {UserServiceImpl} from '../user/user.service.impl';

export interface Api {
  userApi: UserServiceImpl;
}

export const useApis = (): Api => {
  const apis = {
    userApi: new UserServiceImpl(),
  };
  const [api, setApi] = useState<Api>(apis);

  useEffect(() => {
    setApi(apis);
    // eslint-disable-next-line
  }, []);

  return api;
};
