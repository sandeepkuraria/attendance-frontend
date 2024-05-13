import React, { createContext, useState, useEffect } from 'react';
import { Alert, PermissionsAndroid, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import Geolocation from '@react-native-community/geolocation';

const AuthContext = createContext();

const AuthContextProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    checkLoginStatus();
    requestLocationPermission();
  }, []);

 const checkLoginStatus = async () => {
  try {
    const storedToken = await AsyncStorage.getItem('token');
    const storedUserId = await AsyncStorage.getItem('userId');
    console.log('Stored token in Auth Context:', storedToken);
    console.log('Stored userId in Auth Context:', storedUserId);
    if (storedToken && storedUserId) {
      setUserId(storedUserId);
      setToken(storedToken);
      navigation.navigate('Home'); // Navigate to Home Screen if token and user ID exist
    } else {
      // Clear userId and token states if they exist in AsyncStorage
      setUserId('');
      setToken(null);
      navigation.navigate('Login'); // Navigate to Login Screen if token or user ID doesn't exist
    }
  } catch (error) {
    console.error('Error fetching token:', error);
  }
};

  

  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message:
              'This app needs access to your location to function properly.',
            buttonPositive: 'OK',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Location permission granted');
        } else {
          console.log('Location permission denied');
          const neverAskAgain = await PermissionsAndroid.check(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          );
          if (neverAskAgain) {
            Alert.alert(
              'Location Permission Required',
              'Please grant location permission in app settings to continue.',
              [
                {
                  text: 'Cancel',
                  onPress: () => console.log('Cancel Pressed'),
                  style: 'cancel',
                },
                {
                  text: 'Open Settings',
                  onPress: () => Linking.openSettings(),
                },
              ],
              { cancelable: false },
            );
          }
        }
      } catch (err) {
        console.warn(err);
      }
    }
  };

  const getLocationAndLogin = async () => {
    setIsLoadingLocation(true);
    try {
      Geolocation.getCurrentPosition(
        async position => {
          const { latitude, longitude } = position.coords;
          await loginApi(latitude, longitude);
        },
        error => {
          setIsLoadingLocation(false);
          console.error('Error getting location:', error);
          Alert.alert('Error', 'Failed to get user location.');
        },
        { enableHighAccuracy: false, timeout: 10000, maximumAge: 1000 },
      );
    } catch (error) {
      setIsLoadingLocation(false);
      Alert.alert('Error', 'Failed to get user location. Please try again.');
      console.error('Error in getLocationAndLogin:', error);
    }
  };

  const loginApi = async (latitude, longitude) => {
    try {
      const raw = JSON.stringify({
        userId: userId,
        password: password,
        latitude: latitude,
        longitude: longitude,
      });

      const requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: raw,
        redirect: 'follow',
      };

      const response = await fetch('https://attendance-api-theta.vercel.app/auth/login', requestOptions);
      const data = await response.json();

      if (response.ok) {
        console.log('Login successful, token:', data.token);
        await AsyncStorage.setItem('token', data.token);
        setToken(data.token);
        console.log('Token stored in AsyncStorage');
  
        await AsyncStorage.setItem('userId', data.userId);
        setUserId(data.userId);
        console.log('UserId stored in AsyncStorage');
  
        navigation.navigate('Home');
      } else{
        Alert.alert('Error', data.message);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to login. Please try again.');
      console.error('Error in loginApi:', error);
    } finally {
      setIsLoadingLocation(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        setToken,
        loginApi,
        userId,
        setUserId,
        password,
        setPassword,
        getLocationAndLogin,
        isLoadingLocation,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContextProvider, AuthContext };
