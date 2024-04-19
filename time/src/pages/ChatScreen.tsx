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
  Modal,
} from 'react-native';
import {useRoute, RouteProp, useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../types/Type';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import AntDesign from 'react-native-vector-icons/AntDesign';

type ChatScreenRouteProp = RouteProp<RootStackParamList, 'ChatScreen'>;
type ChatScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'ChatScreen'
>;

interface Props {
  route: ChatScreenRouteProp;
  navigation: ChatScreenNavigationProp;
}

const ChatScreen: React.FC<Props> = ({route, navigation}) => {
  //Chatting에서 roomId
  const {roomId} = route.params;

  const [chatList, setChatList] = useState<
    {roomId: number; writer: string; message: string; type: string}[]
  >([]);
  const [stompClient, setStompClient] = useState<Stomp.Client | null>(null);
  const [messageInput, setMessageInput] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const sendMessage = () => {
    if (stompClient !== null) {
      const message = {
        roomId: roomId,
        writer: 'Me', // 작성자는 사용자로 지정합니다.
        message: messageInput,
        type: 'text', // 메시지 유형은 텍스트로 지정합니다. 다른 유형을 사용하는 경우 이 값을 수정하세요.
      };
      stompClient.send(
        `/pub/chat/send/${roomId}`,
        {},
        JSON.stringify({message}),
      );
      setMessageInput(''); // 메시지를 보낸 후에는 입력 필드를 비웁니다.
    }
  };

  const goBack = () => {
    navigation.goBack();
  };

  const onCameraPress = () => {
    // 카메라 접근 코드 작성
    setModalVisible(false);
  };

  const onGalleryPress = () => {
    // 갤러리 접근 코드 작성
    setModalVisible(false);
  };

  const onTransactionPress = () => {
    // 거래 진행 버튼 코드 작성
    setModalVisible(false);
  };

  useEffect(() => {
    const initializeWebSocket = () => {
      const socket = new SockJS('http://13.125.118.92:8080/ws');
      const client = Stomp.over(socket);

      client.connect({}, () => {
        console.log('Connected to WebSocket');
        setStompClient(client);

        client.subscribe(`/sub/chat/room/${roomId}`, (message: any) => {
          const newMessage = JSON.parse(message.body);
          setChatList(prevMessages => [...prevMessages, newMessage]);
        });
      });
    };

    const disconnectCallback = () => {
      console.log('Disconnected from server');
    };

    initializeWebSocket();

    return () => {
      if (stompClient !== null) {
        stompClient.disconnect(disconnectCallback);
      }
    };
  }, [chatList]);

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
      <View style={styles.header}>
        <TouchableOpacity onPress={goBack} style={styles.backButton}>
          <AntDesign name="arrowleft" size={24} color="black" />
        </TouchableOpacity>
      </View>
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
      <ScrollView style={{flex: 1}} onScroll={onScroll}>
        {chatList.map((msg, index) => (
          <View
            key={index}
            style={{
              alignSelf: msg.writer === 'Me' ? 'flex-end' : 'flex-start',
              margin: 5,
            }}>
            <Text
              style={{
                backgroundColor: msg.writer === 'Me' ? '#C9BAE5' : '#F1F1F1',
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
        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          style={styles.plusButton}>
          <AntDesign name="plus" size={13} />
        </TouchableOpacity>
        <TextInput
          value={messageInput}
          onChangeText={setMessageInput}
          onSubmitEditing={sendMessage} // TextInput에서 엔터를 누를 때 sendMessage 함수 호출
          placeholder="Type your message..."
          style={{
            flex: 1,
            marginRight: 35,
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
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Button title="Camera" onPress={onCameraPress} />
            <Button title="Gallery" onPress={onGalleryPress} />
            <Button title="Transaction" onPress={onTransactionPress} />
          </View>
        </View>
      </Modal>
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
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },
  plusButton: {
    marginRight: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  backButton: {
    marginRight: 10,
  },
});

export default ChatScreen;
