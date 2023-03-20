import React,{useEffect} from 'react'
import {Text,View,Button,StyleSheet,StatusBar} from 'react-native'
import HomeScreen from './components/HomeScreen'
import DayScreen from './components/DayScreen'
import Addtime from './components/Addtime'
import {NavigationContainer} from '@react-navigation/native'
import {createNativeStackNavigator} from '@react-navigation/native-stack'
import EachDayTiming from './components/EachDayTiming'


const Stack=createNativeStackNavigator()
function App(){
  return(
   
    <NavigationContainer>
    <Stack.Navigator screenOptions={{headerShown: false}}>

    <Stack.Screen name="HomeScreen" component={HomeScreen}></Stack.Screen>
      <Stack.Screen name="DayScreen" component={DayScreen}></Stack.Screen>
      <Stack.Screen name="EachDayTiming" component={EachDayTiming}></Stack.Screen>
      <Stack.Screen name="Addtime" component={Addtime}></Stack.Screen>     
    </Stack.Navigator>
    </NavigationContainer>
  )
}

export default App



