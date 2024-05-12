import React from 'react';
import {TouchableOpacity, Text, StyleSheet} from 'react-native';

const NeumorphicButton = ({onPress, title}) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.button}>
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 10,
    backgroundColor: '#e0e0e0', // Background color
    shadowColor: '#bfbfbf', // Shadow color
    shadowOffset: {
      width: 5,
      height: 5,
    },
    shadowOpacity: 0.5, // Shadow opacity
    shadowRadius: 10,
    elevation: 5, // Elevation for Android shadow
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333', // Text color
  },
});

export default NeumorphicButton;
