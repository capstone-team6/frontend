import {useNavigation} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import Chatting from '../pages/Chatting';
import ChatScreen from '../pages/ChatScreen';
import {RootStackParamList} from '../../types/Type';
import {RotationGestureHandlerStateChangeEvent} from 'react-native-gesture-handler';
import chatScreenNavigator from './chatScreenNavigator';
import React from 'react';
import {useEffect} from 'react';
import {StackNavigationProp} from '@react-navigation/stack';

const Stack = createStackNavigator<RootStackParamList>();
type ChatScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'chatScreenNavigator'
>;

interface Props {
  navigation: ChatScreenNavigationProp;
}
const ChatStackNavigator: React.FC<Props> = ({navigation}) => {
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      const currentRouteName =
        navigation.getState().routes[navigation.getState().index].name;

      if (currentRouteName === 'chatScreenNavigator') {
        navigation.getParent()?.setOptions({tabBarStyle: {display: 'none'}});
      }
    });

    const blurUnsubscribe = navigation.addListener('blur', () => {
      // 화면이 blur될 때 바텀 탭을 다시 보이게 함
      navigation.getParent()?.setOptions({tabBarStyle: undefined});
    });

    return () => {
      unsubscribe();
      blurUnsubscribe();
    };
  }, [navigation]);

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
        name="chatScreenNavigator"
        component={chatScreenNavigator}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};
export default ChatStackNavigator;
