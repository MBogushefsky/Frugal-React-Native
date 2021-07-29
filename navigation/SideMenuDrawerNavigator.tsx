import * as React from 'react';
import { View, Image, Animated } from 'react-native';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem, DrawerItemList } from '@react-navigation/drawer';
import DashboardScreen from '../screens/DashboardScreen';
import { createStackNavigator } from '@react-navigation/stack';
import SideMenuDrawerButton from './SideMenuDrawerButton';
import { StyleSheet } from 'react-native';
import { SText } from '../components/StyledComponents';
import { Ionicons } from '@expo/vector-icons';
import Ionicon from 'react-native-vector-icons/Ionicons';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from 'react-native-paper';
import LinkedBankAccountsScreen from '../screens/LinkedBankAccountsScreen';
import { CommonActions } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentUser } from '../redux/Reducers';
import RegisterRestInterceptor from '../interceptors/RestInterceptor';
import CurrentUserData from '../models/CurrentUserData';

const DashboardScreenStack = createStackNavigator();

function DashboardScreenNavigator({ navigation }: any) {
  return (
    <DashboardScreenStack.Navigator>
      <DashboardScreenStack.Screen 
        options={{ headerTitle: "Dashboard", headerLeft: () => (SideMenuDrawerButton(navigation)) }} 
        name="Dashboard" 
        component={DashboardScreen} />
    </DashboardScreenStack.Navigator>
  );
}

function CheckingsScreen({ navigation }: any) {
    return (
      <DashboardScreenStack.Navigator>
        <DashboardScreenStack.Screen 
          options={{ headerTitle: "Checkings", headerLeft: () => (SideMenuDrawerButton(navigation)) }} 
          name="Checkings" 
          component={DashboardScreen} />
      </DashboardScreenStack.Navigator>
    );
}

function ReoccurringScreen({ navigation }: any) {
    return (
      <DashboardScreenStack.Navigator>
        <DashboardScreenStack.Screen 
          options={{ headerTitle: "Reoccurring", headerLeft: () => (SideMenuDrawerButton(navigation)) }} 
          name="Reoccurring" 
          component={DashboardScreen} />
      </DashboardScreenStack.Navigator>
    );
}

function SavingsScreen({ navigation }: any) {
    return (
      <DashboardScreenStack.Navigator>
        <DashboardScreenStack.Screen 
          options={{ headerTitle: "Savings", headerLeft: () => (SideMenuDrawerButton(navigation)) }} 
          name="Savings" 
          component={DashboardScreen} />
      </DashboardScreenStack.Navigator>
    );
}

function CreditCardsScreen({ navigation }: any) {
    return (
        <DashboardScreenStack.Navigator>
            <DashboardScreenStack.Screen 
                options={{ headerTitle: "Credit Cards", headerLeft: () => (SideMenuDrawerButton(navigation)) }} 
                name="Credit Cards" 
                component={DashboardScreen} />
        </DashboardScreenStack.Navigator>
    );
}

function InvestingScreen({ navigation }: any) {
    return (
        <DashboardScreenStack.Navigator>
            <DashboardScreenStack.Screen 
                options={{ headerTitle: "Investing", headerLeft: () => (SideMenuDrawerButton(navigation)) }} 
                name="Investing" 
                component={DashboardScreen} />
        </DashboardScreenStack.Navigator>
    );
}

function CustomizeScreen({ navigation }: any) {
    return (
        <DashboardScreenStack.Navigator>
            <DashboardScreenStack.Screen 
                options={{ headerTitle: "Customize", headerLeft: () => (SideMenuDrawerButton(navigation)) }} 
                name="Customize" 
                component={DashboardScreen} />
        </DashboardScreenStack.Navigator>
    );
}

const LinkedBankAccountsScreenStack = createStackNavigator();

function LinkedBankAccountsScreenNavigator({ navigation }: any) {
    return (
        <LinkedBankAccountsScreenStack.Navigator>
            <LinkedBankAccountsScreenStack.Screen 
                options={{ headerTitle: "Linked Bank Accounts", headerLeft: () => (SideMenuDrawerButton(navigation)) }} 
                name="Linked Bank Accounts" 
                component={LinkedBankAccountsScreen} />
        </LinkedBankAccountsScreenStack.Navigator>
    );
}

function CustomDrawerContent(props: any) {
    const fadeAnim = React.useRef(new Animated.Value(0)).current;

    React.useEffect(() => {
        Animated.timing(
          fadeAnim,
          {
            toValue: 1,
            duration: 10000,
            useNativeDriver: true
          }
        ).start();
    }, [fadeAnim]);


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
            <DrawerItemList {...props} />
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

export default function SideMenuDrawerNavigator() {
    const { colors } = useTheme();
    const dispatch = useDispatch();
    const { currentUser } = useSelector((state: any) => state.currentUser);
    const [isStorageLoaded, setIsStorageLoaded] = React.useState(false);

    if (currentUser != null) {
        RegisterRestInterceptor(currentUser.Id);
    }
    else {
        AsyncStorage.getItem('currentUser').then(
            (value: any) => {
                if (!isStorageLoaded) {
                    let valueJson = JSON.parse(value) as CurrentUserData;
                    dispatch(setCurrentUser(valueJson));
                    setIsStorageLoaded(true);
                    if (value != null) {
                        RegisterRestInterceptor((valueJson as CurrentUserData).Id);
                    }
                }
            }
        );
    }
    
    if (currentUser != null && currentUser.Id == '') { return null; }

    return (
        <Drawer.Navigator initialRouteName="Home" drawerType="slide" drawerContentOptions={{
            activeTintColor: colors.primary,
            inactiveTintColor: colors.backdrop,
            }} drawerContent={props => <CustomDrawerContent {...props} />}>
            <Drawer.Screen name="Dashboard" component={DashboardScreenNavigator} options={{ headerTitle: 'Dashboard', 
                drawerIcon: ({ focused, size }) => <Ionicons name="albums-outline" size={size} 
                    style={[focused ? { color: colors.primary } : { color: colors.backdrop }, styles.drawerIcon]}/>
            }}/>
            <Drawer.Screen name="Checkings" component={CheckingsScreen} options={{
                drawerIcon: ({ focused, size }) => <Ionicons name="cash-outline" size={size} 
                    style={[focused ? { color: colors.primary } : { color: colors.backdrop }, styles.drawerIcon]}/>
            }} />
            <Drawer.Screen name="Reoccurring" component={ReoccurringScreen} options={{
                drawerIcon: ({ focused, size }) => <Ionicons name="reload-circle-outline" size={size} 
                    style={[focused ? { color: colors.primary } : { color: colors.backdrop }, styles.drawerIcon]}/>
            }} />
            <Drawer.Screen name="Savings" component={SavingsScreen} options={{
                drawerIcon: ({ focused, size }) => <Ionicons name="card-outline" size={size} 
                    style={[focused ? { color: colors.primary } : { color: colors.backdrop }, styles.drawerIcon]}/>
            }} />
            <Drawer.Screen name="Credit Cards" component={CreditCardsScreen} options={{
                drawerIcon: ({ focused, size }) => <Ionicons name="card-outline" size={size} 
                    style={[focused ? { color: colors.primary } : { color: colors.backdrop }, styles.drawerIcon]}/>
            }} />
            <Drawer.Screen name="Investing" component={InvestingScreen} options={{
                drawerIcon: ({ focused, size }) => <Ionicons name="trending-up-outline" size={size} 
                    style={[focused ? { color: colors.primary } : { color: colors.backdrop }, styles.drawerIcon]}/>
            }} />
            <Drawer.Screen name="Learning and Advisory" component={InvestingScreen} options={{
                drawerIcon: ({ focused, size }) => <Ionicons name="library-outline" size={size} 
                    style={[focused ? { color: colors.primary } : { color: colors.backdrop }, styles.drawerIcon]}/>
            }} />
            <Drawer.Screen name="Linked Bank Accounts" component={LinkedBankAccountsScreenNavigator} options={{
                drawerIcon: ({ focused, size }) => <Ionicons name="link-outline" size={size} 
                    style={[focused ? { color: colors.primary } : { color: colors.backdrop }, styles.drawerIcon]}/>
            }} />
            <Drawer.Screen name="Customize" component={CustomizeScreen} options={{
                drawerIcon: ({ focused, size }) => <Ionicons name="construct-outline" size={size} 
                    style={[focused ? { color: colors.primary } : { color: colors.backdrop }, styles.drawerIcon]}/>
            }} />
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
    }
  });