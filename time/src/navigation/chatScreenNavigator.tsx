import {createStackNavigator} from '@react-navigation/stack';
import {RootStackParamList} from '../../types/Type';
import React from 'react';
import ChatScreen from '../pages/ChatScreen';
import Profile from '../pages/Profile';
import AccountEnter from '../pages/AccountEnter';
import AppealWrite from '../pages/AppealWrite';
import AccountCheck from '../pages/AccountCheck';

const Stack = createStackNavigator<RootStackParamList>();
const chatScreenNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ChatScreen"
        component={ChatScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Profile"
        component={Profile}
        options={{
          headerTitle: '상대방의 프로필',
          headerTitleStyle: {
            fontFamily: 'NanumGothic-Bold',
            fontSize: 28,
          },
        }}
      />
      <Stack.Screen
        name="AccountEnter"
        component={AccountEnter}
        options={{
          headerTitle: '계좌 입력',
          headerTitleStyle: {
            fontFamily: 'NanumGothic-Bold',
            fontSize: 28,
          },
        }}
      />
      <Stack.Screen
        name="AccountCheck"
        component={AccountCheck}
        options={{
          headerTitle: '계좌 정보',
          headerTitleStyle: {
            fontFamily: 'NanumGothic-Bold',
            fontSize: 28,
          },
        }}
      />
      <Stack.Screen
        name="AppealWrite"
        component={AppealWrite}
        options={{
          headerTitle: 'AppealWrite',
          headerTitleStyle: {
            fontFamily: 'NanumGothic-Bold',
            fontSize: 28,
          },
        }}
      />
    </Stack.Navigator>
  );
};
export default chatScreenNavigator;
