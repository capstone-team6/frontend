import {
  View,
  Text,
  TextInput,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {StackNavigationProp} from '@react-navigation/stack';
import {RouteProp} from '@react-navigation/native';
import {RootStackParamList} from '../../types/Type';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

type AccountCheckRouteProp = RouteProp<RootStackParamList, 'AccountCheck'>;

type AccountCheckScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'AccountCheck'
>;

interface Props {
  route: AccountCheckRouteProp;
  navigation: AccountCheckScreenNavigationProp;
}

const AccountCheck: React.FC<Props> = ({route, navigation}) => {
  const {boardId, roomId} = route.params;
  // console.log(boardId, roomId);
  const [holder, setHolder] = useState('');
  const [bank, setBank] = useState('');
  const [accountNumber, setAccountNumber] = useState('');

  useEffect(() => {
    axios
      .get(
        `http://13.125.118.92:8080/api/board/${boardId}/chat/${roomId}/account`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      )
      .then(response => {
        console.log(JSON.stringify(response.data.data));
        const data = JSON.stringify(response.data.data);
        console.log(data);

        if (data) {
          const d = JSON.parse(data);
          setHolder(d.holder);
          setBank(d.bank);
          setAccountNumber(d.accountNumber);
        }
      });
  }, [boardId, roomId]);

  return (
    <View
      style={{
        flexDirection: 'column',
        height: Dimensions.get('screen').height,
        backgroundColor: 'white',
        flex: 1,

        paddingLeft: 40,
      }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'flex-start',
          marginTop: 20,
          marginBottom: 10,
        }}>
        <View style={{marginLeft: 10}}>
          <Text
            style={{
              fontFamily: 'NanumGothic',
              fontSize: 20,
              color: 'black',
              marginBottom: 10,
            }}>
            예금주: {holder}
          </Text>
          <Text
            style={{
              fontFamily: 'NanumGothic',
              fontSize: 20,
              color: 'black',
              marginBottom: 10,
            }}>
            은행명: {bank}
          </Text>
          <Text
            style={{fontFamily: 'NanumGothic', fontSize: 20, color: 'black'}}>
            계좌번호: {accountNumber}
          </Text>
        </View>
      </View>
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: 40,
        }}>
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
            확인
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
export default AccountCheck;
