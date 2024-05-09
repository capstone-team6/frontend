import {useNavigation} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import Chatting from '../pages/Chatting';
import ChatScreen from '../pages/ChatScreen';
import {RootStackParamList} from '../../types/Type';
import {RotationGestureHandlerStateChangeEvent} from 'react-native-gesture-handler';
import React, { useState } from 'react';
import Main from '../pages/Main';
import PostDetail from '../pages/PostDetail';
import {View} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Posting from '../pages/Posting';
import BottmTabNavigation from './BottmTabNavigation';
import SignIn from '../pages/SignIn';
import App from '../../App';
import LocationSearch from '../pages/LocationSearch';

const Stack = createStackNavigator<RootStackParamList>();

const postStackNavigator = () => {
  const [dataToMain, setDataToMain]=useState<any>()
  const sendDataToParent=(data:any)=>{
    console.log(data)
    setDataToMain(data)
}

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="틈새시장"
        component={Main}
        // initialParams={{dataFromParent:dataToMain}}
        initialParams={{
          dataFromParent: dataToMain
        }}
        options={{
          headerTitleStyle: {
            color: '#352456',
            fontFamily: 'Gugi-Regular',
            fontSize: 40,
            paddingTop: 30,
            marginHorizontal: 10,
            height: 70,
          },

          headerRight: () => (
            <View style={{flexDirection: 'row', paddingTop: 10}}>
              <Feather
                name="search"
                size={25}
                style={{marginRight: 25, color: 'black'}}
              />
              <Ionicons
                name="notifications-outline"
                size={25}
                style={{marginRight: 30, color: 'black'}}
              />
            </View>
          ),
        }}
      ></Stack.Screen>
      <Stack.Screen name="PostDetail" component={PostDetail} options={{
        headerTransparent:true,
        headerTitle:''
      }}/>
      <Stack.Screen name="App" component={App}/>

      <Stack.Screen name='LocationSearch' 
      
      options={{
        
        headerTitle:'위치 재설정',
        headerTitleStyle: {
          fontFamily: 'NanumGothic-Bold',
          fontSize: 28,
        },
      }}
      
      >{(props: any) => <LocationSearch {...props} sendDataToParent={sendDataToParent} />}</Stack.Screen>
      
    </Stack.Navigator>
  );
};
export default postStackNavigator;
