import { useEffect } from 'react';
import { Alert, Platform } from 'react-native';
import { ScreenshotDetector } from 'react-native-detector';
import FlagSecure from 'react-native-flag-secure-android';

export const useScreenProtection = () => {
  useEffect(() => {
    if (Platform.OS === 'android') {
      // ✅ Prevent screenshots and recordings entirely
      FlagSecure?.activate();
      console.log("FlagSecure activated on Android");
      return () => FlagSecure.deactivate();
    } else if (Platform.OS === 'ios') {
      // ⚠️ iOS cannot block screenshots, but can detect them
      const sub = ScreenshotDetector.subscribe(() => {
        Alert.alert(
          'Security Warning',
          'Screenshots are not allowed for security reasons.'
        );
      });
      console.log("Screenshot detector active on iOS");

      return () => ScreenshotDetector.unsubscribe(sub);
    }
  }, []);
};
