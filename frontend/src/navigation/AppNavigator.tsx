import React from 'react';
import {
  DarkTheme,
  DefaultTheme,
  getStateFromPath,
  LinkingOptions,
  NavigationContainer,
} from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import * as Linking from 'expo-linking';
import * as Notifications from 'expo-notifications';
import { View } from 'react-native';

import { useColorScheme, makeStyles } from '../theme';
import { RootStackParamList } from '../types';
import {
  DEEP_LINK_SCREEN_CONFIG,
  EXPO_PREFIX,
  handleUrl,
  onSubscribe,
  isEmailLoginOrActivateAccount,
  isRouteAvailable,
  DeepRoutes,
} from '../constants';
import { isRouteBesidePost, postOrMessageDetailPathToRoutes } from '../helpers';
import { useRedirect } from '../utils';
import { useInitialLoad } from '../hooks/useInitialLoad';
import { LoadingOrErrorView } from '../components';
import { useAuth } from '../utils/AuthProvider';
import { useUpdateApp } from '../hooks/useUpdateApp';

import RootStackNavigator from './RootStackNavigator';
import { navigationRef } from './NavigationService';
import { useSiteSettings } from '../hooks';
import { SiteSetting } from '../generated/server';

export default function AppNavigator() {
  const { colorScheme } = useColorScheme();
  const useInitialLoadResult = useInitialLoad();
  const { setRedirectPath } = useRedirect();
  const auth = useAuth();
  const siteSetting: SiteSetting = useSiteSettings() as unknown as SiteSetting;
  const styles = useStyles();
  const { loading: appUpdateLoading } = useUpdateApp();

  const darkMode = colorScheme === 'dark';

  return (
    <>
      <StatusBar style={darkMode ? 'light' : 'dark'} />
      {useInitialLoadResult.loading || auth.isLoading || appUpdateLoading ? (
        <LoadingOrErrorView loading style={styles.background} />
      ) : (
        <View style={styles.background}>
          <NavigationContainer
            linking={createLinkingConfig({
              setRedirectPath,
              isLoggedIn: useInitialLoadResult.isLoggedIn,
              isPublicDiscourse: useInitialLoadResult.isPublicDiscourse,
            })}
            theme={darkMode ? DarkTheme : DefaultTheme}
            ref={navigationRef}
          >
            <RootStackNavigator
              authProps={auth}
              siteSettingsProps={siteSetting}
            />
          </NavigationContainer>
        </View>
      )}
    </>
  );
}

type CreateLinkingConfigParams = {
  setRedirectPath: (path: string) => void;
  isLoggedIn: boolean;
  isPublicDiscourse: boolean;
};
const createLinkingConfig = (params: CreateLinkingConfigParams) => {
  const { setRedirectPath, isLoggedIn, isPublicDiscourse } = params;
  const linking: LinkingOptions<RootStackParamList> = {
    prefixes: [EXPO_PREFIX],
    config: { screens: DEEP_LINK_SCREEN_CONFIG },
    subscribe: onSubscribe,
    async getInitialURL() {
      // Handle app was opened from a deep link

      const url = await Linking.getInitialURL();

      if (url != null) {
        return url;
      }

      // Handle app was opened from expo push notification

      const response = await Notifications.getLastNotificationResponseAsync();
      if (response) {
        return handleUrl(response);
      }
    },
    getStateFromPath: (fullPath, config) => {
      // Split off any search params (`?a=1&b=2`)
      // Then, Extract the leading part of the path as the `route`.
      // e.g., `'post-detail'`.
      // The remainder of the params are `pathParams`.
      // e.g., `['11', '3']`, representing `topicId` and `postNumber`, respectively.
      const [pathname] = fullPath.split('?');
      const [route, ...pathParams] = pathname.split('/');

      const routeToLogin = { routes: [{ name: 'Login' }] };
      // If we're not on a known deep link path, fallback to the default behavior
      // from React Navigation.
      if (!isRouteAvailable(route)) {
        return getStateFromPath(fullPath, config);
      }

      if (isEmailLoginOrActivateAccount(route)) {
        return {
          routes: [
            {
              name: 'Login',
              params: {
                emailToken: pathParams[0],
                isActivateAccount: route === DeepRoutes['activate-account'],
              },
            },
          ],
        };
      }

      if (!isLoggedIn) {
        setRedirectPath(pathname);
        /**
         * it will check if deep link is for beside post it will require user to login scene
         * for example in this case is message-detail where user must be login to send message
         *
         * And for another condition, we want to redirect the user to the login scene if the discourse is not publicly accessible and the user is not logged in.
         */

        if (isRouteBesidePost(route) || !isPublicDiscourse) {
          return routeToLogin;
        }
      }

      let routes = postOrMessageDetailPathToRoutes({ route, pathParams });

      return {
        routes,
        index: routes.length - 1,
      };
    },
  };
  return linking;
};

const useStyles = makeStyles(({ colors }) => ({
  background: {
    flex: 1,
    backgroundColor: colors.background,
  },
}));
