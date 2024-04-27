import * as React from 'react';
import PropTypes from 'prop-types';
import SignIn from './src/pages/SignIn';
import {Text, View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';

// import StackNav from './src/navigation/StackNavigator'

import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import BottmTabNavigation from './src/navigation/BottmTabNavigation'
// import MapSearch from './src/pages/MapSearch';
import SignUp from './src/pages/SignUp';
import MapSearch from './src/pages/MapSearch';
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { Header, createStackNavigator } from '@react-navigation/stack';
import StackNavigator from './src/navigation/StackNavigator';
// import StackNavigator from './src/navigation/StackNavigator';



function App() {
  const [isLoggedIn, setIsLoggedIn]=useState<boolean>(false)
  
  const handleLoginSuccess=()=>{
    setIsLoggedIn(true)
  }
  return (
      <NavigationContainer independent={true}>    
        <SafeAreaView style={{flex:1}}>
          {/* {isLoggedIn?(
            <BottmTabNavigation/>
          ):(<SignIn onLoginSuccess={handleLoginSuccess}/>)} */}
          
          {/* {isLoggedIn?(<BottmTabNavigation/>):(<StackNavigator onLoginSuccess={handleLoginSuccess}/>)} */}
          {/* <SignUp/> */}
          <BottmTabNavigation/>
          {/* <MapSearch/> */}
        </SafeAreaView>
      </NavigationContainer>
  );
}

export default App;
