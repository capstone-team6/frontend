import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../types/Type';
import {Alert} from 'react-native';
type EvaluationScreenNavigationProp =
  | StackNavigationProp<RootStackParamList, 'ServiceEvaluationScreen'>
  | StackNavigationProp<RootStackParamList, 'MannerEvaluationScreen'>;
type ServiceScreenRouteProp = RouteProp<
  RootStackParamList,
  'ServiceEvaluationScreen'
>;
type SatisfactionOption = {
  id: string;
  text: string;
};

const satisfactionOptions: SatisfactionOption[] = [
  {id: 'EXACT', text: '요청된 일을 정확하게 처리해요.'},
  {id: 'POSITIVE', text: '발생한 문제에 적극적으로 해결해요.'},
  {id: 'FLEXIBILITY', text: '추가 요청이나 변경 사항에 유연하게 대처해요.'},
];

type LackOption = {
  id: string;
  text: string;
};

const lackOptions: LackOption[] = [
  {id: 'NOTEXACT', text: '거래자의 요구사항을 제대로 이해하지 못했어요.'},
  {id: 'AVOID', text: '발생한 문제에 대한 책임을 회피해요.'},
  {
    id: 'NOTFLEXIBILITY',
    text: '추가 요청이나 변경 사항에 유연하게 대처하지 못해요.',
  },
];

interface Props {
  route: ServiceScreenRouteProp;
}

const ServiceEvaluationScreen: React.FC<Props> = ({route}) => {
  const [selectedServiceEvaluation, setServiceEvaluation] = useState<string[]>(
    [],
  );
  const navigation = useNavigation<EvaluationScreenNavigationProp>();
  const userId = route.params?.userId;
  const boardId = route.params?.boardId;
  // console.log(userId, boardId);
  // console.log(selectedServiceEvaluation);
  const handleSelectOption = (id: string) => {
    setServiceEvaluation(current => {
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

  const handleNavigate = () => {
    if (selectedServiceEvaluation.length === 0) {
      Alert.alert(
        '알림',
        '최소 한 가지 옵션을 선택해주세요.',
        [{text: '확인', onPress: () => console.log('확인 버튼이 눌렸습니다.')}],
        {cancelable: false},
      );
    } else {
      navigation.navigate('MannerEvaluationScreen', {
        selectedServiceEvaluation: selectedServiceEvaluation,
        boardId: boardId,
        userId: userId,
      });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.question}>
        1) 홍길동님이 제공한 서비스는 어땠나요?
      </Text>
      <Text>(1,2번 포함 최대 2개)</Text>
      <Text style={styles.subtitle}>1. 만족했던 점을 선택해주세요.</Text>
      {satisfactionOptions.map(option => (
        <TouchableOpacity
          key={option.id}
          style={[
            styles.option,
            selectedServiceEvaluation.includes(option.id) &&
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
            selectedServiceEvaluation.includes(option.id) &&
              styles.selectedOption,
          ]}
          onPress={() => handleSelectOption(option.id)}>
          <Text>{option.text}</Text>
        </TouchableOpacity>
      ))}

      <TouchableOpacity onPress={handleNavigate}>
        <Text>다음 페이지로</Text>
      </TouchableOpacity>
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
});

export default ServiceEvaluationScreen;
