import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import {RouteProp, useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../types/Type';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ChatScreen from './ChatScreen';

type SatisfactionOption = {
  id: string;
  text: string;
};

const satisfactionOptions: SatisfactionOption[] = [
  {id: 'NICETIME', text: '약속한 시간을 잘 지켜요.'},
  {id: 'PRETTYLANGUAGE', text: '예의 바른 언어와 태도로 대화해요.'},
  {id: 'KIND', text: '친절하고 배려가 넘쳐요.'},
  {id: 'CHATFAST', text: '답장이 빨라요.'},
];

type LackOption = {
  id: string;
  text: string;
};

const lackOptions: LackOption[] = [
  {id: 'LATETIME', text: '약속 시간보다 늦게 도착해요.'},
  {id: 'RUDELANGUAGE', text: '비속어나 무례한 언어를 사용해요.'},
  {id: 'IGNORING', text: '상대방에게 무시와 불쾌함을 보여요.'},
  {id: 'CHATSLOW', text: '답장이 느려요.'},
];

type MannerScreenRouteProp = RouteProp<
  RootStackParamList,
  'MannerEvaluationScreen'
>;
type MannerScreenNavigationProp =
  | StackNavigationProp<RootStackParamList, 'MannerEvaluationScreen'>
  | StackNavigationProp<RootStackParamList, 'ChatScreen'>;

interface Props {
  route: MannerScreenRouteProp;
  navigation: MannerScreenNavigationProp;
}

const MannerEvaluationScreen: React.FC<Props> = ({route}) => {
  const [selectedServiceEvaluation, setServiceEvaluation] = useState<string[]>(
    [],
  );
  const [selectedMannerEvaluation, setMannerEvaluation] = useState<string[]>(
    [],
  );
  const navigation = useNavigation<MannerScreenNavigationProp>();
  const userId = route.params?.userId;
  const boardId = route.params?.boardId;
  console.log(selectedMannerEvaluation);
  console.log('userId', userId, 'boardId', boardId);

  useEffect(() => {
    if (route.params?.selectedServiceEvaluation) {
      setServiceEvaluation(route.params.selectedServiceEvaluation);
    }
  }, [route.params?.selectedServiceEvaluation]);

  // useEffect(() => {
  //   console.log(selectedMannerEvaluation);
  // }, [selectedMannerEvaluation]);

  const handleSelectOption = (id: string) => {
    setMannerEvaluation(current => {
      if (current.includes(id)) {
        return current.filter(item => item !== id);
      } else {
        if (current.length < 2) {
          return [...current, id];
        } else {
          return current;
        }
      }
    });
  };

  const handleSubmit = async () => {
    try {
      const store = await AsyncStorage.getItem('accessToken');
      const token = store ? JSON.parse(store) : null;

      const response = await axios.post(
        `http://localhost:8080/member/${userId}/board/${boardId}/evaluation`,
        {
          mannerEvaluationDtoList: selectedMannerEvaluation,
          serviceEvaluationDtoList: selectedServiceEvaluation,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (response.status === 200) {
        console.log(response.data);
        navigation.navigate('ChatScreen', {});
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.question}>2) 홍길동은 어땠나요?</Text>
      <Text style={styles.subtitle}>1. 만족했던 점을 선택해주세요.</Text>
      {satisfactionOptions.map(option => (
        <TouchableOpacity
          key={option.id}
          style={[
            styles.option,
            selectedMannerEvaluation.includes(option.id) &&
              styles.selectedOption,
          ]}
          onPress={() => handleSelectOption(option.id)}>
          <Text>{option.text}</Text>
        </TouchableOpacity>
      ))}

      <Text style={styles.subtitle}>2. 부족했던 점을 선택해주세요.</Text>
      {lackOptions.map(option => (
        <TouchableOpacity
          key={option.id}
          style={[
            styles.option,
            selectedMannerEvaluation.includes(option.id) &&
              styles.selectedOption,
          ]}
          onPress={() => handleSelectOption(option.id)}>
          <Text>{option.text}</Text>
        </TouchableOpacity>
      ))}
      <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text>제출하기</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    height: Dimensions.get('screen').height,
    backgroundColor: 'white',
  },
  question: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
  subtitle: {
    marginTop: 20,
    marginBottom: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },
  option: {
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  selectedOption: {
    backgroundColor: '#cceeff',
  },
  submitButton: {
    // 제출 버튼 스타일 설정
  },
});
export default MannerEvaluationScreen;
