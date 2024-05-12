import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'
import React from 'react'

const InitialScreen = ({ navigation }) => {
  return (
    <View style={styles.initialScreen}>
        
    <View >
      <ActivityIndicator size="large" color="green" />
      
    </View>
    <Text style={styles.text}>Welcome Back!</Text>
    </View>
  )
}

export default InitialScreen

const styles = StyleSheet.create({
    initialScreen:{flex:1, justifyContent:'center', alignItems:'center'},
    text: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'green',
      },
})