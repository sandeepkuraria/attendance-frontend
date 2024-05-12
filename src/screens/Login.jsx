import React, { useContext } from 'react';
import { View, TextInput, Button, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const {
    loginApi,
    userId,
    setUserId,
    password,
    setPassword,
    isLoadingLocation,
    getLocationAndLogin,
  } = useContext(AuthContext);
  const navigation = useNavigation();

  const handleLogin = async () => {
    if (!userId || !password) {
      Alert.alert('Error', 'Please enter userId and password');
      return;
    }

    try {
      console.log('USERID : ',userId)
      console.log('PASSWORD : ',password)
      await getLocationAndLogin();
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={userId}
        onChangeText={text => setUserId(text)}
        placeholder="UserId"
        placeholderTextColor="#000000"
      />
      <TextInput
        style={styles.input}
        secureTextEntry
        value={password}
        onChangeText={text => setPassword(text)}
        placeholder="Password"
        placeholderTextColor="#000000"
      />
      {isLoadingLocation ? (
        <ActivityIndicator color="skyblue" />
      ) : (
        <Button title="Login" onPress={handleLogin} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  input: {
    width: '80%',
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
    color: '#000000',
  },
});

export default Login;

// ****************************************************************************************************

// import React, {useContext, useEffect, useState} from 'react';
// import {View, TextInput, Button, StyleSheet, Alert} from 'react-native';
// import {useNavigation} from '@react-navigation/native';
// import {AuthContext} from '../context/AuthContext';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// const Login = () => {
//   const {
//     token,
//     setToken,
//     loginApi,
//     // register,
//     // logout,
//     userId,
//     setUserId,
//     password,
//     setPassword,
//   } = useContext(AuthContext);
//   const navigation = useNavigation();



//   useEffect(() => {
//     console.log('userId in Login page +++++++++++', userId);
//     console.log('token in Login page +++++++++++', token);
//   }, []);

//   const handleLogin = async () => {
//     console.log('userId : ', userId);
//     console.log('Password : ', password);
//     if (!userId || !password) {
//       Alert.alert('Error', 'Please enter userId and password');
//       return;
//     }

//     try {
//       await loginApi();
//     } catch (error) {
//       Alert.alert('Error', error.message);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <TextInput
//         style={styles.input}
//         value={userId}
//         onChangeText={text => setUserId(text)}
//         placeholder="UserId"
//         placeholderTextColor={'#000000'}
//       />
//       <TextInput
//         style={styles.input}
//         secureTextEntry
//         value={password}
//         onChangeText={text => setPassword(text)}
//         placeholder="Password"
//         placeholderTextColor={'#000000'}
//       />
//       <Button title="Login" onPress={handleLogin} />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingHorizontal: 20,
//   },
//   input: {
//     width: '80%',
//     height: 40,
//     borderWidth: 1,
//     borderColor: '#ccc',
//     borderRadius: 5,
//     paddingHorizontal: 10,
//     marginBottom: 20,
//     color: '#000000',
//   },
// });

// export default Login;
