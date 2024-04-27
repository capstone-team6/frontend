import {useNavigation} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import Chatting from '../pages/Chatting';
import ChatScreen from '../pages/ChatScreen';
import {RootStackParamList} from '../../types/Type';
import {RotationGestureHandlerStateChangeEvent} from 'react-native-gesture-handler';
import React from 'react';
import Main from '../pages/Main';
import PostDetail from '../pages/PostDetail';
import {View} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Stack = createStackNavigator<RootStackParamList>();

const postStackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="틈새시장"
        component={Main}
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
      />
      <Stack.Screen name="PostDetail" component={PostDetail} />
    </Stack.Navigator>
  );
};
export default postStackNavigator;
