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
import { CommonActions } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ProductSearchScreenNavigator from '../screens/ProductSearchScreen';
import SideMenuDrawerFilterButton from './RightDrawerButton';
import RightSideMenuDrawerNavigator from './RightDrawerNavigator';

const DashboardScreenStack = createStackNavigator();

function DashboardScreenNavigator({ navigation }: any) {

    navigation.store = "Product Search";

    return (
        <DashboardScreenStack.Navigator>
            <DashboardScreenStack.Screen 
            options={{ headerStyle: styles.headerMergedHeaders, headerLeft: () => (LeftDrawerButton()), headerRight: () => (SideMenuDrawerFilterButton())}} 
            name={ navigation.store }
            component={ProductSearchScreenNavigator} />
        </DashboardScreenStack.Navigator>
    );
}

function AmazonSearchScreen({ navigation }: any) {
    return (
      <DashboardScreenStack.Navigator>
        <DashboardScreenStack.Screen 
          options={{ headerStyle: styles.headerMergedHeaders, headerLeft: () => (LeftDrawerButton()) }} 
          name="Amazon" 
          component={DashboardScreen} />
      </DashboardScreenStack.Navigator>
    );
}

const LinkedBankAccountsScreenStack = createStackNavigator();

function LinkedBankAccountsScreenNavigator({ navigation }: any) {
    return (
        <LinkedBankAccountsScreenStack.Navigator>
            <LinkedBankAccountsScreenStack.Screen 
                options={{ headerTitle: "Linked Bank Accounts", headerLeft: () => (LeftDrawerButton()) }} 
                name="Linked Bank Accounts" 
                component={LinkedBankAccountsScreen} />
        </LinkedBankAccountsScreenStack.Navigator>
    );
}

function CustomDrawerContent(props: any) {
    const { colors } = useTheme();

    return (
        <DrawerContentScrollView {...props}>
            <Animated.View style={[styles.container, { opacity: 1}]}>
                <View style={styles.viewLogo}>
                    <Image style={styles.logo} source={require('../assets/images/leaf-icon-small.png')}/>
                </View>
                <View style={styles.viewTitle}>
                    <SText style={styles.title}>Frugal</SText>
                </View>
            </Animated.View>
            <View style={styles.separator}/>
            <DrawerItem
                label="Settings"
                icon={({ focused, size }) => <Ionicons name="settings-outline" size={size} 
                    style={[focused ? { color: colors.primary } : { color: colors.backdrop }, styles.drawerIcon]}/>}
                onPress={() => {
                    props.navigation.dispatch(
                        CommonActions.reset({
                            routes: [{ name: 'Home' }]
                        })
                    );
                }}
            />
            <DrawerItem
                label="Log Out"
                icon={({ focused, size }) => <Ionicons name="log-out-outline" size={size} 
                    style={[focused ? { color: colors.primary } : { color: colors.backdrop }, styles.drawerIcon]}/>}
                onPress={() => {
                    AsyncStorage.removeItem("currentUser").then(() => {
                        props.navigation.dispatch(
                            CommonActions.reset({
                                routes: [{ name: 'Login' }]
                            })
                        );
                    });
                }}
            />
        </DrawerContentScrollView>
    );
}

const Drawer = createDrawerNavigator();

export default function LeftSideMenuDrawerNavigator() {
    const { colors } = useTheme();
    // const dispatch = useDispatch();
    // const { currentUser } = useSelector((state: any) => state.currentUser);
    // const [isStorageLoaded, setIsStorageLoaded] = React.useState(false);

    // if (currentUser != null) {
    //     RegisterRestInterceptor(currentUser.Id);
    // }
    // else {
    //     AsyncStorage.getItem('currentUser').then(
    //         (value: any) => {
    //             if (!isStorageLoaded) {
    //                 let valueJson = JSON.parse(value) as CurrentUserData;
    //                 dispatch(setCurrentUser(valueJson));
    //                 setIsStorageLoaded(true);
    //                 if (value != null) {
    //                     RegisterRestInterceptor((valueJson as CurrentUserData).Id);
    //                 }
    //             }
    //         }
    //     );
    // }
    
    // if (currentUser != null && currentUser.Id == '') { return null; }

    return (
        <Drawer.Navigator initialRouteName="RightSideMenuDrawer" drawerType="slide" drawerPosition="left" drawerContentOptions={{
            activeTintColor: colors.primary,
            inactiveTintColor: colors.backdrop,
            }} drawerContent={props => <CustomDrawerContent {...props} />}>
            <Drawer.Screen name="RightSideMenuDrawer" component={RightSideMenuDrawerNavigator} />
            {/* <Drawer.Screen name="Search" component={DashboardScreenNavigator} options={{ headerTitle: 'Dashboard', 
                drawerIcon: ({ focused, size }) => <Ionicons name="albums-outline" size={size} 
                    style={[focused ? { color: colors.primary } : { color: colors.backdrop }, styles.drawerIcon]}/>
            }}/>
            <Drawer.Screen name="Amazon" component={AmazonSearchScreen} options={{
                drawerLabel: () => <Image
                    style={styles.drawerLabelImage}
                    source={require('../resources/images/walmart-logo.png')}/>
            }} />
            <Drawer.Screen name="eBay" component={AmazonSearchScreen} options={{
                drawerIcon: ({ focused, size }) => <Ionicons name="logo-amazon" size={size} 
                    style={[focused ? { color: colors.primary } : { color: colors.backdrop }, styles.drawerIcon]}/>
            }} />
            <Drawer.Screen name="Walmart" component={AmazonSearchScreen} options={{
                drawerIcon: ({ focused, size }) => <Ionicons name="logo-amazon" size={size} 
                    style={[focused ? { color: colors.primary } : { color: colors.backdrop }, styles.drawerIcon]}/>
            }} /> */}
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