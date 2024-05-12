import {
  View,
  Text,
  TextInput,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import React from 'react';

const AccountEnter = () => {
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
export default AccountEnter;
