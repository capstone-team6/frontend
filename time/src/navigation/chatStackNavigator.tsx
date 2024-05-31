import {useNavigation} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import Chatting from '../pages/Chatting';
import ChatScreen from '../pages/ChatScreen';
import {RootStackParamList} from '../../types/Type';
import {RotationGestureHandlerStateChangeEvent} from 'react-native-gesture-handler';
import React from 'react';
import {useEffect} from 'react';
import {StackNavigationProp} from '@react-navigation/stack';
import Profile from '../pages/Profile';
import AccountEnter from '../pages/AccountEnter';
import AppealWrite from '../pages/AppealWrite';
import AccountCheck from '../pages/AccountCheck';
import ServiceEvaluationScreen from '../pages/ServiceEvaluationScreen';
import MannerEvaluationScreen from '../pages/MannerEvaluationScreen';
import EvaluationScreen from '../pages/EvaluationScreen';
import WriteHistory from '../pages/WriteHistory';
import TransactionHistory from '../pages/TransactionHistory';
import NameChange from '../pages/NameChange';
import CategoryEvaluationScreen from '../pages/CategoryEvaluatioScreen';

const Stack = createStackNavigator<RootStackParamList>();
type ChatScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'chatScreenNavigator'
>;

interface Props {
  navigation: ChatScreenNavigationProp;
}
const ChatStackNavigator: React.FC<Props> = ({navigation}) => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Chatting"
        component={Chatting}
        options={{
          headerTitle: '채팅',
          headerTitleStyle: {
            fontFamily: 'NanumGothic-Bold',
            fontSize: 28,
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
          headerTitle: '이의신청 작성',
          headerTitleStyle: {
            fontFamily: 'NanumGothic-Bold',
            fontSize: 28,
          },
        }}
      />
      <Stack.Screen
        name="ServiceEvaluationScreen"
        component={ServiceEvaluationScreen}
        options={{
          headerTitle: '서비스 평가',
          headerTitleStyle: {
            fontFamily: 'NanumGothic-Bold',
            fontSize: 28,
            color: 'black',
          },
        }}
      />
      <Stack.Screen
        name="MannerEvaluationScreen"
        component={MannerEvaluationScreen}
        options={{
          headerTitle: '매너 평가',
          headerTitleStyle: {
            fontFamily: 'NanumGothic-Bold',
            fontSize: 28,
            color: 'black',
          },
        }}
      />

      <Stack.Screen
        name="EvaluationScreen"
        component={EvaluationScreen}
        options={{
          headerTitle: '매너 평가',
          headerTitleStyle: {
            fontFamily: 'NanumGothic-Bold',
            fontSize: 28,
            color: 'black',
          },
        }}
      />
      <Stack.Screen
        name="WriteHistory"
        component={WriteHistory}
        options={{
          headerTitle: '작성한 내역',
          headerTitleStyle: {
            fontFamily: 'NanumGothic-Bold',
            fontSize: 28,
            color: 'black',
          },
        }}
      />

      <Stack.Screen
        name="TransactionHistory"
        component={TransactionHistory}
        options={{
          headerTitle: '거래한 내역',
          headerTitleStyle: {
            fontFamily: 'NanumGothic-Bold',
            fontSize: 28,
            color: 'black',
          },
        }}
      />

      <Stack.Screen
        name="NameChange"
        component={NameChange}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="CategoryEvaluationScreen"
        component={CategoryEvaluationScreen}
        options={{
          headerTitle: '심부름 서비스',
          headerTitleStyle: {
            fontFamily: 'NanumGothic-Bold',
            fontSize: 28,
            color: 'black',
          },
        }}
      />
    </Stack.Navigator>
  );
};
export default ChatStackNavigator;
