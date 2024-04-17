import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Button,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Image,
  Dimensions,
} from 'react-native';
import {useRoute, RouteProp, useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../types/Type';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';

// const {createProxyMiddleware} = require('http-proxy-middleware');
// module.exports = app => {
//   app.use('/ws', createProxyMiddleware({targer: 'http://localhost:8080'}));
// };

type ChatScreenRouteProp = RouteProp<RootStackParamList, 'ChatScreen'>;
type ChatScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'ChatScreen'
>;

interface Props {
  route: ChatScreenRouteProp;
  navigation: ChatScreenNavigationProp;
}

interface Chat {
  id: number;
  content: string;
  isMine: boolean;
  time: string;
  nickname: string;
}

interface MessageBody {
  type: string;
  sendUserId: string;
  content: string;
  time: string;
  nickname: string;
}

interface StyledMessageProps {
  isMine: boolean;
}
type ChatScreenProp = RouteProp<RootStackParamList, 'ChatScreen'>;

interface Message {
  roomId: number;
  writer: string;
  message: string;
  type: string;
}

const ChatScreen: React.FC<Props> = ({navigation}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const [stompClient, setStompClient] = useState<Stomp.Client | null>(null);

  useEffect(() => {
    //STOMP 클라이언트 설정
    const socket = new SockJS('ws://13.125.118.92:8080/ws');
    const stomp = Stomp.over(socket);
    stomp.connect({}, () => {
      setStompClient(stomp);
      //구독할 채팅 토픽 지정
      stomp.subscribe('/sub/chat/room/1', (message: any) => {
        const newMessage = JSON.parse(message.body);
        setMessages(prevMessages => [...prevMessages, newMessage]);
      });
    });

    return () => {
      //컴포넌트 언마운트 시 STOMP 연결 해제
      if (stompClient !== null) {
        stompClient.disconnect(() => {
          console.log('채팅이 종료되었습니다.');
        });
      }
    };
  }, []);

  const sendMessage = () => {
    if (stompClient !== null) {
      stompClient.send(
        '/pub/chat/send/1',
        {},
        JSON.stringify({content: messageInput}),
      );
      setMessageInput('');
    }
  };

  const generateId = (() => {
    let id = 0;
    return () => {
      id += 1;
      return id;
    };
  })();

  const [showTopInfo, setShowTopInfo] = useState(true);

  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrollY = event.nativeEvent.contentOffset.y;
    if (scrollY > 100) {
      setShowTopInfo(false);
    } else {
      setShowTopInfo(true);
    }
  };

  return (
    <View
      style={{
        flex: 1,
        height: Dimensions.get('screen').height,
        backgroundColor: 'white',
      }}>
      {showTopInfo && (
        <View
          style={{
            width: Dimensions.get('screen').width,
            height: 300,
            flexDirection: 'column',
            alignItems: 'center',
          }}>
          <Image
            source={require('../assets/images/profile.png')}
            style={{height: 133, width: 124}}
          />
          <Text
            style={{
              fontFamily: 'NanumGothic-Bold',
              fontSize: 20,
              fontWeight: 'bold',
              color: 'black',
            }}>
            홍길동
          </Text>
          <Text
            style={{
              fontFamily: 'NanumGothic',
              fontSize: 10,
              color: 'black',
              marginVertical: 10,
            }}>
            지금까지 5번의 시간을 거래했어요.
          </Text>
        </View>
      )}
      <ScrollView style={{flex: 1}}>
        {messages.map((msg, index) => (
          <View
            key={index}
            style={{
              alignSelf: msg.writer === 'Me' ? 'flex-end' : 'flex-start',
              margin: 5,
            }}>
            <Text
              style={{
                backgroundColor: msg.writer === 'Me' ? '#DCF8C6' : '#F1F0F0',
                padding: 10,
                borderRadius: 8,
              }}>
              {msg.message}
            </Text>
          </View>
        ))}
      </ScrollView>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: 10,
        }}>
        <TextInput
          value={messageInput}
          onChangeText={setMessageInput}
          placeholder="Type your message..."
          style={{
            flex: 1,
            marginRight: 10,
            padding: 10,
            borderWidth: 1,
            borderColor: '#ccc',
            borderRadius: 8,
          }}
        />

        <TouchableOpacity onPress={sendMessage} style={styles.iconContainer}>
          <Image
            source={require('../assets/images/send.png')}
            style={{height: 20, width: 20}}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    width: 200,
  },
  myMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#C9BAE5',
    padding: 10,
    borderRadius: 10,
    margin: 5,
  },
  theirMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#F1F1F1',
    padding: 10,
    borderRadius: 10,
    margin: 5,
  },
  iconContainer: {
    position: 'absolute',
    right: 10,
  },
});

export default ChatScreen;
