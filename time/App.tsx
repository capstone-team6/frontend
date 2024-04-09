import * as React from 'react';
import SignIn from './src/pages/SignIn';
import {Text, View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';

// import StackNav from './src/navigation/StackNavigator'

import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import BottmTabNavigation from './src/navigation/BottmTabNavigation'
import MapSearch from './src/pages/MapSearch';
import SignUp from './src/pages/SignUp';


function App() {
  const [isLoggedIn, setIsLoggedIn]=useState<boolean>(false)
  
  const handleLoginSuccess=()=>{
    setIsLoggedIn(true)
  }
  return (
      <NavigationContainer>    
        <SafeAreaView style={{flex:1}}>
          {/* {isLoggedIn?(
            <BottmTabNavigation/>
          ):(<SignIn onLoginSuccess={handleLoginSuccess}/>)}
           */}
          <SignUp/>
          
        </SafeAreaView>
      </NavigationContainer>
  );
}

export default App;
