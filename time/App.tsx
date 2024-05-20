import * as React from 'react';
import PropTypes from 'prop-types';
import SignIn from './src/pages/SignIn';
import {Text, View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';

// import StackNav from './src/navigation/StackNavigator'

import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect, useState } from 'react';
import BottmTabNavigation from './src/navigation/BottmTabNavigation'
// import MapSearch from './src/pages/MapSearch';
import SignUp from './src/pages/SignUp';
import MapSearch from './src/pages/MapSearch';
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { Header, createStackNavigator } from '@react-navigation/stack';
import StackNavigator from './src/navigation/StackNavigator';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import StackNavigator from './src/navigation/StackNavigator';
import   EventSource  from 'react-native-event-source';


function App() {
  const [isLoggedIn, setIsLoggedIn]=useState<boolean>(false)
  const [showPopup, setShowPopup] = useState(false);
  const handleLoginSuccess=()=>{
    setIsLoggedIn(true)
  }
  
  useEffect(()=>{
    if(isLoggedIn){
      try{
        AsyncStorage.getItem('accessToken').then(item=>{
          const token=item?JSON.parse(item):null
          const eventSource=new  EventSource('http://13.125.118.92:8080/api/notification/subscribe',{
            headers:{
              Authorization: `Bearer ${token}`,
            }
          })
          console.log(eventSource)
          eventSource.addEventListener('connect', (event:any) => {
            console.log('SSE 연결이 열렸습니다.');
          });
      
          eventSource.addEventListener('error', (error: any) => {
            console.error('SSE 연결 중 오류가 발생했습니다.', error);
            eventSource.close();
          });
      
          eventSource.addEventListener('keywordNotification', (event: any) => {
            console.log('새로운 이벤트를 받았습니다:', event.data);
          });
          eventSource.addEventListener('transactionComplete', (event: any) => {
            console.log('새로운 이벤트를 받았습니다:', event.data);
          });
          eventSource.addEventListener('noReadChatNumber', (event: any) => {
            console.log('새로운 이벤트를 받았습니다:', event.data);
          });
          eventSource.addEventListener('scrapNotification', (event: any) => {
            console.log('새로운 이벤트를 받았습니다:', event.data);
          });
          eventSource.addEventListener('connect', (event: any) => {
            const { data } = event
            if (data === 'connected!') {
              console.log('서버로부터 연결 확인 이벤트를 수신했습니다.');
            }
              
          })
          return () => {
            eventSource.close();
          };
      
        })
      }
      catch(error){
        console.log(error)
      }
    }
  },[isLoggedIn])
  return (
      <NavigationContainer independent={true}>    
        <SafeAreaView style={{flex:1}}>
          {/* {isLoggedIn?(
            <BottmTabNavigation/>
          ):(<SignIn onLoginSuccess={handleLoginSuccess}/>)} */}
          
          {isLoggedIn?(<BottmTabNavigation/>):(<StackNavigator onLoginSuccess={handleLoginSuccess}/>)}
          {/* <SignUp/> */}
          {/* <BottmTabNavigation/> */}
          {/* <MapSearch/> */}
        </SafeAreaView>
      </NavigationContainer>
  );
}

export default App;
