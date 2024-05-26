import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect, useState } from 'react';
import BottmTabNavigation from './src/navigation/BottmTabNavigation'
import StackNavigator from './src/navigation/StackNavigator';
import AsyncStorage from '@react-native-async-storage/async-storage';
import  RNEventSource from 'react-native-event-source';
import PushNotification from 'react-native-push-notification';
import { Provider } from 'react-redux';
import store from './src/redux/store';

function App() {
  const [isLoggedIn, setIsLoggedIn]=useState<boolean>(false)
  const [showPopup, setShowPopup] = useState(false);
  const handleLoginSuccess=()=>{
    setIsLoggedIn(true)
  }

  useEffect(()=>{
    if(isLoggedIn){
      PushNotification.createChannel(
        {
          channelId: 'default-channel-id', 
          channelName: 'Default Channel', 
          channelDescription: 'A default channel for notifications', 
          playSound: true, 
          soundName: 'default', 
          importance: 4, 
          vibrate: true, 
        },
        (created) => console.log(`Channel created: ${created ? 'yes' : 'no'}`),
      );
      try{
        AsyncStorage.getItem('accessToken').then(item=>{
          const token=item?JSON.parse(item):null
          const option={
            method: 'GET',
            headers:{ Authorization: `Bearer ${token}`},
            
          }
          const eventSource=new RNEventSource('http://13.125.118.92:8080/api/notification/subscribe',option)
        
          console.log('SSE 연결을 시도합니다.');
          eventSource.addEventListener('connect', (event: any) => {
            const { data } = event
            if (data === 'connected!') {
              console.log('서버로부터 연결 확인 이벤트를 수신했습니다.');
            }
              
          })
          eventSource.addEventListener('error', (error: any) => {
            console.error('SSE 연결 중 오류가 발생했습니다.', error);
            eventSource.close();
          });
      
          eventSource.addEventListener('keywordNotification', (event: any) => {
            console.log('키워드 알림', event.data);
            const eventData = JSON.parse(event.data)
            PushNotification.localNotification({
              channelId: 'default-channel-id', 
              title: '당신이 찾던 게시글!',
              message: `${eventData.keyword} - ${eventData.title}`,
            });
          });
          eventSource.addEventListener('transactionComplete', (event: any) => {
            console.log('거래 완료 알림', event.data);
            const eventData = JSON.parse(event.data)
            PushNotification.localNotification({
              channelId: 'default-channel-id', 
              title: '💵 틈새 시간 거래 완료 ⌛️',
              message: `${eventData.traderName}님과의 거래가 완료되었습니다.`,
            });
          });
          eventSource.addEventListener('notReedChatNumberNotification', (event: any) => {
            console.log('채팅 알림:', event.data);
            const eventData = JSON.parse(event.data)
            if (eventData.writer && eventData.message) {
              console.log('이벤트 데이터 작성자:', eventData.writer);
              console.log('이벤트 데이터 메시지:', eventData.message);
            } 
            PushNotification.localNotification({
              channelId: 'default-channel-id', 
              title: eventData.writer,
              message: eventData.message,
            });
          });
          eventSource.addEventListener('scarpNotification', (event: any) => {
            console.log('스크랩 알림', event.data);
            const eventData = JSON.parse(event.data)
            PushNotification.localNotification({
              channelId: 'default-channel-id', 
              title: '좋아해요...💗',
              message: `${eventData.nickname}님이 '${eventData.title}' 게시글을 좋아해요`,
            });
          });
          return () => {
            eventSource.close();
          };
      
        })
      }
      catch(error){
        console.log('오류 발생',error)
      }
    }
  },[isLoggedIn])
  return (
      <Provider store={store}>
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
      </Provider>
  );
}

export default App;
