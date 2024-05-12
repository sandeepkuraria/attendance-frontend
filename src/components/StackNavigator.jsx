import React, { useEffect, useState } from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import Login from '../screens/Login';
import Home from '../screens/Home';
import {AuthContextProvider} from '../context/AuthContext';
import {HomeScreenContextProvider} from '../context/HomeScreenContext';
import DoctorList from '../screens/DoctorList';
import Expense from '../screens/Expense';
import Leaves from '../screens/Leaves';
import Meet from '../screens/Meet';
import AsyncStorage from '@react-native-async-storage/async-storage';
import InitialScreen from './InitialScreen';

const Stack = createStackNavigator();

const StackNavigator = () => {
  // const [initialRoute, setInitialRoute] = useState('Login');

  // useEffect(() => {
  //   const checkLoginStatus = async () => {
  //     const token = await AsyncStorage.getItem('token');
  //     setInitialRoute(token ? 'Home' : 'Login');
  //   };

  //   checkLoginStatus();
  // }, []);

  return (
    <NavigationContainer>
      <AuthContextProvider>
        <HomeScreenContextProvider>
          <Stack.Navigator initialRouteName="Initial">
          {/* <Stack.Navigator > */}
          <Stack.Screen name="Initial" component={InitialScreen} options={{ headerShown: false }} />
            <Stack.Screen
              name="Login"
              component={Login}
              options={{headerShown: false, gestureEnabled: false}}
            />
            <Stack.Screen
              name="Home"
              component={Home}
              options={{headerShown: false, gestureEnabled: false}}
            />
            <Stack.Screen
              name="DoctorList"
              component={DoctorList}
              options={{headerShown: false, gestureEnabled: false}}
            />
            <Stack.Screen
              name="Expense"
              component={Expense}
              options={{headerShown: false, gestureEnabled: false}}
            />
            <Stack.Screen
              name="Leaves"
              component={Leaves}
              options={{headerShown: false, gestureEnabled: false}}
            />
            <Stack.Screen
              name="Meet"
              component={Meet}
              options={{headerShown: false, gestureEnabled: false}}
            />
          </Stack.Navigator>
        </HomeScreenContextProvider>
      </AuthContextProvider>
    </NavigationContainer>
  );
};

export default StackNavigator;
