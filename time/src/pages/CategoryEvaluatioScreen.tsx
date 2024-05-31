import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../types/Type';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {Dimensions} from 'react-native';
type ERouteProp = RouteProp<RootStackParamList, 'CategoryEvaluationScreen'>;
interface prop {
  route: ERouteProp;
}
interface service {
  boardCategory: string;
  serviceEvaluationCategory: string;
  serviceEvaluationCount: number;
}
type Option = {
  category: string;
  text: string;
};
const ServiceEvaluationCategoryKor: Option[] = [
  {category: 'EXACT', text: '정확하게 처리해요'},
  {category: 'POSITIVE', text: '적극적으로 해결해요'},
  {category: 'FLEXIBILITY', text: '유연하게 대처해요'},
];

const ServiceEvaluationCategoryKor2: Option[] = [
  {category: 'NOTEXACT', text: '제대로 이해하지 못했어요'},
  {category: 'AVOID', text: '책임을 회피해요'},
  {category: 'NOTFLEXIBILITY', text: '유연하지 못하게 대처해요'},
];

const CategoryEvaluationScreen: React.FC<prop> = ({route}) => {
  const {evaluationNum, userId} = route.params;
  console.log(evaluationNum, userId);
  const [p, setP] = useState<service[]>();
  const [n, setN] = useState<service[]>();

  const findCountByCategory = (category: String) => {
    const evaluation = p?.find(
      item => item.serviceEvaluationCategory === category,
    );
    return evaluation ? evaluation.serviceEvaluationCount : 0;
  };

  const findCountByCategory2 = (category: String) => {
    const evaluation = n?.find(
      item => item.serviceEvaluationCategory === category,
    );
    return evaluation ? evaluation.serviceEvaluationCount : 0;
  };

  const renderCounts = (count: number) => {
    return <Text style={{marginRight: 5}}>{count}</Text>;
  };

  useEffect(() => {
    AsyncStorage.getItem('accessToken').then(token => {
      const accessToken = token ? JSON.parse(token) : null;
      console.log(accessToken);
      axios
        .get(
          `http://13.125.118.92:8080/member/${userId}/evaluation/${evaluationNum}`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken}`,
            },
          },
        )
        .then(response => {
          console.log(JSON.stringify(response.data.data));
          const d = JSON.stringify(response.data.data);
          if (d) {
            const data = JSON.parse(d);
            setP(data.servicePositiveList);
            setN(data.serviceNegativeList);
          }
        })
        .catch(error => {
          console.error(error);
        });
    });
  }, []);
  return (
    <View style={styles.container}>
      <View style={{margin: 30}}>
        <View style={{marginBottom: 5}}>
          <Text
            style={{
              fontSize: 20,
              color: 'black',
              fontFamily: 'NanumGothic-Bold',
              marginTop: 15,
            }}>
            만족했던 점
          </Text>
        </View>
        {ServiceEvaluationCategoryKor.map((item, index) => (
          <View
            style={{
              flexDirection: 'row',
              borderRadius: 10,
              backgroundColor: '#D9D9D9',
              alignItems: 'center',
              height: 35,
              justifyContent: 'space-between',
              marginBottom: 5,
            }}>
            <Text key={index} style={styles.categoryItem}>
              {item.text}
            </Text>
            <View style={styles.starContainer}>
              {renderCounts(findCountByCategory(item.category))}
            </View>
          </View>
        ))}

        <View style={{marginVertical: 50}}>
          <View style={{marginBottom: 5}}>
            <Text
              style={{
                fontSize: 20,
                color: 'black',
                fontFamily: 'NanumGothic-Bold',
                marginTop: 15,
              }}>
              불만족했던 점
            </Text>
          </View>
          {ServiceEvaluationCategoryKor2.map((item, index) => (
            <View
              style={{
                flexDirection: 'row',
                borderRadius: 10,
                backgroundColor: '#D9D9D9',
                alignItems: 'center',
                height: 35,
                justifyContent: 'space-between',
                marginBottom: 5,
              }}>
              <Text key={index} style={styles.categoryItem}>
                {item.text}
              </Text>
              <View style={styles.starContainer}>
                {renderCounts(findCountByCategory2(item.category))}
              </View>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    height: Dimensions.get('screen').height,
    flex: 1,
    flexDirection: 'column',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  item: {
    fontSize: 18,
    marginBottom: 5,
  },
  categoryText: {
    fontSize: 16,
    fontWeight: '500',
  },
  text_container: {
    flexDirection: 'column',
    textAlign: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
  categoryItem: {
    fontSize: 15,

    alignSelf: 'center',
    margin: 5,
    color: 'black',
  },
  starContainer: {
    flexDirection: 'row',
    marginRight: 10,
  },
  categoryContainer: {
    // marginBottom: 15,
    alignSelf: 'center',
  },
});

export default CategoryEvaluationScreen;
