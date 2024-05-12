import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import React from 'react';

const DoctorList = ({navigation}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.TextColor}>DoctorList</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.goBack()}>
        <Text style={styles.buttonText}>Home</Text>
      </TouchableOpacity>
    </View>
  );
};

export default DoctorList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    marginTop: 20,
    padding: 10,
    backgroundColor: 'blue',
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
  TextColor: {
    color: 'green',
    fontSize: 25,
  },
});
