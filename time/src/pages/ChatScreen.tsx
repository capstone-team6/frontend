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
  Image,
} from 'react-native';
import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../types/Type';
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
import {BooleanOptional, parse} from 'qs';
import AppealWrite from './AppealWrite';
import App from '../../App';
import ImageResizer from 'react-native-image-resizer';
import {useFocusEffect} from '@react-navigation/native';
import {useLayoutEffect} from 'react';
import {Alert} from 'react-native';
import Antdesign from 'react-native-vector-icons/AntDesign';

type ChatScreenRouteProp = RouteProp<RootStackParamList, 'ChatScreen'>;
type ChatScreenNavigationProp =
  | StackNavigationProp<RootStackParamList, 'AccountEnter'>
  | StackNavigationProp<RootStackParamList, 'AccountCheck'>
  | StackNavigationProp<RootStackParamList, 'Profile'>
  | StackNavigationProp<RootStackParamList, 'AppealWrite'>;

interface Props {
  route: ChatScreenRouteProp;
  navigation: ChatScreenNavigationProp;
}

type PaymentType = '만나서 결제' | '계좌이체' | '틈새 페이' | null;

type ImageType = {
  uri: string;
  type: string;
  name: string;
};

interface ChatParams {
  userName: string | undefined;
  roomName: string | undefined;
  boardId: number | undefined;
  otherUserId: number | undefined;
}

const ChatScreen: React.FC<Props> = ({route, navigation}) => {
  const {
    userName,
    roomName,
    boardId,
    otherUserId,
    holder,
    bank,
    accountNumber,
  } = route.params;
  console.log(userName, roomName, boardId, otherUserId);
  const [role, setRole] = useState('BUYER');
  const [roomId, setRoomId] = useState();
  const [image, setImage] = useState();
  // const roomId = 1;
  const [messageInput, setMessageInput] = useState('');
  const [selectedPayment, setSelectedPayment] = useState<PaymentType>(null);
  const [selectedAction, setSelectedAction] = useState<
    null | 'complete' | 'cancel'
  >(null);
  const [chatList, setChatList] = useState<
    {
      roomId: number;
      messageId?: number | null;
      writer?: string;
      message: string;
      type: string;
      time?: string;
      buyerRead?: boolean | null;
      sellerRead?: boolean | null;
    }[]
  >([]);
  const [timepay, setTimepay] = useState();
  const [modalVisible, setModalVisible] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [areButtonsEnabled, setAreButtonsEnabled] = useState(true);
  const [selectedButton, setSelectedButton] = useState(null);
  const [images, setImages] = useState<ImageType[]>([]);
  const [isTransactionStarted, setIsTransactionStarted] = useState(false);
  const [u, setu] = useState();
  const [r, setr] = useState();
  const [b, setb] = useState();
  const [o, seto] = useState();
  async function fetchToken() {
    const item = await AsyncStorage.getItem('accessToken');
    return item ? JSON.parse(item) : null;
  }
  const [chatParams, setChatParams] = useState<ChatParams | null>(null);
  const [title, setTitle] = useState();
  const [price, setPrice] = useState();

  useEffect(() => {
    AsyncStorage.getItem('accessToken').then(item => {
      const token = item ? JSON.parse(item) : null;
      console.log(token);
      axios
        .get(`http://13.125.118.92:8080/api/board/${boardId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then(response => {
          console.log('Data received:', response.data);
          setTitle(response.data.data.title);
          setPrice(response.data.data.itemPrice);
          console.log(title);
        })
        .catch(error => {
          console.error('Error fetching data:', error);
        });
    });
  }, []);

  useEffect(() => {
    const saveParams = async () => {
      const paramsToSave = {userName, roomName, boardId, otherUserId};
      await AsyncStorage.setItem('chatParams', JSON.stringify(paramsToSave));
      setChatParams(paramsToSave);
      console.log('chatParams', chatParams);
    };

    saveParams();
  }, [route.params]);

  useEffect(() => {
    const loadParams = async () => {
      const storedParams = await AsyncStorage.getItem('chatParams');
      if (storedParams) {
        const parsedParams = JSON.parse(storedParams);
        console.log('parsedParams', parsedParams);
        setu(parsedParams.userName);
        setr(parsedParams.roomName);
        setb(parsedParams.boardId);
        seto(parsedParams.otherUserId);
        console.log('재로드', u, r, b, o);
      }
    };

    loadParams();
  }, []);

  useLayoutEffect(() => {
    const parent = navigation.getParent();
    if (parent) {
      parent.setOptions({
        tabBarStyle: {display: 'none'},
      });
    }

    return () => {
      if (parent) {
        parent.setOptions({
          tabBarStyle: undefined,
        });
      }
    };
  }, [navigation]);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    console.log('fetchMessage');
    const token = await fetchToken();
    console.log(token);
    const data = {
      roomName: roomName,
      boardId: boardId,
    };
    await axios
      .post('http://13.125.118.92:8080/chat/room', data, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
      .then(response => {
        console.log(JSON.stringify(response.data));
        const data = JSON.stringify(response.data);
        console.log(data);
        if (data) {
          const d = JSON.parse(data);
          console.log('받은 데이터', d);
          setRole(d.roleType);
          setChatList(d.chatlist);
          setRoomId(d.roomId);
          console.log(role, chatList, roomId);
        }
      })
      .catch(error => console.error('FETCH MESSAGES ERROR: ', error));
  };

  useInterval(() => {
    console.log('useinterval');
    fetchMessages();
  }, 1000);

  useEffect(() => {
    if (route.params?.newMessage) {
      const {message, type} = route.params.newMessage;
      console.log(message, type);
      if (typeof roomId === 'number' && type === 'ACCOUNT') {
        handlePaymentSelection('계좌이체');
      } else {
        console.error('roomId is missing or invalid');
      }
    }
  }, [route.params?.newMessage]);

  useEffect(() => {
    const url = 'http://13.125.118.92:8080/member/profile';

    AsyncStorage.getItem('accessToken').then(item => {
      const token = item ? JSON.parse(item) : null;
      console.log('token', token);
      axios
        .get(url, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        })
        .then(response => {
          const d = JSON.stringify(response.data.data);
          console.log('profile 받은 데이터', d);
          if (d) {
            const data = JSON.parse(d);
            setTimepay(data.timePay);
          }
        })
        .catch(error => {
          console.error('Error fetching data:', error);
        });
    });
  }, []);

  const sendMessage = async (
    roomId: number,
    message: string,
    messageType: string,
  ) => {
    try {
      console.log('sendMessage');
      const token = await fetchToken();

      const formData = new FormData();
      formData.append('roomId', roomId);
      formData.append('message', message);
      formData.append('type', messageType);

      const response = await axios.post(
        'http://13.125.118.92:8080/chat/send',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        },
      );

      console.log('SENDMESSAGE SUCCESSFULLY:', response.data);
      setImage(response.data.images);
    } catch (error) {
      console.error('FAILED TO SENDMESSAGE:', error);
    }
  };

  const handleSendMessage = () => {
    if (roomId !== undefined) {
      if (messageInput.trim() !== '') {
        setChatList(currentChatList => [
          ...currentChatList,
          {
            roomId: roomId,
            message: messageInput,
            type: 'MESSAGE',
          },
        ]);
        setMessageInput('');
        sendMessage(roomId, messageInput, 'MESSAGE');
      } else {
        return;
      }
    } else {
      console.error('HANDLESENDMESSAGE: roomId is undefined');
    }
  };

  const goBack = () => {
    navigation.goBack();
  };

  const goToProfile = () => {
    navigation.navigate('Profile', {
      boardId: boardId,
      userId: otherUserId || o,
      fromPostDetail: false,
    });
  };

  const goToAccountEnter = () => {
    navigation.navigate('AccountEnter', {
      boardId: boardId,
      roomId: roomId,
      otherUserId: otherUserId,
    });
  };

  const goToAccountCheck = () => {
    navigation.navigate('AccountCheck', {
      boardId: boardId,
      roomId: roomId,
      otherUserId: otherUserId,
    });
  };

  const goToAppeal = () => {
    navigation.navigate('AppealWrite', {objectId: otherUserId});
  };

  const onCameraPress = () => {
    console.log('camera');
    launchCamera({mediaType: 'photo'}, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorMessage) {
        console.log('ImagePicker Error: ', response.errorMessage);
      } else {
        const uri = response.assets?.[0]?.uri;
        const type = response.assets?.[0]?.type;
        const name = response.assets?.[0]?.fileName;
        if (uri && type && name) {
          const width = response.assets?.[0]?.width ?? 100;
          const height = response.assets?.[0]?.height ?? 100;

          ImageResizer.createResizedImage(
            uri,
            width,
            height,
            type.includes('jpeg') ? 'JPEG' : 'PNG',
            100,
            0,
          )
            .then(res => {
              sendImageToServer(
                res.uri,
                type.includes('png') ? 'image/png' : 'image/jpeg',
                name,
              );
            })
            .catch(err => {
              console.log('Image Resizing Error: ', err);
            });
        } else {
          console.log('No image selected');
        }
      }
    });
  };

  const onGalleryPress = () => {
    launchImageLibrary({mediaType: 'photo'}, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorMessage) {
        console.log('ImagePicker Error: ', response.errorMessage);
      } else {
        const uri = response.assets?.[0]?.uri;
        const type = response.assets?.[0]?.type;
        const name = response.assets?.[0]?.fileName;
        if (uri && type && name) {
          const width = response.assets?.[0]?.width ?? 100;
          const height = response.assets?.[0]?.height ?? 100;

          ImageResizer.createResizedImage(
            uri,
            width,
            height,
            type.includes('jpeg') ? 'JPEG' : 'PNG',
            100,
            0,
          )
            .then(res => {
              sendImageToServer(
                res.uri,
                type.includes('png') ? 'image/png' : 'image/jpeg',
                name,
              );
            })
            .catch(err => {
              console.log('Image Resizing Error: ', err);
            });
        } else {
          console.log('No image selected');
        }
      }
    });
  };

  const sendImageToServer = async (
    imageUri: string,
    type: string,
    name: string,
  ) => {
    const formData = new FormData();
    formData.append('images', {
      uri: imageUri,
      type: type,
      name: name,
    });
    formData.append('roomId', roomId);
    formData.append('type', 'IMAGE');

    try {
      const store = await AsyncStorage.getItem('accessToken');
      const token = store ? JSON.parse(store) : null;

      console.log(token);

      const response = await axios.post(
        'http://13.125.118.92:8080/chat/send',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        },
      );
      console.log('Image uploaded successfully:', response.data);
      setImage(response.data.images);
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  const onTransactionPress = () => {
    setModalVisible(false);
    setIsTransactionStarted(true);
    console.log(roomId);
    if (roomId !== undefined) {
      setChatList(currentChatList => [
        ...currentChatList,
        {
          roomId: roomId,
          message: '거래가 시작됐어요.\n결제 방법을 선택해주세요.',
          type: 'GOTRANSACTION',
        },
      ]);
      sendMessage(
        roomId,
        '거래가 시작됐어요.\n결제 방법을 선택해주세요.',
        'GOTRANSACTION',
      );
    } else {
      console.error('Transaction Press ERROR');
    }
  };

  const goTransaction = async (pay: string) => {
    try {
      const token = await fetchToken();
      console.log('결제 방법 선택');
      const paymentData = {
        payMeth:
          pay === '틈새 페이' ? 'PAY' : pay === '만나서 결제' ? 'MEET' : null,
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
      console.log(res);
      if (res.status === 200) {
        console.log('goTransaction', res.data);
        if (pay === '틈새 페이' && res.data.status != 500) {
          payInfo();
        } else if (pay === '틈새 페이' && res.data.status == 500) {
          Alert.alert(
            '알림',
            '틈새 페이의 잔액이 부족합니다.',
            [{text: '확인', onPress: () => console.log('확인 버튼 눌림')}],
            {cancelable: false},
          );
        } else if (pay === '만나서 결제') {
          transferComplete();
        } else {
          return;
        }
      }
    } catch (error) {
      console.log(error);
    }
    // if (pay === '틈새 페이') {
    //   payInfo();
    // } else if (pay === '만나서 결제') {
    //   transferComplete();
    // } else {
    // }

    if (roomId !== undefined) {
      setChatList(currentChatList => [
        ...currentChatList,
        {
          roomId: roomId,
          message: `${pay}로 거래가 진행될 예정이에요.\n해당 글이 거래중 상태로 변경되었어요.`,
          type: 'ONTRANSACTION',
        },
      ]);
      sendMessage(
        roomId,
        `${pay}로 거래가 진행될 예정이에요.\n해당 글이 거래중 상태로 변경되었어요.`,
        'ONTRANSACTION',
      );
      if (pay === '계좌이체') {
        Account();
      }
    } else {
      console.error('goTransaction ERROR');
    }
  };

  const completeMessage = async () => {
    setSelectedAction('complete');
    if (!isCompleted) {
      if (roomId !== undefined) {
        setChatList(currentChatList => [
          ...currentChatList,
          {
            roomId: roomId,
            message: '거래가 완료되었어요. 상대방의 후기를 남겨주세요.',
            type: 'REVIEW',
          },
        ]);
        sendMessage(
          roomId,
          '거래가 완료되었어요. 상대방의 후기를 남겨주세요.',
          'REVIEW',
        );
      } else {
        console.error('COMPLETEMESSAGE ERROR');
      }

      try {
        axios
          .put(
            `http://13.125.118.92:8080/api/board/${boardId}/chat/${roomId}/complete`,
          )
          .then(res => {
            const result = res.data;
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
    }
    setIsCompleted(true);
  };

  const sellerComplete = () => {
    if (roomId !== undefined) {
      setChatList(currentChatList => [
        ...currentChatList,
        {
          roomId: roomId,
          message:
            "거래를 완료했다면 '거래 완료'를 눌러주세요.\n거짓으로 눌렀을 경우 검토 후 회원 정지 처리 됩니다.",
          type: 'SELLERCOMPLETE',
        },
      ]);
      sendMessage(
        roomId,
        "거래를 완료했다면 '거래 완료'를 눌러주세요.\n 거짓으로 눌렀을 경우 검토 후 회원 정지 처리 됩니다.",
        'SELLERCOMPLETE',
      );
    } else {
      console.error('sellerComplete ERROR');
    }
  };

  const sellerPress = async () => {
    if (roomId !== undefined) {
      setChatList(currentChatList => [
        ...currentChatList,
        {
          roomId: roomId,
          message:
            '시간 판매자가 ‘거래 완료’를 눌렀어요. 최종 거래를 완료하려면 시간 구매자도 거래 완료를 눌러주세요.\n거래 완료가 되지 않았다면 이의신청을 해주세요.아무 응답이 없을 경우 3일 후에 자동으로 ‘거래 완료’ 상태로 변경됩니다.',
          type: 'APPEAL',
        },
      ]);

      sendMessage(
        roomId,
        '시간 판매자가 ‘거래 완료’를 눌렀어요.최종 거래를 완료하려면 시간 구매자도 거래 완료를 눌러주세요.\n거래 완료가 되지 않았다면 이의신청을 해주세요.아무 응답이 없을 경우 3일 후에 자동으로 ‘거래 완료’ 상태로 변경됩니다.',
        'APPEAL',
      );
    } else {
      console.error('sellerComplete ERROR');
    }
  };

  const handlePaymentSelection = (paymentType: PaymentType) => {
    setSelectedPayment(paymentType);
    if (paymentType) {
      goTransaction(paymentType);
    }
  };

  const payInfo = async () => {
    if (roomId !== undefined) {
      setChatList(currentChatList => [
        ...currentChatList,
        {
          roomId: roomId,
          message:
            '‘틈새페이’ 는 안전한 결제를 위하여 포인트 차감 후 결제완료시 시간판매자의 틈새페이로 포인트가 전달됩니다. 또한, 시간판매자가 거래완료를 누른 뒤 시간 구매자가 거래완료를 눌러야 거래가 최종 완료됩니다.',
          type: 'PAYINFO',
        },
      ]);
      await sendMessage(
        roomId,
        '‘틈새페이’ 는 안전한 결제를 위하여 포인트 차감 후 결제완료시 시간판매자의 틈새페이로 포인트가 전달됩니다. 또한, 시간판매자가 거래완료를 누른 뒤 시간 구매자가 거래완료를 눌러야 거래가 최종 완료됩니다.',
        'PAYINFO',
      );
    } else {
      console.error('goTransaction ERROR');
    }
    if (role === 'BUYER') {
      onPay();
      // sellerComplete();
      // completeMessage();
      // sellerComplete();
    }
    // Appeal();
  };

  const onPay = async () => {
    if (roomId !== undefined) {
      setChatList(currentChatList => [
        ...currentChatList,
        {
          roomId: roomId,
          message: `틈새페이가 차감되었어요.\n현재 잔고 : ${timepay}원`,
          type: 'PAY',
        },
      ]);
      sendMessage(
        roomId,
        `틈새페이가 차감되었어요.\n현재 잔고 : ${timepay}원`,
        'PAY',
      );
      sellerComplete();
    } else {
      console.error('onPay ERROR');
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
          type: 'COMPLETETRANSACTION',
        },
      ]);
      sendMessage(
        roomId,
        '거래를 완료했다면 "거래 완료"를 눌러주세요.\n3일 후에 자동으로 "거래완료"상태로 변경됩니다.',
        'COMPLETETRANSACTION',
      );
    } else {
      console.error('transferComplete ERROR');
    }
  };

  const cancelMessage = async () => {
    setSelectedAction('cancel');
    try {
      axios
        .put(
          `http://13.125.118.92:8080/api/board/${boardId}/chat/${roomId}/cancel`,
        )
        .then(res => {
          const result = res.data;
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

  const Account = () => {
    if (roomId !== undefined) {
      setChatList(currentChatList => [
        ...currentChatList,
        {
          roomId: roomId,
          message: '계좌 정보를 보냈어요.',
          type: 'ACCOUNT',
        },
      ]);
      sendMessage(roomId, '계좌 정보를 보냈어요.', 'ACCOUNT');
      transferComplete();
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
  const goToPostDetail = () => {
    navigation.navigate('PostDetail', {boardId});
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
            elevation: 5,
            backgroundColor: '#fff',
            marginHorizontal: 10,
            borderRadius: 5,
            height: 30,
            marginBottom: 10,
          }}>
          <TouchableOpacity onPress={goToPostDetail}>
            <View
              style={{
                flexDirection: 'row',
                // alignSelf: 'center',
                justifyContent: 'space-between',
                paddingHorizontal: 10,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                }}>
                <Text>{title}</Text>
                <View style={{width: 20}}></View>
                <Text>{price}원</Text>
              </View>
              <AntDesign name="arrowright" size={24} color="#A58EFF" />
            </View>
          </TouchableOpacity>
        </View>

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
            {userName || u}
          </Text>
        </View>

        {chatList?.map((msg, index) => (
          <View
            key={index}
            style={{
              alignSelf:
                (msg.type === 'GOTRANSACTION' && role === 'BUYER') ||
                (msg.writer !== userName && msg.type === 'MESSAGE') ||
                msg.type === 'IMAGE' ||
                (msg.type === 'COMPLETETRANSACTION' && role === 'BUYER') ||
                msg.type === 'transferInfo' ||
                (msg.type === 'ACCOUNT' && role === 'BUYER') ||
                msg.type === 'PAY' ||
                msg.type === 'APPEAL' ||
                (msg.type === 'SELLERCOMPLETE' && role === 'SELLER')
                  ? 'flex-end'
                  : msg.type === 'ONTRANSACTION' ||
                    msg.type === 'REVIEW' ||
                    msg.type === 'PAYINFO'
                  ? 'center'
                  : 'flex-start',
              margin: 10,
              width:
                msg.type === 'ONTRANSACTION' ||
                msg.type === 'REVIEW' ||
                msg.type === 'PAYINFO'
                  ? '100%'
                  : 'auto',
            }}>
            {msg.type === 'GOTRANSACTION' && role === 'BUYER' ? (
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
                    disabled={selectedPayment !== null}
                    style={[
                      {
                        backgroundColor: '#C9BAE5',
                        width: '100%',
                        height: 35,
                        borderRadius: 10,
                        justifyContent: 'center',
                        marginVertical: 8,
                      },
                      {
                        opacity:
                          selectedPayment !== null &&
                          selectedPayment !== '만나서 결제'
                            ? 0.5
                            : 1,
                      },
                    ]}
                    onPress={() => {
                      handlePaymentSelection('만나서 결제');
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
                    disabled={selectedPayment !== null}
                    style={[
                      {
                        backgroundColor: '#C9BAE5',
                        width: '100%',
                        height: 35,
                        borderRadius: 10,
                        justifyContent: 'center',
                        marginVertical: 8,
                      },
                      {
                        opacity:
                          selectedPayment !== null &&
                          selectedPayment !== '계좌이체'
                            ? 0.5
                            : 1,
                      },
                    ]}
                    onPress={() => {
                      goToAccountEnter();
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
                    disabled={selectedPayment !== null}
                    style={[
                      {
                        backgroundColor: '#C9BAE5',
                        width: '100%',
                        height: 35,
                        borderRadius: 10,
                        justifyContent: 'center',
                        marginVertical: 8,
                      },
                      {
                        opacity:
                          selectedPayment !== null &&
                          selectedPayment !== '틈새 페이'
                            ? 0.5
                            : 1,
                      },
                    ]}
                    onPress={() => {
                      handlePaymentSelection('틈새 페이');
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
            ) : msg.type == 'COMPLETETRANSACTION' && role === 'BUYER' ? (
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
                    // disabled={
                    //   isCompleted ||
                    //   (selectedAction !== null && selectedAction !== 'complete')
                    // }
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
                    style={[
                      {
                        backgroundColor: '#C9BAE5',
                        width: '100%',
                        height: 35,
                        borderRadius: 10,
                        justifyContent: 'center',
                        marginVertical: 8,
                      },
                      {
                        opacity:
                          selectedAction !== null &&
                          selectedAction !== 'complete'
                            ? 0.5
                            : 1,
                      },
                    ]}
                    onPress={cancelMessage}>
                    <Text
                      disabled={
                        selectedAction !== null && selectedAction !== 'cancel'
                      }
                      style={[
                        {
                          fontFamily: 'NanumGothic',
                          fontSize: 15,
                          textAlign: 'center',
                          color: 'black',
                          fontWeight: 'bold',
                        },
                        {
                          opacity:
                            selectedAction !== null &&
                            selectedAction !== 'cancel'
                              ? 0.5
                              : 1,
                        },
                      ]}>
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
                    onPress={goToAccountCheck}>
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
            ) : msg.type === 'ONTRANSACTION' ||
              msg.type === 'REVIEW' ||
              msg.type === 'PAYINFO' ? (
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
                          msg.type === 'ONTRANSACTION' ||
                          msg.type === 'REVIEW' ||
                          msg.type === 'PAYINFO'
                            ? 'center'
                            : 'auto',
                        marginLeft: 5,
                      }}>
                      {msg.message}
                    </Text>
                  </View>
                  <View>
                    {msg.type === 'REVIEW' ? (
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
            ) : msg.type === 'MESSAGE' || msg.type === 'IMAGE' ? (
              <View
                style={{
                  alignSelf:
                    msg.writer === userName ? 'flex-end' : 'flex-start',
                  backgroundColor:
                    msg.writer === userName ? '#F1F1F1' : '#C9BAE5',
                  padding: 10,
                  borderRadius: 8,
                  marginVertical: 5,
                  marginHorizontal: 10,
                }}>
                <Text style={{color: 'black'}}>{msg.message}</Text>
                <Image
                  source={{
                    uri: `http://13.125.118.92:8080/images/jpg/${image}`,
                  }}
                  style={styles.post_image}
                  // resizeMethod='resize'
                  // onError={(error) => console.error("이미지 로딩 오류:", error)}
                />
                <Text style={{fontSize: 10, color: 'gray', textAlign: 'right'}}>
                  {msg.time}
                </Text>
              </View>
            ) : msg.type === 'PAY' && role === 'BUYER' ? (
              <View
                style={{
                  alignSelf:
                    msg.writer === userName ? 'flex-end' : 'flex-start',
                  backgroundColor: '#F1F1F1',
                  padding: 10,
                  borderRadius: 8,
                  marginHorizontal: 10,
                }}>
                <Text style={{color: 'black', marginBottom: 5}}>
                  {msg.message}
                </Text>
                <View>
                  <TouchableOpacity
                    style={[
                      {
                        backgroundColor: '#C9BAE5',
                        width: '100%',
                        height: 35,
                        borderRadius: 10,
                        justifyContent: 'center',
                        alignSelf: 'flex-end',
                        marginVertical: 5,
                      },
                      {
                        opacity:
                          selectedAction !== null &&
                          selectedAction !== 'complete'
                            ? 0.5
                            : 1,
                      },
                    ]}
                    onPress={cancelMessage}>
                    <Text
                      disabled={
                        selectedAction !== null && selectedAction !== 'cancel'
                      }
                      style={[
                        {
                          fontFamily: 'NanumGothic',
                          fontSize: 15,
                          textAlign: 'center',
                          color: 'black',
                          fontWeight: 'bold',
                        },
                        {
                          opacity:
                            selectedAction !== null &&
                            selectedAction !== 'cancel'
                              ? 0.5
                              : 1,
                        },
                      ]}>
                      거래 취소
                    </Text>
                  </TouchableOpacity>
                </View>
                <Text style={{fontSize: 10, color: 'gray', textAlign: 'right'}}>
                  {msg.time}
                </Text>
              </View>
            ) : msg.type === 'SELLERCOMPLETE' && role === 'SELLER' ? (
              <View
                style={{
                  alignSelf: 'flex-end',
                  backgroundColor: '#F1F1F1',
                  padding: 10,
                  borderRadius: 8,
                  marginVertical: 5,
                  marginHorizontal: 10,
                }}>
                <Text style={{color: 'black'}}>{msg.message}</Text>
                <View>
                  <TouchableOpacity
                    style={[
                      {
                        backgroundColor: '#C9BAE5',
                        width: '100%',
                        height: 35,
                        borderRadius: 10,
                        justifyContent: 'center',
                        alignSelf: 'flex-end',
                        marginVertical: 5,
                      },
                      {
                        opacity:
                          selectedAction !== null &&
                          selectedAction !== 'complete'
                            ? 0.5
                            : 1,
                      },
                    ]}
                    onPress={sellerPress}>
                    <Text
                      // disabled={
                      //   selectedAction !== null && selectedAction !== 'cancel'
                      // }
                      style={[
                        {
                          fontFamily: 'NanumGothic',
                          fontSize: 15,
                          textAlign: 'center',
                          color: 'black',
                          fontWeight: 'bold',
                        },
                        {
                          opacity:
                            selectedAction !== null &&
                            selectedAction !== 'cancel'
                              ? 0.5
                              : 1,
                        },
                      ]}>
                      거래 완료
                    </Text>
                  </TouchableOpacity>
                </View>
                <Text style={{fontSize: 10, color: 'gray', textAlign: 'right'}}>
                  {msg.time}
                </Text>
              </View>
            ) : msg.type === 'APPEAL' && role === 'BUYER' ? (
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
                    // disabled={
                    //   // isCompleted ||
                    //   // (selectedAction !== null && selectedAction !== 'complete')
                    // }
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
                    onPress={goToAppeal}
                    style={[
                      {
                        backgroundColor: '#C9BAE5',
                        width: '100%',
                        height: 35,
                        borderRadius: 10,
                        justifyContent: 'center',
                        marginVertical: 8,
                      },
                    ]}>
                    <Text
                      disabled={
                        selectedAction !== null && selectedAction !== 'cancel'
                      }
                      style={[
                        {
                          fontFamily: 'NanumGothic',
                          fontSize: 15,
                          textAlign: 'center',
                          color: 'black',
                          fontWeight: 'bold',
                        },
                      ]}>
                      이의 신청
                    </Text>
                  </TouchableOpacity>
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
          <AntDesign name="plus" size={25} color={'#352456'} />
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

        <TouchableOpacity
          style={styles.iconContainer}
          onPress={handleSendMessage}>
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
            <View style={styles.closeBtn}>
              <TouchableOpacity
                onPress={() => {
                  setModalVisible(!modalVisible);
                }}>
                <Text>X</Text>
              </TouchableOpacity>
            </View>
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
              onPress={onTransactionPress}
              disabled={isTransactionStarted}>
              <Text style={styles.categoryBtn_text}>거래 시작</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  closeBtn: {
    alignSelf: 'flex-end',
    marginBottom: 30,
    zIndex: 1,
  },
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
  // centeredView: {
  //   flex: 1,
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   marginTop: 22,
  // },
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
    position: 'relative',
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
    marginBottom: 15,
  },
  categoryBtn_text: {
    color: 'black',
    textAlign: 'center',
  },
  post_image: {
    // width: 150,
    // height: 150,
    // borderRadius: 25,
    // marginRight: 10,
    // position: 'absolute',
    // left: 10,
  },
});

export default ChatScreen;
