
import * as React from 'react';
import SignIn from './src/pages/SignIn'
import { View } from 'react-native';
import Main from './src/pages/Main';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import StyleSheet from 'styled-components/dist/sheet/Sheet';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import Mypage from './src/pages/Mypage';
import Nav from './src/navigation/BottmTabNavigation';


// const Stack=createStackNavigator()
// const Tab=createBottomTabNavigator()

function App() {
  return (
      <NavigationContainer>    
        <Nav/>
      </NavigationContainer>
  );
}


export default App;