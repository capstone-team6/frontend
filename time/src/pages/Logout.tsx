import axios from 'axios';
import React, {useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import * as KakaoLogin from '@react-native-seoul/kakao-login';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../types/Type';
import {useNavigation} from '@react-navigation/native';
import RNRestart from 'react-native-restart';

type LoginNavigation = StackNavigationProp<RootStackParamList, 'Logout'>;
const Logout = () => {
  const navigation = useNavigation<LoginNavigation>();

  const onSubmit = async () => {
    try {
      const result = await KakaoLogin.logout();
      if (result) {
        console.log('카카오 로그아웃 성공');
        await AsyncStorage.clear();
        RNRestart.Restart();
      }
    } catch (error) {
      console.log('카카로 로그아웃 에러: ', error);
    }
  };
  const goToBack = () => {
    navigation.goBack();
  };
  return (
    <View style={styles.container}>
      <Text style={styles.text}>로그아웃 하시겠습니까?</Text>
      <View style={styles.button}>
        <TouchableOpacity onPress={() => goToBack()}>
          <Text style={styles.bnt1}>취소</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onSubmit}>
          <Text style={styles.bnt2}>확인</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  text: {
    textAlign: 'center',
    fontFamily: 'NanumGothic-Reglular',
    color: 'black',
    fontSize: 23,
    paddingTop: 50,
    marginTop: 30,
  },
  button: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 100,
  },
  bnt1: {
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
  bnt2: {
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
});

export default Logout;
