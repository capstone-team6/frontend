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
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
interface RoomData {
  roomId: number;
  name: string;
  message: string;
  time: string;
  // chatCount: any;
}

type ChatNavigationProp = StackNavigationProp<RootStackParamList, 'Chatting'>;

const Chatting = () => {
  const [chatRoomDetails, setChatRoomDetails] = useState([]);
  const navigation = useNavigation<ChatNavigationProp>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const kakaoId = await getKakaoId();
        if (kakaoId) {
          const response = await axios.get(
            'http://13.125.118.92:8080/my-page/chat',
            {
              headers: {'Content-Type': 'application/json'},
              params: {kakaoId: kakaoId},
            },
          );
          console.log('Server response:', response.data);
          setChatRoomDetails(response.data.data.chatRoomDetails);
        } else {
          console.log('kakaoId not found in AsyncStorage');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const getKakaoId = async () => {
    try {
      const kakaoId = await AsyncStorage.getItem('kakaoId');
      return kakaoId;
    } catch (error) {
      console.error('Error getting kakaoId from AsyncStorage:', error);
      return null;
    }
  };

  const handleChatRoomPress = (roomId: number, userName: string) => {
    navigation.navigate('ChatScreen', {
      roomId,
      userName,
    });
  };

  const chatData = [
    {
      roomId: 1,
      name: '홍길동',
      message: '안녕하세요!',
      time: '30분전',

      // chatCount: '1',
    },
    {
      roomId: 2,
      name: '틈새2',
      message: '감사합니다!! 조심히가세요!',
      time: '1일 전',
    },
    {
      roomId: 3,
      name: '틈새3',
      message: '시간 구매하고 싶어요',
      time: '1일 전',

      // chatCount: '3',
    },
    {
      roomId: 4,
      name: '틈새4',
      message: '감사합니다!! 조심히 가세요!',
      time: '1주일 전',

      // chatCount: '1',
    },
  ];

  return (
    <View style={styles.chatListContainer}>
      <FlatList
        data={chatData}
        keyExtractor={item => item.roomId.toString()}
        renderItem={({item}: ListRenderItemInfo<RoomData>) => (
          <TouchableOpacity
            onPress={() => handleChatRoomPress(item.roomId, item.name)}>
            <View style={styles.chatItemContainer}>
              <Ionicons name="person-circle" size={80} color={'#352456'} />
              <View style={styles.chatTextContainer}>
                <View style={styles.info}>
                  <Text style={styles.userName}>{item.name}</Text>
                  <View style={{width: 7}} />
                  <Text style={styles.info_text}>{item.time}</Text>
                </View>
                <Text style={styles.chatContent}>{item.message}</Text>
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
    backgroundColor: '#C9BAE5',
  },
  chatCount: {
    fontSize: 10,
    fontFamily: 'NanumGothic-Bold',
  },
});

export default Chatting;
