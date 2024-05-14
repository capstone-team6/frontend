import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
  Modal,
  Alert,
} from 'react-native';
import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../types/Type';
import Stomp from 'stompjs';
import {Client} from '@stomp/stompjs';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  launchCamera,
  launchImageLibrary,
  ImagePickerResponse,
  CameraOptions,
  ImageLibraryOptions,
} from 'react-native-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
  const {roomId, userName, roomName, boardId, holder, bank, accountNumber} =
    route.params;

  const [role, setRole] = useState('BUYER');
  const [messageInput, setMessageInput] = useState('');
  const [chatList, setChatList] = useState<
    {
      roomId: number;
      message: string;
      type: string;
    }[]
  >([]);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    if (route.params?.newMessage) {
      const {message, type} = route.params.newMessage;
      const roomIdNumber = roomId as number;
      setChatList(currentChatList => [
        ...currentChatList,
        {roomId: roomIdNumber, message, type},
      ]);
    }
  }, [route.params]);

  const goBack = () => {
    navigation.goBack();
  };

  const goToProfile = () => {
    navigation.navigate('Profile');
  };

  const goToAccountEnter = () => {
    navigation.navigate('AccountEnter', {boardId, roomId});
  };

  const goToAccountCheck = () => {
    navigation.navigate('AccountCheck', {boardId, roomId});
  };

  const goToPay = () => {};

  const handleImagePickerResponse = (response: ImagePickerResponse) => {
    if (response.didCancel) {
      console.log('User cancelled image picker');
    } else if (response.errorCode) {
      console.log('ImagePicker Error: ', response.errorMessage);
    } else if (response.assets) {
      const source = {uri: response.assets[0].uri};
      // 여기에 이미지를 처리하는 로직
      console.log(source);
    }
  };

  const onCameraPress = () => {
    setModalVisible(false);
    const options: CameraOptions = {
      saveToPhotos: true,
      mediaType: 'photo',
    };

    launchCamera(options, handleImagePickerResponse);
  };

  const onGalleryPress = () => {
    setModalVisible(false);
    const options: ImageLibraryOptions = {
      selectionLimit: 1,
      mediaType: 'photo',
    };

    launchImageLibrary(options, handleImagePickerResponse);
  };

  const addMessage = (message: any) => {
    setChatList(prev => [...prev, message]);
  };

  const onTransactionPress = () => {
    setModalVisible(false);

    if (roomId !== undefined) {
      setChatList(currentChatList => [
        ...currentChatList,
        {
          roomId: roomId,
          message: '거래가 시작됐어요.\n결제 방법을 선택해주세요.',
          type: 'goTransaction',
        },
      ]);

      sendMessage(
        roomId,
        '거래가 시작됐어요.\n결제 방법을 선택해주세요.',
        'goTransaction',
      );
    } else {
      console.error('Transaction Press ERROR');
    }
  };

  const goTransaction = async (pay: string) => {
    // if (pay === '틈새 페이') {
    //   transactionMessage.message +=
    //     '\n\n' +
    //     '"틈새페이" 는 안전한 결제를 위하여 포인트 차감 후\n결제완료시 시간 판매자의 틈새페이로 포인트가 전달됩니다.\n또한,시간 판매자가 거래완료를 누른 뒤 시간 구매자가\n거래완료를 눌러야 거래가 최종 완료됩니다.';
    // }
    if (roomId !== undefined) {
      setChatList(currentChatList => [
        ...currentChatList,
        {
          roomId: roomId,
          message: `${pay}로 거래가 진행될 예정이에요.\n해당 글이 거래중 상태로 변경되었어요.`,
          type: 'onTransaction',
        },
      ]);
      sendMessage(
        roomId,
        `${pay}로 거래가 진행될 예정이에요.\n해당 글이 거래중 상태로 변경되었어요.`,
        'onTransaction',
      );
      transferComplete();
    } else {
      console.error('goTransaction ERROR');
    }

    try {
      const store = await AsyncStorage.getItem('accessToken');
      const token = store ? JSON.parse(store) : null;
      console.log(token);

      const paymentData = {
        payMeth: pay === '틈새 페이' ? 'PAY' : pay === '만나서' ? 'MEET' : null,
      };

      const res = await axios.post(
        `http://13.125.118.92:8080/api/board/${boardId}/chat/${roomId}/pay`,
        paymentData,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (res.status === 200) {
        console.log(res.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const transferComplete = () => {
    if (roomId !== undefined) {
      setChatList(currentChatList => [
        ...currentChatList,
        {
          roomId: roomId,
          message:
            '거래를 완료했다면 "거래 완료"를 눌러주세요.\n3일 후에 자동으로 "거래완료"상태로 변경됩니다.',
          type: 'completeTransaction',
        },
      ]);
      sendMessage(
        roomId,
        '거래를 완료했다면 "거래 완료"를 눌러주세요.\n3일 후에 자동으로 "거래완료"상태로 변경됩니다.',
        'completeTransaction',
      );
    } else {
      console.error('transferComplete ERROR');
    }
  };

  const completeMessage = async () => {
    if (roomId !== undefined) {
      setChatList(currentChatList => [
        ...currentChatList,
        {
          roomId: roomId,
          message:
            '거래를 완료했다면 "거래 완료"를 눌러주세요.\n3일 후에 자동으로 "거래완료"상태로 변경됩니다.',
          type: 'review',
        },
      ]);
      sendMessage(
        roomId,
        '거래가 완료되었어요. 상대방의 후기를 남겨주세요.',
        'review',
      );
    } else {
      console.error('transferComplete ERROR');
    }

    try {
      axios
        .put(
          `http://13.125.118.92:8080/api/board/${boardId}/chat/${roomId}/complete`,
        )
        .then(res => {
          const result = res.data.data;
          console.log(result);
          if (result.status == 200) {
            console.log(result.data);
          }
        })
        .catch(err => {
          const result = err.response.data.data;
          console.log(result);
        });
    } catch (error) {
      console.error('Request failed:', error);
    }
  };

  const cancelMessage = async () => {
    try {
      axios
        .put(
          `http://13.125.118.92:8080/api/board/${boardId}/chat/${roomId}/cancel`,
        )
        .then(res => {
          const result = res.data.data;
          console.log(result);
          if (result.status == 200) {
            console.log(result.data);
          }
        })
        .catch(err => {
          const result = err.response.data.data;
          console.log(result);
        });
    } catch (error) {
      console.error('Request failed:', error);
    }
  };

  const transferInfo = () => {
    if (roomId !== undefined) {
      sendMessage(roomId, '계좌 정보를 보냈어요.', 'transferInfo');
    } else {
      console.error('transferComplete ERROR');
    }
  };

  const onPay = () => {
    if (roomId !== undefined) {
      sendMessage(roomId, '틈새페이가 차감되었어요.\n현재 잔고 : 0원', 'pay');
    } else {
      console.error('transferComplete ERROR');
    }
  };

  function useInterval(callback: () => void, delay: number | null) {
    const savedCallback = useRef<() => void>();
    useEffect(() => {
      savedCallback.current = callback;
    }, [callback]);

    useEffect(() => {
      function tick() {
        if (savedCallback.current) {
          savedCallback.current();
        }
      }
      if (delay !== null) {
        let id = setInterval(tick, delay);
        return () => clearInterval(id);
      }
    }, [delay]);
  }

  async function fetchToken() {
    const item = await AsyncStorage.getItem('accessToken');
    return item ? JSON.parse(item) : null;
  }

  const fetchMessages = async () => {
    try {
      const token = await fetchToken();
      console.log(token);
      const response = await axios.get('http://13.125.118.92:8080/chat/room', {
        params: {
          roomName: roomName,
          boardId: boardId,
        },
        headers: {
          'Content-Type': 'application/json', // 필요한 경우 추가
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('Data received:', response.data);
      console.log(response.data.roleType);
      setRole(response.data.roleType);
      // setChatList(response.data.chatlist);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // useEffect(() => {
  //   fetchMessages();
  // }, []);

  // useInterval(() => {
  //   console.log('useinterval');
  //   fetchMessages();
  // }, 1000);

  const sendMessage = async (
    roomId: number,
    message: string,
    messageType: string,
  ) => {
    try {
      const token = await fetchToken();
      const response = await axios.post('http://13.125.118.92:8080/chat/send', {
        params: {
          roomId: roomId,
          message: message,
          type: messageType,
        },
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('Message sent successfully:', response.data);
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleSendMessage = () => {
    if (roomId !== undefined) {
      sendMessage(roomId, messageInput, 'MESSAGE');
    } else {
      console.error('roomId is undefined');
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
          <Ionicons name="person-circle" size={80} color={'#352456'} />
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
                (msg.type === 'goTransaction' && role === 'BUYER') ||
                msg.type === 'message' ||
                msg.type === 'completeTransaction' ||
                msg.type === 'transferInfo' ||
                msg.type === 'ACCOUNT'
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
            {msg.type === 'goTransaction' && role === 'BUYER' ? (
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
                      goToAccountEnter();
                      goTransaction('계좌이체');
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
            ) : msg.type == 'completeTransaction' && role === 'BUYER' ? (
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
                    onPress={cancelMessage}>
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
            ) : msg.type === 'ACCOUNT' ? (
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
                    onPress={goToAccountEnter}>
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
            ) : msg.type === 'onTransaction' || msg.type === 'review' ? (
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
            ) : null}
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
          <AntDesign name="plus" size={13} color={'#352456'} />
        </TouchableOpacity>
        <TextInput
          value={messageInput}
          onChangeText={setMessageInput}
          onSubmitEditing={handleSendMessage}
          placeholder="Type your message..."
          style={{
            flex: 1,
            marginRight: 35,
            padding: 10,
            borderWidth: 1,
            borderColor: '#352456',
            borderRadius: 8,
          }}
        />

        <TouchableOpacity style={styles.iconContainer}>
          <Ionicons name="send" size={20} color={'#352456'} />
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
            <TouchableOpacity
              style={styles.categoryBtn}
              onPress={onCameraPress}>
              <Text style={styles.categoryBtn_text}>카메라</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.categoryBtn}
              onPress={onGalleryPress}>
              <Text style={styles.categoryBtn_text}>갤러리</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.categoryBtn}
              onPress={onTransactionPress}>
              <Text style={styles.categoryBtn_text}>거래 시작</Text>
            </TouchableOpacity>
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
    right: 15,
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
  categoryBtn: {
    backgroundColor: '#E8EAEC',
    width: 80,
    height: 35,
    borderRadius: 10,
    justifyContent: 'center',
    marginBottom: 10,
  },
  categoryBtn_text: {
    color: 'black',
    textAlign: 'center',
  },
});

export default ChatScreen;
