// StackNavigator.tsx

import React from 'react';
import {
  StackNavigationProp,
  createStackNavigator,
} from '@react-navigation/stack';
import Profile from '../pages/Profile';
import Mypage from '../pages/Mypage';
import Notify from '../pages/Notify';
import {SafeAreaView, View} from 'react-native';
import {Text} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MyBuyTime from '../pages/MyBuyTime';
import MySellTime from '../pages/MySellTime';
import Pay from '../pages/Pay';
import Appeal from '../pages/Appeal';
import AppealWriteIcon from 'react-native-vector-icons/FontAwesome';
import AppealWrite from '../pages/AppealWrite';
import {RootStackParamList} from '../../types/Type';
import {useNavigation} from '@react-navigation/native';
import SignUp from '../pages/SignUp';
import SignIn from '../pages/SignIn';
import Setting from '../pages/Setting';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Logout from '../pages/Logout';
import DeleteMem from '../pages/DeleteMem';
import NameChange from '../pages/NameChange';
import StackNavigators from './StackNavigator';
import App from '../../App';
import ChargePay from '../pages/ChargePay';
import MinusPay from '../pages/MinusPay';
import MannerEvaluationScreen from '../pages/MannerEvaluationScreen';
import ServiceEvaluationScreen from '../pages/ServiceEvaluationScreen';
import EvaluationScreen from '../pages/EvaluationScreen';
const Stack = createStackNavigator();
type writeNavigation = StackNavigationProp<RootStackParamList, 'Appeal'>;
type SettingNavigationProp = StackNavigationProp<RootStackParamList, 'Setting'>;
type MypageNavigation = StackNavigationProp<RootStackParamList, 'Mypage'>;
import {RouteProp} from '@react-navigation/native';

const StackNavigator = () => {
  const navigation = useNavigation<writeNavigation>();
  const navigationSet = useNavigation<SettingNavigationProp>();
  const myPageNav = useNavigation<MypageNavigation>();

  const goToSetting = () => {
    navigationSet.navigate('Setting');
  };
  const goToWrite = () => {
    navigation.navigate('AppealWrite');
  };
  const goToMypage = () => {
    myPageNav.navigate('Mypage');
  };
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Mypage"
        component={Mypage}
        options={{
          header: () => (
            <SafeAreaView>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingHorizontal: 20,
                  height: 80,
                  backgroundColor: 'white',
                }}>
                <Text
                  style={{
                    fontFamily: 'NanumGothic-Bold',
                    fontSize: 28,
                    color: 'black',
                  }}>
                  나의 틈새
                </Text>
                <TouchableOpacity onPress={goToSetting}>
                  <Ionicons
                    name="settings-outline"
                    size={25}
                    color="black"
                    style={{marginRight: 20}}
                  />
                </TouchableOpacity>
              </View>
            </SafeAreaView>
          ),
        }}
      />
      <Stack.Screen
        name="Profile"
        component={Profile}
        options={{
          headerTitle: '프로필',
          headerTitleStyle: {
            fontFamily: 'NanumGothic-Bold',
            fontSize: 28,
            color: 'black',
          },
          headerStyle: {
            height: 80,
          },
          headerLeft: () => (
            <TouchableOpacity onPress={goToMypage}>
              <Ionicons
                name="arrow-back"
                size={24}
                color="black"
                style={{marginLeft: 10}}
              />
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="MyBuyTime"
        component={MyBuyTime}
        options={{
          headerTitle: '구매내역',
          headerTitleStyle: {
            fontFamily: 'NanumGothic-Bold',
            fontSize: 28,
            color: 'black',
          },
        }}
      />
      <Stack.Screen
        name="MySellTime"
        component={MySellTime}
        options={{
          headerTitle: '판매내역',
          headerTitleStyle: {
            fontFamily: 'NanumGothic-Bold',
            fontSize: 28,
            color: 'black',
          },
        }}
      />
      <Stack.Screen
        name="Notify"
        component={Notify}
        options={{
          headerTitle: '공지사항',
          headerTitleStyle: {
            fontFamily: 'NanumGothic-Bold',
            fontSize: 28,
            color: 'black',
          },
        }}
      />
      <Stack.Screen
        name="Pay"
        component={Pay}
        options={{
          headerTitle: '틈새페이',
          headerTitleStyle: {
            fontFamily: 'NanumGothic-Bold',
            fontSize: 28,
            color: 'black',
          },
        }}
      />
      <Stack.Screen
        name="Appeal"
        component={Appeal}
        options={{
          headerTitle: '이의신청',
          headerTitleStyle: {
            fontFamily: 'NanumGothic-Bold',
            fontSize: 28,
            color: 'black',
          },
          headerRight: () => (
            <AppealWriteIcon
              name="pencil-square-o"
              size={35}
              style={{marginRight: 20, paddingTop: 10}}
              onPress={goToWrite}
            />
          ),
        }}
      />
      <Stack.Screen
        name="AppealWrite"
        component={AppealWrite}
        options={{
          headerTitle: '이의신청 작성',
          headerTitleStyle: {
            fontFamily: 'NanumGothic-Bold',
            fontSize: 28,
            color: 'black',
          },
          headerTitleAlign: 'center',
        }}
      />
      <Stack.Screen
        name="SignUp"
        component={SignUp}
        options={{
          headerTitle: '닉네임 변경',
          headerTitleStyle: {
            fontFamily: 'NanumGothic-Bold',
            fontSize: 28,
            color: 'black',
          },
          headerTitleAlign: 'center',
        }}
      />
      <Stack.Screen
        name="Setting"
        component={Setting}
        options={{
          headerTitle: '설정',
          headerTitleStyle: {
            fontFamily: 'NanumGothic-Bold',
            fontSize: 28,
            color: 'black',
          },
        }}
      />

      <Stack.Screen
        name="Logout"
        component={Logout}
        options={{
          headerTitle: '로그아웃',
          headerTitleStyle: {
            fontFamily: 'NanumGothic-Bold',
            fontSize: 28,
            color: 'black',
          },
        }}
      />
      <Stack.Screen
        name="DeleteMem"
        component={DeleteMem}
        options={{
          headerTitle: '회원 탈퇴',
          headerTitleStyle: {
            fontFamily: 'NanumGothic-Bold',
            fontSize: 28,
            color: 'black',
          },
        }}
      />
      <Stack.Screen
        name="NameChange"
        component={NameChange}
        options={{
          headerTitle: '닉네임 변경',
          headerTitleStyle: {
            fontFamily: 'NanumGothic-Bold',
            fontSize: 28,
            color: 'black',
          },
        }}
      />
      <Stack.Screen
        name="ChargePay"
        component={ChargePay}
        options={{
          headerTitle: '충전하기',
          headerTitleStyle: {
            fontFamily: 'NanumGothic-Bold',
            fontSize: 28,
            color: 'black',
          },
        }}
      />
      <Stack.Screen
        name="MinusPay"
        component={MinusPay}
        options={{
          headerTitle: '인출하기',
          headerTitleStyle: {
            fontFamily: 'NanumGothic-Bold',
            fontSize: 28,
            color: 'black',
          },
        }}
      />
      <Stack.Screen
        name="App"
        component={App}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="EvaluationScreen"
        component={EvaluationScreen}
        options={{
          headerTitle: '매너평가',
          headerTitleStyle: {
            fontFamily: 'NanumGothic-Bold',
            fontSize: 28,
            color: 'black',
          },
        }}
      />

      <Stack.Screen
        name="ServiceEvaluationScreen"
        component={ServiceEvaluationScreen}
        options={{
          headerTitle: '매너평가',
          headerTitleStyle: {
            fontFamily: 'NanumGothic-Bold',
            fontSize: 28,
            color: 'black',
          },
        }}
      />

      <Stack.Screen
        name="MannerEvaluationScreen"
        component={MannerEvaluationScreen}
        options={{
          headerTitle: '매너평가',
          headerTitleStyle: {
            fontFamily: 'NanumGothic-Bold',
            fontSize: 28,
            color: 'black',
          },
        }}
      />
    </Stack.Navigator>
  );
};

export default StackNavigator;
