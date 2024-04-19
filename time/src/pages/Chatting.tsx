import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
  FlatList,
  ListRenderItemInfo,
  ListRenderItem,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import ChatScreen from './ChatScreen';
import {RootStackParamList} from '../../types/Type';
import {NavigationProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';

interface RoomData {
  roomId: number;
  userName: string;
  location: string;
  time: string;
  contents: string;
  image: string;
  // chatCount: any;
}

type ChatNavigationProp = StackNavigationProp<RootStackParamList, 'Chatting'>;

const Chatting = () => {
  const navigation = useNavigation<ChatNavigationProp>();

  const generateId = (() => {
    let id = 0;
    return () => {
      id += 1;
      return id;
    };
  })();

  const handleChatRoomPress = (roomId: number) => {
    navigation.navigate('ChatScreen', {
      roomId,
    });
  };

  const chatData = [
    {
      roomId: 1,
      userName: '홍길동',
      location: '역삼동',
      time: '30분전',
      contents: '안녕하세요!',
      chatCount: '1',
      image: require('../assets/images/profile.png'),
    },
    {
      roomId: 2,
      userName: '틈새2',
      location: '역삼동',
      time: '1일 전',
      contents: '감사합니다!! 조심히가세요!',
      image: require('../assets/images/profile.png'),
    },
    {
      roomId: 3,
      userName: '틈새3',
      location: '역삼동',
      time: '1일 전',
      contents: '시간 구매하고 싶어요',
      chatCount: '3',
      image: require('../assets/images/profile.png'),
    },
    {
      roomId: 4,
      userName: '틈새4',
      location: '역삼동',
      time: '1주일 전',
      contents: '감사합니다!! 조심히 가세요!',
      chatCount: '1',
      image: require('../assets/images/profile.png'),
    },
  ];

  return (
    <View style={styles.chatListContainer}>
      <FlatList
        data={chatData}
        keyExtractor={item => item.roomId.toString()}
        renderItem={({item}: ListRenderItemInfo<RoomData>) => (
          <TouchableOpacity onPress={() => handleChatRoomPress(item.roomId)}>
            <View style={styles.chatItemContainer}>
              <Image
                source={require('../assets/images/profile.png')}
                style={styles.userImage}
              />
              <View style={styles.chatTextContainer}>
                <View style={styles.info}>
                  <Text style={styles.userName}>{item.userName}</Text>
                  <View style={{width: 7}} />
                  <Text style={styles.info_text}>
                    {item.location} · {item.time}
                  </Text>
                </View>
                <Text style={styles.chatContent}>{item.contents}</Text>
              </View>
              {/* {item.contents && (
                <View style={styles.chatCountContainer}>
                  <Text style={styles.chatCount}>{item.chatCount}</Text>
                </View>
              )} */}
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  chatListContainer: {
    height: Dimensions.get('screen').height,
    backgroundColor: 'white',
    flex: 1,
  },
  chatItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    height: 100,
  },
  userImage: {
    width: 80,
    height: 80,
    borderRadius: 25,
    marginRight: 10,
  },
  chatTextContainer: {
    flex: 1,
  },
  userName: {
    fontFamily: 'NanumGothic-Bold',
    fontSize: 17,
    color: 'black',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  chatContent: {
    fontFamily: 'NanumGothic',
    color: 'black',
    fontSize: 15,
  },
  info: {flexDirection: 'row'},
  info_text: {
    fontFamily: 'NanumGothic-Bold',
    fontSize: 12,
    color: '#8C8C8C',
    paddingTop: 6,
  },
  chatCountContainer: {
    paddingLeft: 4,
    width: 15,
    height: 15,
    borderRadius: 25,
    backgroundColor: '#C9BAE5',
  },
  chatCount: {
    fontSize: 10,
    fontFamily: 'NanumGothic-Bold',
  },
});

export default Chatting;
