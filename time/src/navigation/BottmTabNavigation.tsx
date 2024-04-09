import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import React from 'react';
import Main from '../pages/Main';
import Scrap from '../pages/Scrap';
import Posting from '../pages/Posting';
import Chatting from '../pages/Chatting';
import Octicons from 'react-native-vector-icons/Octicons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {View} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import Icon from 'react-native-vector-icons/AntDesign';
import myPageStack from '../navigation/myPageStackNavigator';

const Tab = createBottomTabNavigator();

const BottmTabNavigation = () => {
  return (
    <Tab.Navigator
      initialRouteName="main"
      screenOptions={{
        tabBarStyle: {
          height: 70,
        },
        tabBarLabelStyle: {
          marginBottom: 10,
        },
        headerStyle: {
          height: 80,
        },
        tabBarActiveTintColor: '#C9BAE5',
      }}>
      <Tab.Screen
        name="틈새시장"
        component={Main}
        options={{
          headerTitleStyle: {
            color: '#352456',
            fontFamily: 'Gugi-Regular',
            fontSize: 40,
            paddingTop: 30,
            marginHorizontal: 10,
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
          tabBarLabel: '홈',
          tabBarIcon: ({focused}) => (
            <Octicons
              name="home"
              size={20}
              color={focused ? '#C9BAE5' : 'gray'}
            />
          ),
        }}
      />
      <Tab.Screen
        name="관심목록"
        component={Scrap}
        options={{
          tabBarLabel: '관심',
          tabBarIcon: ({focused}) => (
            <AntDesign
              name="hearto"
              size={20}
              color={focused ? '#C9BAE5' : 'gray'}
            />
          ),
        }}
      />
      <Tab.Screen
        name="글 작성"
        component={Posting}
        options={{
          tabBarLabel: '',
          tabBarIcon: () => (
            <AntDesign name="pluscircle" size={45} color="#C9BAE5" />
          ),
        }}
      />
      <Tab.Screen
        name="채팅"
        component={Chatting}
        options={{
          tabBarLabel: '채팅',
          tabBarIcon: ({focused}) => (
            <Ionicons
              name="chatbubble-outline"
              size={20}
              color={focused ? '#C9BAE5' : 'gray'}
            />
          ),
        }}
      />
      <Tab.Screen
        name="나의 틈새"
        component={myPageStack}
        options={{
          headerShown: false,
          headerTitleStyle: {
            fontFamily: 'NanumGothic-Bold',
            fontSize: 28,
          },
          headerRight: () => (
            <Ionicons
              name="settings-outline"
              size={25}
              color="black"
              style={{margin: 20}}
            />
          ),

          tabBarLabel: '마이',
          tabBarIcon: ({focused}) => (
            <Ionicons
              name="person-outline"
              size={20}
              color={focused ? '#C9BAE5' : 'gray'}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default BottmTabNavigation;