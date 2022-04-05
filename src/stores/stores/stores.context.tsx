import React from 'react';
import {useLocalStore} from 'mobx-react';
import {Stores, stores} from './index';

const StoresContext = React.createContext<Stores>(stores);

export const StoreProvider = ({children}: {children: React.ReactNode}) => {
  const _stores = useLocalStore<Stores>(() => stores);

  return (
    <StoresContext.Provider value={_stores}>{children}</StoresContext.Provider>
  );
};

export const useStores = (): Stores => {
  const _stores = React.useContext(StoresContext);

  if (!_stores) {
    // this is especially useful in TypeScript so you don't need to be checking for null all the time
    throw new Error('useStore must be used within a StoreProvider.');
  }

  return _stores;
};
