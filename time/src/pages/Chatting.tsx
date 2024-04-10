import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import ChatScreen from './ChatScreen';
import {RootStackParamList} from '../../types/Type';
import {NavigationProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

type ChatNavigationProp = StackNavigationProp<RootStackParamList, 'Chatting'>;

const Chatting = () => {
  const navigation = useNavigation<ChatNavigationProp>();
  const goTochatScreen = (userName: string) => {
    navigation.navigate('ChatScreen', {userName});
  };
  const chatData = [
    {
      id: 'chat1',
      userName: '홍길동',
      location: '역삼동',
      time: '30분전',
      chatContent: '안녕하세요!',
      chatCount: 1,
      imageSource: require('../assets/images/profile.png'),
    },
    {
      id: 'chat2',
      userName: '틈새2',
      chatContent: '감사합니다!! 조심히가세요!',
      location: '역삼동',
      time: '1일 전',
      imageSource: require('../assets/images/profile.png'),
    },
    {
      id: 'chat3',
      userName: '틈새3',
      chatContent: '시간 구매하고 싶어요',
      location: '역삼동',
      time: '1일 전',
      chatCount: 3,
      imageSource: require('../assets/images/profile.png'),
    },
    {
      id: 'chat4',
      userName: '틈새4',
      chatContent: '감사합니다!! 조심히가세요!',
      location: '역삼동',
      time: '1주일 전',
      imageSource: require('../assets/images/profile.png'),
    },
  ];

  return (
    <View style={styles.chatListContainer}>
      {chatData.map(chat => (
        <TouchableOpacity
          key={chat.id}
          onPress={() => goTochatScreen(chat.userName)}>
          <View style={styles.chatItemContainer}>
            <Image source={chat.imageSource} style={styles.userImage} />
            <View style={styles.chatTextContainer}>
              <View style={styles.info}>
                <Text style={styles.userName}>{chat.userName}</Text>
                <View style={{width: 7}} />
                <Text style={styles.info_text}>
                  {chat.location} · {chat.time}
                </Text>
              </View>
              <Text style={styles.chatContent}>{chat.chatContent}</Text>
            </View>
            {chat.chatCount && (
              <View style={styles.chatCountContainer}>
                <Text style={styles.chatCount}>{chat.chatCount}</Text>
              </View>
            )}
          </View>
        </TouchableOpacity>
      ))}
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
    fontFamily: 'NanumGothic',
  },
});

export default Chatting;
