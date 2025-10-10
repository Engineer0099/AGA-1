import { NavigatorScreenParams } from '@react-navigation/native';

export type AuthStackParamList = {
  Welcome: undefined;
  Login: undefined;
  SignUp: undefined;
  SchoolLevel: { email: string; password: string };
  Subscription: { schoolLevel: string };
  MainApp: undefined;
};

export type MainTabParamList = {
  Library: undefined;
  Subscription: undefined;
  Extras: undefined;
};

export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Main: NavigatorScreenParams<MainTabParamList>;
  Admin: undefined;
};
