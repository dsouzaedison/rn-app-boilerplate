import {View, Text, ActivityIndicator} from 'react-native';
import {useApis} from '../../services/core/api';
import {useStores} from '../../stores';
import {useEffect} from 'react';
import _ from 'lodash';
import {observer} from 'mobx-react';

export const DashboardScreen = observer(() => {
  const {userApi} = useApis();
  const {userStore} = useStores();

  useEffect(() => {
    userApi.getUsers();
  });

  return (
    <View>
      {userStore.fetching && <ActivityIndicator />}
      {_.each(userStore.userList.items, user => (
        <Text>{user.name}</Text>
      ))}
    </View>
  );
});
