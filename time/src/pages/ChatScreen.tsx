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
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios';
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
  const {roomId, userName} = route.params;
  const [chatList, setChatList] = useState<
    {
      roomId: number;
      writer: string;
      message: string;
      type: string;
      // role: string;
    }[]
  >([]);
  const [role, setRole] = useState('');
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
        writer: userName,
        message: '거래가 시작됐어요.\n결제 방법을 선택해주세요.',
        type: 'goTransaction',
        role: 'buyer',
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

  const goTransaction = (pay: string) => {
    const transactionMessage = {
      roomId: roomId,
      writer: userName,
      message: `${pay}로 거래가 진행될 예정이에요.\n해당 글이 거래중 상태로 변경되었어요.`,
      type: 'onTransaction',
    };
    if (pay === '틈새 페이') {
      transactionMessage.message +=
        '\n\n' +
        '"틈새페이" 는 안전한 결제를 위하여 포인트 차감 후\n결제완료시 시간 판매자의 틈새페이로 포인트가 전달됩니다.\n또한,시간 판매자가 거래완료를 누른 뒤 시간 구매자가\n거래완료를 눌러야 거래가 최종 완료됩니다.';
    }
    setChatList(prevMessages => [...prevMessages, transactionMessage]);
    transferComplete();
  };

  // const onMeet = () => {
  //   const meetMessage = {
  //     roomId: roomId,
  //     writer: 'System',
  //     message:
  //       '"만나서 결제"로 거래가 진행될 예정이에요.\n해당 글이 거래중 상태로 변경되었어요.',
  //     type: 'System',
  //   };
  //   setChatList(prevMessages => [...prevMessages, meetMessage]);
  //   transferComplete();
  // };

  // const onTransfer = () => {
  //   const transferMessage = {
  //     roomId: roomId,
  //     writer: 'System',
  //     message:
  //       '"계좌이체"로 거래가 진행될 예정이에요.\n해당 글이 거래중 상태로 변경되었어요.',
  //     type: 'System',
  //   };
  //   setChatList(prevMessages => [...prevMessages, transferMessage]);
  //   transferComplete();
  // };

  // const onPay = () => {
  //   const payMessage = {
  //     roomId: roomId,
  //     writer: 'System',
  //     message:
  //       '"틈새페이"로 거래가 진행될 예정이에요.\n해당 글이 거래중 상태로 변경되었어요.',
  //     type: 'System',
  //   };
  //   setChatList(prevMessages => [...prevMessages, payMessage]);
  //   transferComplete();
  // };

  const transferComplete = () => {
    const meetComplete = {
      roomId: roomId,
      writer: userName,
      message:
        '거래를 완료했다면 "거래 완료"를 눌러주세요.\n3일 후에 자동으로 "거래완료"상태로 변경됩니다.',
      type: 'completeTransaction',
    };
    setChatList(prevMessages => [...prevMessages, meetComplete]);
  };

  const completeMessage = () => {
    const completeMessage = {
      roomId: roomId,
      writer: 'System',
      message: '거래가 완료되었어요. 상대방의 후기를 남겨주세요.',
      type: 'review',
    };

    setChatList(prevMessages => [...prevMessages, completeMessage]);
  };
  const goToProfile = () => {};
  const transferInfo = () => {
    const transferInfo = {
      roomId: roomId,
      writer: 'System',
      message: '계좌 정보를 보냈어요.',
      type: 'account',
    };
    setChatList(prevMessages => [...prevMessages, transferInfo]);
  };
  const onPay = () => {
    const transferInfo = {
      roomId: roomId,
      writer: 'System',
      message: '틈새페이가 차감되었어요.\n현재 잔고 : 0원',
      type: 'pay',
    };
    setChatList(prevMessages => [...prevMessages, transferInfo]);
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          'http://13.125.118.92:8080/api/board/3/chat/2/who',
        );
        setRole(response.data.role);
      } catch (error) {
        console.error('Error fetching chat data:', error);
      }
    };

    fetchData();

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
        writer: userName,
        message: messageInput,
        type: 'text',
      };
      stompClient.send(`/pub/chat/send/`, {}, JSON.stringify({message}));
      setChatList(prevMessages => [...prevMessages, message]);
      setMessageInput('');
    }
  };
  const onGalleryPress = () => {
    // 갤러리 접근 코드 작성
    setModalVisible(false);
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
            {userName}
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
                msg.writer === userName &&
                (msg.type === 'message' ||
                  msg.type === 'goTransaction' ||
                  msg.type === 'completeTransaction')
                  ? 'flex-end'
                  : msg.type === 'onTransaction' || msg.type === 'review'
                  ? 'center'
                  : 'flex-start',
              margin: 10,
              width:
                msg.type === 'onTransaction' || msg.type === 'review'
                  ? '100%'
                  : 'auto',
            }}>
            {msg.type === 'goTransaction' ? (
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
                    onPress={() => {
                      goTransaction('만나서 결제');
                    }}>
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
                    onPress={() => {
                      goTransaction('계좌 이체');
                    }}>
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
                    onPress={() => {
                      goTransaction('틈새 페이');
                    }}>
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
            ) : msg.type == 'completeTransaction' ? (
              <View
                style={{
                  backgroundColor: '#F1F1F1',
                  padding: 13,
                  borderRadius: 8,
                  alignSelf: 'flex-end',
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
            ) : msg.type === 'transferInfo' ? (
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
                    onPress={goToProfile}>
                    <Text
                      style={{
                        fontFamily: 'NanumGothic',
                        fontSize: 15,
                        textAlign: 'center',
                        color: 'black',
                        fontWeight: 'bold',
                      }}>
                      계좌 정보 확인
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <View
                style={{
                  padding: 10,
                  borderRadius: 8,
                }}>
                <View
                  style={{
                    flexDirection: 'column',
                    backgroundColor: '#BDBBC2',
                    padding: 10,
                    borderRadius: 8,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <View style={{flexDirection: 'row'}}>
                    <MaterialCommunityIcon
                      name="bell-ring-outline"
                      size={20}
                      color={'black'}
                      style={{marginLeft: 10}}
                    />

                    <Text
                      style={{
                        color: 'black',
                        // backgroundColor:
                        // msg.writer === userName && msg.type === 'message'
                        //   ? '#F1F1F1'
                        //   : msg.type === 'onTransaction' ||
                        //     msg.type === 'review'
                        //   ? '#BDBBC2'
                        //   : '#C9BAE5',

                        textAlign:
                          msg.type === 'onTransaction' || msg.type === 'review'
                            ? 'center'
                            : 'auto',
                        marginLeft: 5,
                      }}>
                      {msg.message}
                    </Text>
                  </View>
                  <View>
                    {msg.type === 'review' ? (
                      <TouchableOpacity
                        style={{
                          backgroundColor: '#66636C',
                          width: 'auto',
                          height: 25,
                          borderRadius: 8,
                          justifyContent: 'center',
                          marginVertical: 8,
                        }}
                        onPress={goToProfile}>
                        <Text
                          style={{
                            fontFamily: 'NanumGothic',
                            fontSize: 15,
                            textAlign: 'center',
                            color: 'white',
                          }}>
                          상대방 프로필 바로가기
                        </Text>
                      </TouchableOpacity>
                    ) : null}
                  </View>
                </View>
              </View>
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
