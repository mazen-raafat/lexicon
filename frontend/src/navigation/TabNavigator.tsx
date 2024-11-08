import React from 'react';
import { Platform, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  BottomTabBarProps,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';

import { Icon, Text } from '../core-ui';
import {
  Home as HomeScene,
  Messages,
  Profile as ProfileScene,
} from '../screens';
import { makeStyles, useTheme } from '../theme';
import { TabParamList } from '../types';
import { useAuth } from '../utils/AuthProvider';
import { SiteSetting } from '../generated/server';

const Tab = createBottomTabNavigator<TabParamList>();

function TabBar({ state, navigation: { navigate } }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const styles = useStyles();
  const { colors } = useTheme();
  const useAuthResults = useAuth();

  function getIconName(route: { name: string }) {
    route;
    if (route.name === 'Home') {
      return 'Home';
    } else if (route.name === 'Profile') {
      return 'Person';
    } else if (route.name === 'Messages') {
      return 'Mail';
    } else {
      return 'Home';
    }
  }

  function getTestID(route: { name: string }) {
    if (route.name === 'Home') {
      return 'Tab:Home';
    } else if (route.name === 'Profile') {
      return 'Tab:Person';
    } else if (route.name === 'Messages') {
      return 'Tab:Messages';
    }
  }

  return (
    <View style={styles.tabContainer}>
      {state.routes.map((route: { name: string }, index: number) => {
        const onPress = async () => {
          const token = !useAuthResults.isLoading && useAuthResults.token;
          if (state.index === 0 && state.index === index) {
            navigate(route.name, { backToTop: true });
          } else {
            if (
              (route.name === 'Profile' || route.name === 'Messages') &&
              !token
            ) {
              navigate('Login');
              return;
            }
            navigate(route.name, { backToTop: false });
          }
        };

        return (
          <TouchableOpacity
            key={state.routes[index].key}
            onPress={onPress}
            style={styles.tab}
            activeOpacity={state.index === index ? 1 : 0.2}
            testID={getTestID(route)}
          >
            <View
              style={[
                { paddingBottom: insets.bottom },
                styles.tabItemContainer,
              ]}
            >
              <Icon
                name={getIconName(route)}
                size="xl"
                color={
                  state.index === index ? colors.activeTab : colors.inactiveTab
                }
              />
              <Text
                color={state.index === index ? 'activeTab' : 'inactiveTab'}
                size="xs"
              >
                {route.name}
              </Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export default function TabNavigator({
  siteSetting,
}: {
  siteSetting: SiteSetting;
}) {
  const commonScreens = (
    <>
      <Tab.Screen
        name="Home"
        component={HomeScene}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScene}
        options={{ headerShown: false }}
      />
    </>
  );

  return (
    <Tab.Navigator
      initialRouteName="Home"
      tabBar={(props) => <TabBar {...props} />}
    >
      {
        <Tab.Screen
          name="Home"
          component={HomeScene}
          options={{ headerShown: false }}
        />
      }
      {siteSetting?.chatEnabled && (
        <Tab.Screen
          name="Messages"
          component={Messages}
          options={{ title: t('Messages') }}
        />
      )}
      {
        <Tab.Screen
          name="Profile"
          component={ProfileScene}
          options={{ headerShown: false }}
        />
      }
    </Tab.Navigator>
  );
}

const useStyles = makeStyles(({ colors }) => ({
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: colors.background,
    borderWidth: 0.2,
    borderColor: colors.border,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Platform.OS === 'ios' ? 15 : '3%',
  },
  tabItemContainer: {
    alignItems: 'center',
  },
}));
