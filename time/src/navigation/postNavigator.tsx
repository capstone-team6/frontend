import {RouteProp, useNavigation} from '@react-navigation/native';
import {
  StackNavigationProp,
  createStackNavigator,
} from '@react-navigation/stack';
import Chatting from '../pages/Chatting';
import ChatScreen from '../pages/ChatScreen';
import {RootStackParamList} from '../../types/Type';
import {RotationGestureHandlerStateChangeEvent} from 'react-native-gesture-handler';
import React, {useState} from 'react';
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
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import PostDetailSet from '../pages/PostDetailSet';
import PostingChange from '../pages/PostingChange';
import Search from '../pages/Search';
import SearchList from '../pages/SearchList';
import Notify from '../pages/Notify';
import KeywordSet from '../pages/KeywordSet';
import ReportPost from '../pages/ReportPost';
import PostSet from '../pages/PostSet';
import WriteHistory from '../pages/WriteHistory';
import Profile from '../pages/Profile';
const Stack = createStackNavigator<RootStackParamList>();

type SearchProps = StackNavigationProp<RootStackParamList, 'postNavigatoer'>;

const postStackNavigator = () => {
  const searchNavigation = useNavigation<SearchProps>();
  const noticeNavigation = useNavigation<SearchProps>();
  const goToSearch = () => {
    searchNavigation.navigate('Search');
  };
  const goToNotify = () => {
    noticeNavigation.navigate('Notify');
  };
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="틈새시장"
        component={Main}
        // initialParams={{dataFromParent:dataToMain}}
        // initialParams={{
        //   dataFromParent: dataToMain
        // }}
        options={{
          headerTitleStyle: {
            color: '#352456',
            fontFamily: 'Gugi-Regular',
            fontSize: 40,
            paddingTop: 30,
            marginHorizontal: 10,
            height: 90,
          },

          headerRight: () => (
            <View style={{flexDirection: 'row', paddingTop: 10}}>
              <Feather
                name="search"
                size={25}
                style={{marginRight: 25, color: 'black'}}
                onPress={() => goToSearch()}
              />
              <Ionicons
                name="notifications-outline"
                size={25}
                style={{marginRight: 30, color: 'black'}}
                onPress={() => goToNotify()}
              />
            </View>
          ),
        }}></Stack.Screen>
      <Stack.Screen
        name="PostDetail"
        component={PostDetail}
        options={{
          headerTransparent: true,
          headerTitle: '',
        }}
      />

      <Stack.Screen
        name="WriteHistory"
        component={WriteHistory}
        options={{
          headerTitle: '작성내역',
          headerTitleStyle: {
            fontFamily: 'NanumGothic-Bold',
            fontSize: 28,
            color: 'black',
          },
        }}
      />

      <Stack.Screen
        name="Profile"
        component={Profile}
        options={{
          headerTitle: '프로필',
          headerTitleStyle: {
            fontFamily: 'NanumGothic-Bold',
            fontSize: 28,
            color: 'black',
          },
          headerStyle: {
            height: 80,
          },
        }}
      />
      <Stack.Screen name="App" component={App} />

      <Stack.Screen
        name="LocationSearch"
        component={LocationSearch}
        options={{
          headerTitle: '위치 재설정',
          headerTitleStyle: {
            fontFamily: 'NanumGothic-Bold',
            fontSize: 28,
          },
        }}
      />

      <Stack.Screen
        name="PostDetailSet"
        component={PostDetailSet}
        options={{
          headerTitle: '',
        }}
      />
      <Stack.Screen
        name="PostingChange"
        component={PostingChange}
        options={{
          headerTitle: '글 작성',
          headerTitleStyle: {
            fontFamily: 'NanumGothic-Bold',
            fontSize: 28,
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
        name="Search"
        component={Search}
        options={{
          headerTransparent: true,
          headerTitle: '',
        }}
      />
      <Stack.Screen
        name="SearchList"
        component={SearchList}
        options={{
          headerTransparent: true,
          headerTitle: '',
        }}
      />
      <Stack.Screen
        name="Notify"
        component={Notify}
        options={{
          headerTitle: '알림',
          headerTitleStyle: {
            fontFamily: 'NanumGothic-Bold',
            fontSize: 28,
          },
        }}
      />
      <Stack.Screen
        name="KeywordSet"
        component={KeywordSet}
        options={{
          headerTitle: '키워드 알림 설정',
          headerTitleStyle: {
            fontFamily: 'NanumGothic-Bold',
            fontSize: 28,
          },
        }}
      />

      <Stack.Screen
        name="ReportPost"
        component={ReportPost}
        options={{
          headerTitle: '게시글 신고',
          headerTitleStyle: {
            fontFamily: 'NanumGothic-Bold',
            fontSize: 28,
          },
        }}
      />

      <Stack.Screen
        name="PostSet"
        component={PostSet}
        options={{
          headerTitle: '',
        }}
      />
    </Stack.Navigator>
  );
};
export default postStackNavigator;
