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
import Stomp, {Client} from 'stompjs';
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

  const goBack = () => {
    navigation.goBack();
  };

  const onCameraPress = () => {
    // 카메라 접근 코드 작성
    setModalVisible(false);
  };

  const onTransactionPress = () => {
    if (stompClient !== null) {
      const transactionMessage = {
        roomId: roomId,
        writer: 'Me',
        message: '거래가 시작됐어요.\n결제 방법을 선택해주세요.',
        type: 'system_message',
      };
      // setChatList(prevMessages => [...prevMessages, transactionMessage]);
      stompClient.send(
        `/pub/chat/send`,
        {},
        JSON.stringify({transactionMessage}),
      );
      addMessage(transactionMessage);
    }
    setModalVisible(false);
  };

  const onGalleryPress = () => {
    // 갤러리 접근 코드 작성
    setModalVisible(false);
  };

  const onMeet = () => {
    const meetMessage = {
      roomId: roomId,
      writer: 'System',
      message:
        '"만나서 결제"로 거래가 진행될 예정이에요.\n해당 글이 거래중 상태로 변경되었어요.',
      type: 'System',
    };
    setChatList(prevMessages => [...prevMessages, meetMessage]);
    meetComplete();
  };

  const meetComplete = () => {
    const meetComplete = {
      roomId: roomId,
      writer: 'Me',
      message:
        '거래를 완료했다면 "거래 완료"를 눌러주세요.\n3일 후에 자동으로 "거래완료"상태로 변경됩니다.',
      type: 'change',
    };
    setChatList(prevMessages => [...prevMessages, meetComplete]);
  };

  const completeMessage = () => {
    const completeMessage = {
      roomId: roomId,
      writer: 'System',
      message: '거래가 완료되었어요. 상대방의 후기를 남겨주세요.',
      type: 'System',
    };
    setChatList(prevMessages => [...prevMessages, completeMessage]);
  };

  const onTransfer = () => {};
  const onPocketPay = () => {};

  useEffect(() => {
    const socket = new SockJS('http://13.125.118.92:8080/ws');
    const client = Stomp.over(socket);
    setStompClient(client);
    client.connect({}, () => {
      console.log('Connected to WebSocket');
      client.subscribe(`/sub/chat/room/${roomId}`, (message: any) => {
        const newMessage = JSON.parse(message.body);
        console.log(newMessage);
        addMessage(newMessage);
      });
    });

    const disconnectCallback = () => {
      console.log('Disconnected from server');
    };

    return () => {
      if (stompClient !== null) {
        stompClient.disconnect(disconnectCallback);
      }
    };
  }, [chatList, roomId]);

  const addMessage = (message: any) => {
    setChatList(prev => [...prev, message]);
  };

  const sendMessage = () => {
    if (stompClient !== null) {
      const message = {
        roomId: roomId,
        writer: 'Me',
        message: messageInput,
        type: 'text',
      };
      stompClient.send(`/pub/chat/send/`, {}, JSON.stringify({message}));
      setChatList(prevMessages => [...prevMessages, message]);
      setMessageInput('');
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
      <ScrollView>
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
        {chatList.map((msg, index) => (
          <View
            key={index}
            style={{
              alignSelf:
                msg.writer === 'Me'
                  ? 'flex-end'
                  : msg.writer === 'System'
                  ? 'center'
                  : 'flex-start',
              margin: 10,

              width: msg.writer === 'System' ? '80%' : 'auto',
            }}>
            {msg.type === 'system_message' ? (
              <View
                style={{
                  backgroundColor: '#F1F1F1',
                  padding: 13,
                  borderRadius: 8,
                }}>
                <Text
                  style={{
                    fontFamily: 'NanumGothic',
                    fontSize: 17,
                    color: 'black',
                  }}>
                  {msg.message}
                </Text>

                <View>
                  <TouchableOpacity
                    style={{
                      backgroundColor: '#C9BAE5',
                      width: '100%',
                      height: 35,
                      borderRadius: 10,
                      justifyContent: 'center',
                      marginVertical: 8,
                    }}
                    onPress={onMeet}>
                    <Text
                      style={{
                        fontFamily: 'NanumGothic',
                        fontSize: 15,
                        textAlign: 'center',
                        color: 'black',
                        fontWeight: 'bold',
                      }}>
                      만나서 결제
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      backgroundColor: '#C9BAE5',
                      width: '100%',
                      height: 35,
                      borderRadius: 10,
                      justifyContent: 'center',
                      marginBottom: 8,
                    }}
                    onPress={onTransfer}>
                    <Text
                      style={{
                        fontFamily: 'NanumGothic',
                        textAlign: 'center',
                        color: 'black',
                        fontWeight: 'bold',
                        fontSize: 15,
                      }}>
                      계좌이체
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      backgroundColor: '#C9BAE5',
                      width: '100%',
                      height: 35,
                      borderRadius: 10,
                      justifyContent: 'center',
                    }}
                    onPress={onPocketPay}>
                    <Text
                      style={{
                        fontFamily: 'NanumGothic',
                        textAlign: 'center',
                        color: 'black',
                        fontWeight: 'bold',
                        fontSize: 15,
                      }}>
                      틈새페이
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : msg.type == 'change' ? (
              <View
                style={{
                  backgroundColor: '#F1F1F1',
                  padding: 13,
                  borderRadius: 8,
                }}>
                <Text
                  style={{
                    fontFamily: 'NanumGothic',
                    fontSize: 17,
                    color: 'black',
                  }}>
                  {msg.message}
                </Text>
                <View>
                  <TouchableOpacity
                    style={{
                      backgroundColor: '#C9BAE5',
                      width: '100%',
                      height: 35,
                      borderRadius: 10,
                      justifyContent: 'center',
                      marginVertical: 8,
                    }}
                    onPress={completeMessage}>
                    <Text
                      style={{
                        fontFamily: 'NanumGothic',
                        fontSize: 15,
                        textAlign: 'center',
                        color: 'black',
                        fontWeight: 'bold',
                      }}>
                      거래 완료
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      backgroundColor: '#C9BAE5',
                      width: '100%',
                      height: 35,
                      borderRadius: 10,
                      justifyContent: 'center',
                      marginVertical: 8,
                    }}
                    onPress={completeMessage}>
                    <Text
                      style={{
                        fontFamily: 'NanumGothic',
                        fontSize: 15,
                        textAlign: 'center',
                        color: 'black',
                        fontWeight: 'bold',
                      }}>
                      거래 취소
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <Text
                style={{
                  color: 'black',
                  backgroundColor:
                    msg.writer === 'Me'
                      ? '#F1F1F1'
                      : msg.writer === 'System'
                      ? '#BDBBC2'
                      : '#C9BAE5',
                  padding: 10,
                  borderRadius: 8,
                  textAlign: msg.writer === 'System' ? 'center' : 'auto',
                }}>
                {msg.message}
              </Text>
            )}
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
          onSubmitEditing={sendMessage}
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
