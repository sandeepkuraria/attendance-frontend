import React, { useState, useEffect, useContext } from 'react';
import { View, Text, BackHandler, Alert, TouchableOpacity, ActivityIndicator } from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../context/AuthContext';
import { HomeScreenContext } from '../context/HomeScreenContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeScreen = () => {
  const [trackingInterval, setTrackingInterval] = useState(null);
  const [location, setLocation] = useState(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);
  const { userId, token, setToken, setUserId, setPassword } = useContext(AuthContext);
  const { homeApi } = useContext(HomeScreenContext);
  const navigation = useNavigation();

  const saveLocationToDatabase = async () => {
    try {
      Geolocation.getCurrentPosition(
        async position => {
          const { latitude, longitude } = position.coords;
          console.log('Current Location:', latitude, longitude);

          try {
            // Call the API to save location data
            await homeApi(latitude, longitude);
            setLocation({ latitude, longitude });
            setIsLoadingLocation(false); // Set loading to false when location data is fetched
          } catch (error) {
            console.error('Failed to save location data:', error);
            Alert.alert(
              'Error',
              'Failed to save location data. Please try again.',
            );
          }
        },
        error => {
          setIsLoadingLocation(false); // Set loading to false if there's an error
          console.error('Error getting location:', error);
          Alert.alert('Error', 'Failed to get user location.');
        },
        { enableHighAccuracy: false, timeout: 60000, maximumAge: 1000 },
      );
    } catch (error) {
      setIsLoadingLocation(false); // Set loading to false if there's an error
      console.error('An error occurred:', error);
      Alert.alert('Error', 'Failed to retrieve location or save data.');
    }
  };

  const startLocationTracking = () => {
    const intervalId = setInterval(saveLocationToDatabase, 60000);
    setTrackingInterval(intervalId);
  };

  useEffect(() => {
    startLocationTracking();

    return () => {
      if (trackingInterval) {
        clearInterval(trackingInterval);
      }
    };
  }, []);

  useEffect(() => {
    const backAction = () => {
      BackHandler.exitApp();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);

  const handleLogout = async () => {
    console.log(
      'Logout pressed ..........................................................................................',
    );
    if (trackingInterval) {
      clearInterval(trackingInterval);
    }
    try {
      // Remove token from AsyncStorage
    await AsyncStorage.removeItem('token');
    // Remove userId from AsyncStorage
    await AsyncStorage.removeItem('userId');

    // Log AsyncStorage items to verify removal
    const token = await AsyncStorage.getItem('token');
    const userId = await AsyncStorage.getItem('userId');
    console.log('Token after logout:', token);
    console.log('UserId after logout:', userId);

 // Replace Home screen with Login screen
 navigation.replace('Login');
    } catch (error) {
      console.error('Error removing token from AsyncStorage:', error);
    }
  };

  const navigateToDoctorList = () => {
    navigation.navigate('DoctorList');
  };

  const navigateToExpense = () => {
    navigation.navigate('Expense');
  };

  const navigateToLeaves = () => {
    navigation.navigate('Leaves');
  };

  const navigateToMeet = () => {
    navigation.navigate('Meet');
  };

  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingHorizontal: 20,
          paddingTop: 20,
        }}>
        <Text style={styles.userId}>User: {userId}</Text>
        <TouchableOpacity onPress={handleLogout}>
          <View>
            <Text style={{ color: 'red' }}>Logout</Text>
          </View>
        </TouchableOpacity>
      </View>
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'row',
          marginTop: 20,
        }}>
        <TouchableOpacity
          style={[styles.card, { backgroundColor: 'red' }]}
          onPress={navigateToDoctorList}>
          <Text style={styles.cardText}>Doctor List</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.card, { backgroundColor: 'blue' }]}
          onPress={navigateToExpense}>
          <Text style={styles.cardText}>Expense</Text>
        </TouchableOpacity>
      </View>
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'row',
          marginTop: 20,
        }}>
        <TouchableOpacity
          style={[styles.card, { backgroundColor: 'green' }]}
          onPress={navigateToLeaves}>
          <Text style={styles.cardText}>Leaves</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.card, { backgroundColor: 'pink' }]}
          onPress={navigateToMeet}>
          <Text style={styles.cardText}>Meet</Text>
        </TouchableOpacity>
      </View>
      <View style={{ paddingHorizontal: 20, paddingBottom: 20 }}>
        <Text style={styles.title}>Real-Time Location</Text>
        {isLoadingLocation ? ( // Show loading indicator while location is being fetched
          <ActivityIndicator color="skyblue" />
        ) : (
          <View>
            <Text style={styles.locationText}>
              Latitude: {location ? location.latitude.toFixed(2) : 'Loading...'}
            </Text>
            <Text style={styles.locationText}>
              Longitude: {location ? location.longitude.toFixed(2) : 'Loading...'}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = {
  userId: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'green',
  },
  card: {
    width: 150,
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
    borderRadius: 10,
  },
  cardText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#000000',
  },
  locationText: {
    color: '#000000',
    fontSize: 16,
    marginBottom: 5,
  },
};

export default HomeScreen;
