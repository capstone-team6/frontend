import axios from 'axios';
import React, {useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  Alert,
  Dimensions,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../types/Type';

type ReturnNavigation = StackNavigationProp<RootStackParamList, 'Mypage'>;

const NameChange = () => {
  //닉네임 설정
  const [nickName, setNickname] = useState('');
  //중복 시 에러 메시지
  const [errorText, setErrorText] = useState('');
  //닉네임 유효 여부
  const [isNicnameVaild, setIsNicNameVaild] = useState(false);

  const navigation = useNavigation<ReturnNavigation>();
  const goToReturn = () => {
    navigation.goBack();
  };

  const handleNickNameChange = (text: string) => {
    setNickname(text);
    setIsNicNameVaild(false);
  };

  // 닉네임 중복 검사
  const checkName = async (name: string) => {
    try {
      const data = {
        nickname: name,
      };
      const nameRes = await axios.post(
        'http://13.125.118.92:8080/sign-up/nicknameCheck',
        data,
      );
      if (nameRes.status === 200) {
        console.log(nameRes.data);
        if (nameRes.data.data.success === true) {
          setIsNicNameVaild(true);
          setErrorText('사용 가능한 닉네임 입니다.');
        } else {
          setIsNicNameVaild(false);
          setErrorText('이미 존재하는 닉네임 입니다.');
        }
      }
    } catch (error: any) {
      console.log(error);
    }
  };

  const onSubmit = async () => {
    try {
      AsyncStorage.getItem('accessToken').then(token=>{
        const accessToken=token?JSON.parse(token):null
        const data = {
          nickname: nickName,
        };
        axios
          .put('http://13.125.118.92:8080/nickname/change', data,{
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${accessToken}`,
            },
          }
          )
          .then(res => {
            const result = res.data.data;
            console.log(result);
            if (result.isChange == true) {
              console.log('닉네임 변경이 완료되었습니다');
              goToReturn();
            }
          })
          .catch(err => {
            const result = err.response.data.data;
            console.log(result);
          });
      })
      
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.input}>
        <Text
          style={{
            fontSize: 18,
            marginTop: 50,
            fontFamily: 'NanumGothic-Regular',
            color: 'black',
          }}>
          닉네임 변경
        </Text>
        <View style={styles.inputcheck}>
          <TextInput
            placeholder="10자 이내 입력"
            value={nickName}
            onChangeText={handleNickNameChange}
            style={{
              borderWidth: 1,

              marginTop: 10,
              fontFamily: 'NanumGothic-Regular',
              width: Dimensions.get('screen').width / 1.6,
              marginRight: 10,
            }}></TextInput>
          <TouchableOpacity style={{paddingTop: 13}}>
            <Text
              style={styles.checkButton}
              onPress={() => checkName(nickName)}>
              중복확인
            </Text>
          </TouchableOpacity>
        </View>
        {errorText ? <Text style={{color: 'black'}}>{errorText}</Text> : null}
      </View>
      <View style={styles.button}>
        <TouchableOpacity onPress={goToReturn}>
          <Text style={styles.text1}>취소</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onSubmit} disabled={!isNicnameVaild}>
          <Text style={styles.text2}>완료</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'white',
  },
  input: {
    paddingHorizontal: 50,
    marginTop: 30,
  },
  button: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 100,
  },
  text1: {
    fontFamily: 'NanumGothic-Reglular',
    color: 'black',
    fontSize: 20,
    borderColor: 'gray',
    backgroundColor: '#D9D9D9',
    borderRadius: 5,
    width: 90,
    height: 45,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  text2: {
    fontFamily: 'NanumGothic-Reglular',
    color: 'black',
    fontSize: 20,
    borderColor: 'gray',
    backgroundColor: '#C9BAE5',
    borderRadius: 5,
    width: 90,
    height: 45,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  inputcheck: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  checkButton: {
    fontFamily: 'NanumGothic-Reglular',
    color: 'black',
    fontSize: 15,
    // backgroundColor: '#C9BAE5',
    width: 70,
    height: 40,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
});

export default NameChange;
