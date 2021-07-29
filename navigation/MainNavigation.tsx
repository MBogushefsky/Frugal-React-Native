/**
 * If you are not familiar with React Navigation, check out the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';
import { ColorSchemeName } from 'react-native';
import NotFoundScreen from '../screens/NotFoundScreen';
import LoginScreen from '../screens/LoginScreen';
import { RootStackParamList } from '../types';
import LinkingConfiguration from './LinkingConfiguration';
import SideMenuDrawerNavigator from './SideMenuDrawerNavigator';
import SignUpScreen from '../screens/SignUpScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentUser } from '../redux/Reducers';
import CurrentUserData from '../models/CurrentUserData';

export default function Navigation({ colorScheme }: { colorScheme: ColorSchemeName }) {
  return (
    <NavigationContainer
      linking={LinkingConfiguration}
      theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <RootNavigator />
    </NavigationContainer>
  );
}

// A root stack navigator is often used for displaying modals on top of all other content
// Read more here: https://reactnavigation.org/docs/modal
const Stack = createStackNavigator<RootStackParamList>();

function RootNavigator() {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state: any) => state.currentUser);
  const [isStorageLoaded, setIsStorageLoaded] = React.useState(false);

  AsyncStorage.getItem('currentUser').then(
    (value: any) => {
      if (!isStorageLoaded) {
        dispatch(setCurrentUser(JSON.parse(value) as CurrentUserData));
        setIsStorageLoaded(true);
      }
    }
  )
  
  if (currentUser != null && currentUser.Id == '') { return null; }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animationEnabled: false }} initialRouteName={currentUser != null ? 'Root' : 'Login'}>
      <Stack.Screen name="Root" component={SideMenuDrawerNavigator} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
      <Stack.Screen name="NotFound" component={NotFoundScreen} options={{ title: 'Oops!' }} />
    </Stack.Navigator>
  );
}

