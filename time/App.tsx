import * as React from 'react';
import SignIn from './src/pages/SignIn';
import {Text, View} from 'react-native';
import Main from './src/pages/Main';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Mypage from './src/pages/Mypage';
import Nav from './src/navigation/BottmTabNavigation';
// import StackNav from './src/navigation/StackNavigator'
import myBuyTime from './src/pages/MyBuyTime';
import Profile from './src/pages/Profile';
import Notify from './src/pages/Notify';
import { SafeAreaView } from 'react-native-safe-area-context';

function App() {
  return (
      <NavigationContainer>    
        <SafeAreaView style={{flex:1}}>
          <Nav/>
        </SafeAreaView>
      </NavigationContainer>
  );
}

export default App;
