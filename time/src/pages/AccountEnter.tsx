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
import {Picker} from '@react-native-picker/picker';
import {Alert} from 'react-native';
type AccountEnterRouteProp = RouteProp<RootStackParamList, 'AccountEnter'>;
type AccountEnterScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'ChatScreen'
>;

interface Props {
  route: AccountEnterRouteProp;
  navigation: AccountEnterScreenNavigationProp;
}

const AccountEnter: React.FC<Props> = ({route, navigation}) => {
  const {boardId, roomId} = route.params ?? {};
  // console.log(boardId, roomId);
  const [holder, setHolder] = useState('');
  const [bank, setBank] = useState('');
  // console.log(bank);
  const [accountNumber, setAccountNumber] = useState('');

  const onSubmit = async () => {
    if (!holder || bank === '' || !accountNumber) {
      Alert.alert('모든 항목을 입력해주세요.');
      return;
    }
    try {
      const store = await AsyncStorage.getItem('accessToken');
      const token = store ? JSON.parse(store) : null;

      console.log(token);

      const res = await axios.post(
        `http://13.125.118.92:8080/api/board/${boardId}/chat/${roomId}/pay`,
        {
          payMeth: 'ACCOUNT',
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
        <View
          style={{
            borderWidth: 1,
            borderColor: '#ccc',
            borderRadius: 5,
            paddingHorizontal: 10,
            paddingVertical: 8,
            width: '80%',
            height: 50,
            marginLeft: 10,
            justifyContent: 'center', // 수직 정렬을 위해 추가
          }}>
          <Picker
            selectedValue={bank}
            onValueChange={(itemValue, itemIndex) => setBank(itemValue)}>
            <Picker.Item label="은행 선택" value="none" />
            <Picker.Item label="국민은행" value="국민은행" />
            <Picker.Item label="우리은행" value="우리은행" />
            <Picker.Item label="신한은행" value="신한은행" />
            <Picker.Item label="하나은행" value="하나은행" />
          </Picker>
        </View>
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
            height: 50,
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
            height: 50,
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
          }}
          onPress={() => navigation.goBack()}>
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
          onPress={onSubmit}>
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
