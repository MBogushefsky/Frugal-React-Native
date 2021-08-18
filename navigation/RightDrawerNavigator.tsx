import * as React from 'react';
import { View, Image, Animated } from 'react-native';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem, DrawerItemList } from '@react-navigation/drawer';
import DashboardScreen from '../screens/DashboardScreen';
import { createStackNavigator } from '@react-navigation/stack';
import LeftDrawerButton from './LeftDrawerButton';
import { StyleSheet } from 'react-native';
import { SText } from '../components/StyledComponents';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from 'react-native-paper';
import LinkedBankAccountsScreen from '../screens/LinkedBankAccountsScreen';
import { CommonActions, DrawerActions } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ProductSearchScreenNavigator from '../screens/ProductSearchScreen';
import { useDispatch, useSelector } from 'react-redux';
import { setLeftDrawerState } from '../redux/Reducers';
import MainStackNavigator from './MainStackNavigator';
import RightDrawerButton from './RightDrawerButton';
import { MFilterListItem } from '../components/StyledMaterial';
import AvailableStores from '../constants/AvailableStores';

function CustomDrawerContent(props: any) {
    const { colors } = useTheme();
    const { searchFilter } = useSelector((state: any) => state.searchFilter);

    let availableStores = AvailableStores;
    let storeOptions = availableStores.map((store: string) => { 
        return {
            label: store,
            value: store,
            selected: searchFilter.stores.includes(store) ? 'checked' : 'unchecked'
        }
    });

    return (
        <DrawerContentScrollView {...props}>
            <View>
                <MFilterListItem id="stores" name="Store" type="checkbox" options={storeOptions}></MFilterListItem>
            </View>
        </DrawerContentScrollView>
    );
}

const Drawer = createDrawerNavigator();

export default function RightSideMenuDrawerNavigator({ navigation }: any) {
    const dispatch = useDispatch();
    const { drawers } = useSelector((state: any) => state.drawers);
    const { colors } = useTheme();

    React.useEffect(() => {
        if (drawers.left === 'toggle') {
          navigation.dispatch(DrawerActions.openDrawer());
          dispatch(setLeftDrawerState('open'));
        }
    }, [drawers.left === 'toggle']);

    return (
        <Drawer.Navigator initialRouteName="Search" drawerType="slide" drawerPosition="right" drawerContentOptions={{
            activeTintColor: colors.primary,
            inactiveTintColor: colors.backdrop,
            }} drawerContent={props => <CustomDrawerContent {...props} />}>
                <Drawer.Screen name="Search" component={MainStackNavigator} />
        </Drawer.Navigator>
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
    },
    viewTitle: {
        flex: 7,
        justifyContent: 'center'
    },
    title: {
        fontSize: 32
    },
    viewLogo: {
        flex: 2,
        alignItems: 'center',
        justifyContent: 'center'
    },
    logo: {
        width: 40,
        height: 40
    },
    separator: {
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        marginVertical: 15,
        height: 1,
        width: '100%'
    },
    drawerIcon: {
        marginRight: -20
    },
    drawerLabelImage: {
        width: 90,
        height: 30
    }
  });