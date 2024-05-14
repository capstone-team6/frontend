import {
  View,
  Text,
  TextInput,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import React, {useState} from 'react';
import {StackNavigationProp} from '@react-navigation/stack';
import {RouteProp} from '@react-navigation/native';
import {RootStackParamList} from '../../types/Type';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
type AccountEnterRouteProp = RouteProp<RootStackParamList, 'AccountEnter'>;

type AccountEnterScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'AccountEnter'
>;

interface Props {
  route: AccountEnterRouteProp;
  navigation: AccountEnterScreenNavigationProp;
}

const AccountEnter: React.FC<Props> = ({route, navigation}) => {
  const {boardId, roomId} = route.params ?? {};
  const [holder, setHolder] = useState('');
  const [bank, setBank] = useState('');
  const [accountNumber, setAccountNumber] = useState('');

  const goToChatScreen = async () => {
    try {
      const store = await AsyncStorage.getItem('accessToken');
      const token = store ? JSON.parse(store) : null;

      console.log(token);

      const res = await axios.post(
        `http://13.125.118.92:8080/api/board/${boardId}/chat/${roomId}/pay`,
        {
          payMeth: 'PAY',
          holder: holder,
          bank: bank,
          accountNumber: accountNumber,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (res.status === 200) {
        console.log(res.data);
        navigation.navigate('ChatScreen', {
          newMessage: {message: '계좌정보를 보냈어요.', type: 'ACCOUNT'},
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View
      style={{
        flexDirection: 'column',
        height: Dimensions.get('screen').height,
        backgroundColor: 'white',
        flex: 1,
        alignItems: 'center',
      }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginTop: 20,
          marginBottom: 10,
        }}>
        <Text
          style={{
            fontFamily: 'NanumGothic-Bold',
            fontSize: 15,
            color: 'black',
          }}>
          은행선택
        </Text>
        <TextInput
          placeholder="은행선택"
          value={bank}
          onChangeText={setBank}
          style={{
            borderWidth: 1,
            borderColor: '#ccc',
            borderRadius: 5,
            paddingHorizontal: 10,
            paddingVertical: 8,
            fontSize: 16,
            width: '80%',
            marginLeft: 10,
          }}></TextInput>
      </View>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <Text
          style={{
            fontFamily: 'NanumGothic-Bold',
            fontSize: 15,
            color: 'black',
          }}>
          계좌번호
        </Text>
        <TextInput
          placeholder="-없이 숫자만 입력"
          value={accountNumber}
          onChangeText={setAccountNumber}
          style={{
            borderWidth: 1,
            borderColor: '#ccc',
            borderRadius: 5,
            paddingHorizontal: 10,
            paddingVertical: 8,
            fontSize: 16,
            width: '80%',
            marginLeft: 10,
            marginBottom: 10,
          }}></TextInput>
      </View>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <Text
          style={{
            fontFamily: 'NanumGothic-Bold',
            fontSize: 15,
            color: 'black',
          }}>
          예금주명
        </Text>
        <TextInput
          placeholder="예금주명 입력"
          value={holder}
          onChangeText={setHolder}
          style={{
            borderWidth: 1,
            borderColor: '#ccc',
            borderRadius: 5,
            paddingHorizontal: 10,
            paddingVertical: 8,
            fontSize: 16,
            width: '80%',
            marginLeft: 10,
          }}></TextInput>
      </View>
      <View style={{flexDirection: 'row', marginTop: 40}}>
        <TouchableOpacity
          style={{
            backgroundColor: '#E8EAEC',
            width: 80,
            height: 35,
            borderRadius: 10,
            justifyContent: 'center',
            marginRight: 40,
          }}>
          <Text
            style={{
              color: 'black',
              textAlign: 'center',
              fontFamily: 'NanumGothic-Bold',
              fontSize: 15,
            }}>
            취소
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            backgroundColor: '#E8EAEC',
            width: 80,
            height: 35,
            borderRadius: 10,
            justifyContent: 'center',
          }}
          onPress={goToChatScreen}>
          <Text
            style={{
              color: 'black',
              textAlign: 'center',
              fontFamily: 'NanumGothic-Bold',
              fontSize: 15,
            }}>
            전송
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
export default AccountEnter;
