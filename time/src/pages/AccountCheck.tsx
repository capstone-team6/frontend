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
  const [holder, setHolder] = useState('');
  const [bank, setBank] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const {boardId, roomId} = route.params;

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
          }}>
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
export default AccountCheck;
