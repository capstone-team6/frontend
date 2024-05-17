import React, {useState, useEffect} from 'react';
import {
  View,
  Image,
  StyleSheet,
  Dimensions,
  Text,
  TouchableOpacity,
} from 'react-native';
import {Circle, Path, Rect, Svg} from 'react-native-svg';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import M from 'react-native-vector-icons/MaterialCommunityIcons';
import {ScrollView} from 'react-native-gesture-handler';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../types/Type';
import {useNavigation} from '@react-navigation/native';
import {RouteProp} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

type ChangeNavigation =
  | StackNavigationProp<RootStackParamList, 'NameChange'>
  | StackNavigationProp<RootStackParamList, 'ServiceEvaluationScreen'>;

type ProfileRouteProp = RouteProp<RootStackParamList, 'Profile'>;

interface Props {
  route: ProfileRouteProp;
}

const Profile: React.FC<Props> = ({route}) => {
  const userId = route.params?.userId;
  const boardId = route.params?.boardId;
  // console.log('USERID', userId);
  const [nickname, setNickname] = useState<string | undefined>('닉네임');
  // console.log('NickName', nickname);
  const [mannerTime, setMannerTime] = useState<number | undefined>();
  const [totalTime, setTotalTime] = useState<number | undefined>();
  const navigation = useNavigation<ChangeNavigation>();
  const goToChange = () => {
    navigation.navigate('NameChange');
  };

  const goToManner = () => {
    navigation.navigate('ServiceEvaluationScreen', {
      boardId: boardId,
      userId: userId,
    });
  };

  useEffect(() => {
    const url = userId
      ? `http://13.125.118.92:8080/member/${userId}/profile`
      : 'http://13.125.118.92:8080/member/profile';

    AsyncStorage.getItem('accessToken').then(item => {
      const token = item ? JSON.parse(item) : null;
      console.log(token);
      axios
        .get(url, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        })
        .then(response => {
          console.log(JSON.stringify(response.data.data));
          const d = JSON.stringify(response.data.data);
          if (d) {
            const data = JSON.parse(d);
            setNickname(data.nickname);
            setMannerTime(data.mannerTime);
          }
        })
        .catch(error => {
          console.error('Error fetching data:', error);
        });
    });
  }, []);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.topContainer}>
        <Svg height="200" width="200">
          <Circle cx="90" cy="70" r="57" fill="#303030" />
          <Path
            d="M 90,70
                    L 90,20
                    A 50,50 0 0,1 140,70 Z" // 0도에서 90도
            fill="#CC94E6"
          />
        </Svg>
        <View style={styles.text_container}>
          <Text
            style={{
              fontSize: 25,
              color: 'black',
              fontFamily: 'NanumGothic-Bold',
            }}>
            {nickname}
          </Text>
          {userId ? (
            <TouchableOpacity onPress={goToManner}>
              <Text style={styles.profile_but}>매너 평가하기</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={goToChange}>
              <Text style={styles.profile_but}>프로필 수정</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
      <View style={styles.mytimeContainer}>
        <Text
          style={{
            fontSize: 28,
            color: 'black',
            fontFamily: 'NanumGothic-Bold',
            marginBottom: 20,
          }}>
          {nickname}의 시간
        </Text>
        <Svg width="330" height="180">
          <Rect width="330" height="170" fill="#C9BAE5" rx="10" ry="10" />
          <M
            name="clock-time-three-outline"
            size={135}
            color="black"
            style={{alignSelf: 'center'}}
          />
          <Text
            style={{
              fontSize: 20,
              color: 'black',
              fontFamily: 'NanumGothic-Bold',
              marginBottom: 20,
              alignSelf: 'center',
            }}>
            나의 시간은 {mannerTime}분이에요
          </Text>
        </Svg>
        <View style={{paddingBottom: 10}}>
          <TouchableOpacity style={styles.options_detail}>
            <MaterialCommunityIcons name="clock-plus" size={40} color="black" />
            <Text
              style={{
                fontFamily: 'NanumGothic-Bold',
                color: '#313131',
                fontSize: 16,
                marginRight: 45,
              }}>
              판매한 시간
            </Text>
            <AntDesign name="right" size={15} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.options_detail}>
            <AntDesign name="smileo" size={40} color="black" />
            <Text
              style={{
                fontFamily: 'NanumGothic-Bold',
                color: '#313131',
                fontSize: 16,
                marginRight: 45,
              }}>
              받은 매너 평가
            </Text>
            <AntDesign name="right" size={15} />
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    height: Dimensions.get('screen').height,
    flex: 1,
    flexDirection: 'column',
  },
  topContainer: {
    flexDirection: 'row',
  },
  text_container: {
    flexDirection: 'column',
    paddingTop: 25,
    marginHorizontal: -15,
  },
  profile_but: {
    width: 80,
    height: 30,
    backgroundColor: 'white',
    borderRadius: 5,
    borderColor: 'gray',
    borderWidth: 1,
    textAlign: 'center',
    textAlignVertical: 'center',
    marginTop: 15,
    color: 'black',
    fontFamily: 'NanumGothic-Regular',
  },
  mytimeContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    alignContent: 'center',
  },
  options_detail: {
    marginTop: 15,
    flexDirection: 'row',
    borderColor: 'gray',
    borderWidth: 0.5,
    width: 300,
    height: 80,
    margin: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
    borderRadius: 7,
  },
});

export default Profile;
