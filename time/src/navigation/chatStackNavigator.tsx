import {useNavigation} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import Chatting from '../pages/Chatting';
import ChatScreen from '../pages/ChatScreen';
import {RootStackParamList} from '../../types/Type';
import {RotationGestureHandlerStateChangeEvent} from 'react-native-gesture-handler';
import React from 'react';
const Stack = createStackNavigator<RootStackParamList>();

const ChatStackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Chatting"
        component={Chatting}
        options={{
          headerTitle: '채팅',
          headerTitleStyle: {
            fontFamily: 'NanumGothic-Bold',
            fontSize: 25,
            color: 'black',
          },
          headerStyle: {
            height: 100,
          },
        }}
      />
      <Stack.Screen
        name="ChatScreen"
        component={ChatScreen}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};
export default ChatStackNavigator;
