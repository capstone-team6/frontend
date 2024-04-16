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
import Icon from 'react-native-vector-icons/FontAwesome';
import SockJS from 'sockjs-client';
import StompJs, {Message as MessageType, Client} from '@stomp/stompjs';

const {createProxyMiddleware} = require('http-proxy-middleware');
module.exports = app => {
  app.use('/ws', createProxyMiddleware({targer: 'http://localhost:8080'}));
};
type ChatScreenRouteProp = RouteProp<RootStackParamList, 'ChatScreen'>;
type ChatScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'ChatScreen'
>;

interface Props {
  route: ChatScreenRouteProp;
  navigation: ChatScreenNavigationProp;
}

interface User {
  userId: string;
}
interface Chat {
  id: number;
  content: string;
  isMine: boolean;
  time: string;
  nickname: string;
}

interface WatingRoomBody {
  type: string;
  roomId: number;
  sendUserId?: string;
  content?: string;
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

const ChatScreen: React.FC<Props> = ({navigation}) => {
  //const {userId} = useParams<{userId: string}>();
  const route = useRoute<ChatScreenProp>();
  const {userId} = route.params;

  //const {selectedMbti} = useContext(MbtiContext);
  const client = useRef<any>({});
  const [chatList, setChatList] = useState<Chat[]>([]);
  const [chat, setChat] = useState<string>('');
  const [roomId, setRoomId] = useState<number>();
  //const userNickname = localStorage.getItem('nickname');
  const [isMatch, setIsMatch] = useState<boolean>(false);
  // 고유한 ID를 발급하는 함수
  const generateId = (() => {
    let id = 0;
    return () => {
      id += 1;
      return id;
    };
  })();

  const sendMessage = () => {};

  const disconnect = () => {
    client.current.deactivate();
    console.log('채팅이 종료되었습니다.');
    setIsMatch(false);
  };

  const onMessageReceived = (message: StompJs.Message) => {
    const messageBody = JSON.parse(message.body) as MessageBody;
    const {type, sendUserId, content, time, nickname} = messageBody;
    const isMine = sendUserId === userId;
    const newChat = {
      id: generateId(),
      content,
      isMine,
      time,
      nickname,
    };
    console.log(newChat);
    setChatList(prevChatList => [...prevChatList, newChat]);
    console.log(chatList);

    if (type === 'close') {
      console.log('closed');
    }
  };

  const subscribeAfterGetRoomId = (id: number) => {
    client.current.subscribe(`/sub/chat/match/${id}`, onMessageReceived);
  };

  const publishAfterGetRoomId = (
    event: React.FormEvent<HTMLFormElement>,
    content: string,
  ) => {
    event.preventDefault();
    if (!client.current.connected) return;

    client.current.publish({
      destination: `/pub/chat/match/${roomId}`,
      body: JSON.stringify({
        type: 'match',
        roomId,
        sendUserId: userId,
        content,
      }),
    });

    setChat('');
  };

  const handleChange = (event: any) => {
    setChat(event.nativeEvent.text);
  };

  // 최초 렌더링시 실행
  useEffect(() => {
    const subscribe = () => {
      client.current.subscribe(`/sub/chat/wait/${userId}`, (body: any) => {
        const watingRoomBody = JSON.parse(body.body) as WatingRoomBody;
        const {type, roomId: newRoomId} = watingRoomBody;

        if (type === 'open') {
          console.log('채팅 웨이팅 시작');
        }

        if (type === 'match') {
          console.log('매칭이 되었습니다!');
          subscribeAfterGetRoomId(newRoomId);
          setRoomId(newRoomId);
          setIsMatch(true);
        }
      });
    };

    const publishOnWait = () => {
      if (!client.current.connected) return;

      client.current.publish({
        destination: '/pub/chat/wait',
        body: JSON.stringify({
          type: 'open',
          userId,
          //selectMbti: `${selectedMbti}`,
        }),
      });
    };

    const connect = () => {
      client.current = new StompJs.Client({
        brokerURL: 'ws://api.projectsassy.net:8080/ws',
        onConnect: () => {
          console.log('success');
          subscribe();
          publishOnWait();
        },
      });
      client.current.activate();
    };

    connect();

    return () => disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

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
      <ScrollView
        onScroll={onScroll}
        scrollEventThrottle={16}
        style={{flex: 1}}>
        {chatList.map(msg => (
          <View
            key={msg.id}
            style={msg.isMine ? styles.myMessage : styles.theirMessage}>
            <Text>{msg.content}</Text>
          </View>
        ))}
      </ScrollView>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={chat}
          onChangeText={handleChange}
          placeholder="메시지 입력..."
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
