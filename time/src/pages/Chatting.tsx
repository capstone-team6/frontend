import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  FlatList,
  ListRenderItemInfo,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {RootStackParamList} from '../../types/Type';
import {StackNavigationProp} from '@react-navigation/stack';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface RoomData {
  roomId: number;
  name: string;
  message: string;
  time: string;
  roomName: string;
  noReadChat: number;
  boardId: number;
  otherUserId: number;
}

type ChatNavigationProp = StackNavigationProp<
  RootStackParamList,
  'chatScreenNavigator'
>;

const Chatting = () => {
  const navigation = useNavigation<ChatNavigationProp>();
  const [chatRoomDetails, setChatRoomDetails] = useState<RoomData[]>([]);

  const handleChatRoomPress = (
    userName: string,
    roomName: string,
    boardId: number,
    otherUserId: number,
    roomId: number,
  ) => {
    navigation.navigate('ChatScreen', {
      userName: userName,
      roomName: roomName,
      boardId: boardId,
      otherUserId: otherUserId,
    });
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      navigation.getParent()?.setOptions({
        tabBarStyle: {height: 70},
      });
    });

    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    AsyncStorage.getItem('accessToken').then(token => {
      const accessToken = token ? JSON.parse(token) : null;
      console.log(accessToken);
      axios
        .get('http://13.125.118.92:8080/my-page/chat', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then(response => {
          console.log(JSON.stringify(response.data.data));
          const d = JSON.stringify(response.data.data);
          if (d) {
            const chat = JSON.parse(d);
            setChatRoomDetails(chat.chatRoomDetails);
          }
        })
        .catch(error => {
          console.error(error);
        });
    });
  }, []);

  // const chatData = [
  //   {
  //     roomId: 1,
  //     roomName: 'A1',
  //     name: '홍길동',
  //     message: '안녕하세요!',
  //     time: '30분전',
  //     noReadChat: 2,
  //     boardId: 1,
  //     otherUserId: 1,
  //   },
  //   {
  //     roomId: 2,
  //     roomName: 'A1',
  //     name: '틈새2',
  //     message: '감사합니다!! 조심히가세요!',
  //     time: '1일 전',
  //     noReadChat: 2,
  //     boardId: 1,
  //     otherUserId: 1,
  //   },
  //   {
  //     roomId: 3,
  //     roomName: 'A1',
  //     name: '틈새3',
  //     message: '시간 구매하고 싶어요',
  //     time: '1일 전',
  //     noReadChat: 1,
  //     boardId: 1,
  //     otherUserId: 1,
  //   },
  //   {
  //     roomId: 4,
  //     roomName: 'A1',
  //     name: '틈새4',
  //     message: '감사합니다!! 조심히 가세요!',
  //     time: '1주일 전',
  //     noReadChat: 1,
  //     boardId: 1,
  //     otherUserId: 1,
  //   },
  // ];

  const truncateAtDot = (text: string): string => {
    const dotIndex = text.indexOf('.');
    if (dotIndex !== -1) {
      return text.slice(0, dotIndex + 1);
    }
    return text;
  };

  return (
    <View style={styles.chatListContainer}>
      <FlatList
        data={chatRoomDetails}
        keyExtractor={item => item.roomId.toString()}
        renderItem={({item}: ListRenderItemInfo<RoomData>) => (
          <TouchableOpacity
            onPress={() =>
              handleChatRoomPress(
                item.name,
                item.roomName,
                item.boardId,
                item.otherUserId,
                item.roomId,
              )
            }>
            <View style={styles.chatItemContainer}>
              <Ionicons name="person-circle" size={80} color={'#352456'} />
              <View style={styles.chatTextContainer}>
                <View style={styles.info}>
                  <Text style={styles.userName}>{item.name}</Text>
                  <View style={{width: 7}} />
                  <Text style={styles.info_text}>{item.time}</Text>
                </View>
                <Text style={styles.chatContent}>
                  {truncateAtDot(item.message)}
                </Text>
              </View>

              {item.noReadChat > 0 && (
                <View style={styles.chatCountContainer}>
                  <Text style={styles.chatCount}>{item.noReadChat}</Text>
                </View>
              )}
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
    marginLeft: 5,
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
    backgroundColor: '#352456',
  },
  chatCount: {
    fontSize: 10,
    fontFamily: 'NanumGothic-Bold',
    color: 'white',
  },
});

export default Chatting;
