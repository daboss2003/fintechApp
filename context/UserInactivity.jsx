import { useAuth } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import { useEffect, useRef } from 'react';
import { AppState } from 'react-native';
import { MMKV } from 'react-native-mmkv';

const storage = new MMKV({
  id: 'inactivty-storage',
});

export const UserInactivityProvider = ({ children }) => {
  const appState = useRef(AppState.currentState);
  const router = useRouter();
  const { isSignedIn } = useAuth();

  useEffect(() => {
    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      subscription.remove();
    };
  }, []);

  const handleAppStateChange = async (nextAppState) => {
    console.log('🚀 ~ handleAppStateChange ~ nextAppState', nextAppState);
    if (nextAppState === 'background') {
      recordStartTime();
    } else if (nextAppState === 'active' && appState.current.match(/background/)) {
      const elapsed = Date.now() - (storage.getNumber('startTime') || 0);
      console.log('🚀 ~ handleAppStateChange ~ elapsed:', elapsed);

      if (elapsed > 3000 && isSignedIn) {
         console.log('🚀', elapsed);
        router.replace('/(authenticated)/(modals)/lock');
      }
    }
    appState.current = nextAppState;
  };

  const recordStartTime = () => {
    storage.set('startTime', Date.now());
  };

  return children;
};