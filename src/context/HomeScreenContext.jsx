import React, {createContext, useState, useEffect, useContext} from 'react';
import {Alert, PermissionsAndroid, Platform, Linking} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import {AuthContext} from './AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeScreenContext = createContext();

const HomeScreenContextProvider = ({children}) => {
  const [location, setLocation] = useState(null);
  const {userId, token} = useContext(AuthContext);

  useEffect(() => {
    requestLocationPermission();
  }, []);

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
          getCurrentLocation();
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
              {cancelable: false},
            );
          }
        }
      } catch (err) {
        console.warn(err);
        Alert.alert('Error', 'Failed to request location permission.');
      }
    }
  };

  const getCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      position => {
        const {latitude, longitude} = position.coords;
        console.log('Current Locationnnn in HomeScreenContext:', latitude, longitude);
        setLocation({latitude, longitude});
      },
      error => {
        console.error('Error getting location:', error);
        Alert.alert('Error', 'Failed to get user location.');
      },
      {enableHighAccuracy: false, timeout: 60000, maximumAge: 1000},
    );
  };

  const homeApi = async (latitude, longitude) => {
    try {
      // console.log('Sending location with userId:', userId, latitude, longitude);
      // console.log(
      //   'token inside fetch homeApi from authContext +++++++++++=====',
      //   token,
      // );

      const response = await fetch('https://attendance-api-theta.vercel.app/location', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          latitude,
          longitude,
        }),
      });
      const storedUserId = await AsyncStorage.getItem('userId');
      // console.log(
      //   'storedUserId in HomeScreenContext ++++++++++++',
      //   storedUserId,
      // );

      if (!response.ok) {
        // console.log('response nahi araha:', response.ok);
        console.error('Failed to save location datttta:', response);
        Alert.alert('Error', 'Failed to save location data.');
      } else {
        console.log('Location data saved successfully');
      }
    } catch (error) {
      console.error('Error saving location data:', error.message);
      // Alert.alert('Error', 'Failed to save location data.');
    }
  };

  return (
    <HomeScreenContext.Provider value={{location, homeApi}}>
      {children}
    </HomeScreenContext.Provider>
  );
};

export {HomeScreenContextProvider, HomeScreenContext};
