import { DrawerActions } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';
import { StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import useColorScheme from '../hooks/useColorScheme';
import { setRightDrawerState } from '../redux/Reducers';
import ProductSearchScreenNavigator from '../screens/ProductSearchScreen';
import LeftDrawerButton from './LeftDrawerButton';
import RightDrawerButton from './RightDrawerButton';

const MainStack = createStackNavigator();

export default function MainStackNavigator({ navigation }: any) {
  const dispatch = useDispatch();
  const { drawers } = useSelector((state: any) => state.drawers);
  const colorScheme = useColorScheme();

  React.useEffect(() => {
    if (drawers.right === 'toggle') {
      navigation.dispatch(DrawerActions.openDrawer());
      dispatch(setRightDrawerState('open'));
    }
}, [drawers.right === 'toggle']);

  return (
    <MainStack.Navigator
      initialRouteName="Home">
      <MainStack.Screen 
            options={{ headerStyle: styles.headerMergedHeaders, headerLeft: () => (LeftDrawerButton()), headerRight: () => (RightDrawerButton())}} 
            name="Home"
            component={ProductSearchScreenNavigator} />
    </MainStack.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
      flex: 1,
      justifyContent: 'center',
      flexDirection: 'row',
      height: 50,
      width: '100%'
  },
  headerMergedHeaders: {
      shadowOpacity: 0
  }
});