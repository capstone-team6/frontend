import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, Dimensions} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {RouteProp} from '@react-navigation/native';
import {RootStackParamList} from '../../types/Type';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { ScrollView } from 'react-native-gesture-handler';

type ERouteProp = RouteProp<RootStackParamList, 'EvaluationScreen'>;

interface prop {
  route: ERouteProp;
}
interface manner {
  mannerEvaluationCategory: string;
  mannerEvaluationCount: number;
}
interface service {
  boardCategory: string;
  starCount: number;
}
interface StarRatingProps {
  count: number;
}
type Option = {
  category: string;
  text: string;
};

const MannerEvaluationCategoryKor: Option[] = [
  {category: 'NICETIME', text: '약속한 시간을 잘 지켜요.'},
  {category: 'PRETTYLANGUAGE', text: '예의 바른 언어와 태도로 대화해요.'},
  {category: 'KIND', text: '친절하고 배려가 넘쳐요.'},
  {category: 'CHATFAST', text: '답장이 빨라요.'},
  // {category: 'LATETIME', text: '약속 시간보다 늦게 도착해요.'},
  // {category: 'RUDELANGUAGE', text: '비속어나 무례한 언어를 사용해요.'},
  // {category: 'IGNORING', text: '상대방에게 무시와 불쾌함을 보여요.'},
  // {category: 'CHATSLOW', text: '답장이 느려요.'},
];

const categories: Option[] = [
  {category: 'TALENT', text: '재능기부'},
  {category: 'EXERCISE', text: '운동'},
  {category: 'ERRANDS', text: '심부름'},
  {category: 'TICKETING', text: '티켓팅'},
  {category: 'WAITING', text: '오픈런'},
  {category: 'FREE', text: '나눔'},
  {category: 'ETC', text: '기타'},
];

const EvaluationScreen: React.FC<prop> = ({route}) => {
  const userId = route.params?.userId;
  const boardId = route.params?.boardId;
  const mannerTime = route.params?.mannerTime;
  const nickname = route.params?.nickname;
  console.log(userId, boardId, nickname, mannerTime);
  const [mannerEvaluationList, setmannerEvaluationList] = useState<manner[]>();
  const [serviceEvaluationStarDtoList, setserviceEvaluationStarDtoList] =
    useState<service[]>();
  // const [userId, setuserId] = useState();

  // const mannerEvaluationList: manner[] = [
  //   {
  //     mannerEvaluationCategory: 'KIND',
  //     mannerEvaluationCount: 2,
  //   },
  // ];

  // const serviceEvaluationStarDtoList: service[] = [
  //   {
  //     boardCategory: 'FREE',
  //     starCount: 4,
  //   },
  //   {
  //     boardCategory: 'ETC',
  //     starCount: 5,
  //   },
  // ];

  const findStarCountByCategory = (category: string) => {
    const found = serviceEvaluationStarDtoList?.find(
      item => item.boardCategory === category,
    );
    return found ? found.starCount : '-';
  };

  const renderStars = (starCount: number | '-') => {
    let stars = [];
    if (typeof starCount === 'number') {
      for (let i = 0; i < starCount; i++) {
        stars.push(<Icon key={i} name="star" size={20} color="#FFD700" />);
      }
      return stars;
    } else {
      return '-';
    }
  };

  const renderCounts = (count: number) => {
    return <Text style={{marginRight: 5}}>{count}</Text>;
  };

  const findCountByCategory = (category: String) => {
    const evaluation = mannerEvaluationList?.find(
      item => item.mannerEvaluationCategory === category,
    );
    return evaluation ? evaluation.mannerEvaluationCount : 0;
  };

  useEffect(() => {
    AsyncStorage.getItem('accessToken').then(token => {
      const accessToken = token ? JSON.parse(token) : null;
      axios
        .get(`http://13.125.118.92:8080/member/${userId}/evaluation`, {
          headers: {
            'Content-Type': 'application/json',
            // Authorization: `Bearer ${accessToken}`,
          },
        })
        .then(response => {
          console.log(JSON.stringify(response.data.data));
          const data = JSON.stringify(response.data.data);
          console.log(data);
          if (data) {
            const d = JSON.parse(data);
            setmannerEvaluationList(d.mannerEvaluationList);
            setserviceEvaluationStarDtoList(d.serviceEvaluationStarDtoList);
          }
        })
        .catch(error => {
          console.error(error);
        });
    });
  }, []);

  return (
    <ScrollView>
       <View style={styles.container}>
      <View style={styles.topcontainer}>
        <Ionicons name="person-circle" size={80} color={'#352456'} />
        {/* <Svg height="200" width="200">
          <Circle cx="90" cy="70" r="57" fill="#303030" />
          <Path
            d="M 90,70
                    L 90,20
                    A 50,50 0 0,1 140,70 Z" // 0도에서 90도
            fill="#CC94E6"
          />
          
        </Svg> */}

        <View style={styles.text_container}>
          <Text
            style={{
              fontSize: 20,
              color: 'black',
              fontFamily: 'NanumGothic-Bold',
            }}>
            {nickname}님
          </Text>
          <Text
            style={{
              fontSize: 15,

              fontFamily: 'NanumGothic',
            }}>
            나의 시간: {mannerTime}분{' '}
          </Text>
        </View>
      </View>
      <View style={{marginHorizontal: 30}}>
        <View style={{height: 200}}>
          <View style={{marginBottom: 5}}>
            <Text
              style={{
                fontSize: 20,
                color: 'black',
                fontFamily: 'NanumGothic-Bold',
                marginTop:15
              }}>
              {nickname}님의 매너
            </Text>
          </View>
          {MannerEvaluationCategoryKor.map((item, index) => (
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

          {/* {mannerEvaluationList?.map((item, index) => {
            const categoryText =
              MannerEvaluationCategoryKor.find(
                option => option.category === item.mannerEvaluationCategory,
              )?.text || '알 수 없음';
            return (
              <View
                style={{
                  flexDirection: 'row',
                  borderRadius: 10,
                  backgroundColor: '#D9D9D9',
                  alignItems: 'center',
                  height: 40,
                  justifyContent: 'space-between',
                }}>
                <Text key={index} style={styles.item}>
                  {categoryText}
                </Text>
                <Text style={{fontSize: 20, color: 'black', marginRight: 10}}>
                  {item.mannerEvaluationCount}
                </Text>
              </View>
            );
          })} */}
        </View>
        <View style={{marginBottom: 5}}>
          <Text
            style={{
              fontSize: 20,
              color: 'black',
              fontFamily: 'NanumGothic-Bold',
              marginBottom: 10,
              marginTop:30
            }}>
            {nickname}님의 서비스
          </Text>
        </View>
        <View
          style={{borderRadius: 10, borderColor: '#D9D9D9', borderWidth: 2}}>
          <View style={{flexDirection: 'row'}}>
            <View style={{flex: 1}}>
              <Text
                style={{
                  alignSelf: 'center',
                  fontFamily: 'NanumGothic',
                  fontSize: 18,
                }}>
                카테고리
              </Text>
              {categories.map((item, index) => (
                <View style={{marginBottom: 5}}>
                  <Text key={index} style={styles.categoryItem}>
                    {item.text}
                  </Text>
                </View>
              ))}
            </View>
            <View style={{flex: 1}}>
              <Text
                style={{
                  alignSelf: 'center',
                  fontFamily: 'NanumGothic',
                  fontSize: 18,
                }}>
                받은 매너
              </Text>
              {categories.map((item, index) => (
                <View key={index} style={{marginBottom: 5}}>
                  <Text style={styles.categoryItem}>
                    {renderStars(findStarCountByCategory(item.category))}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>
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
  topcontainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
  },
  title: {
    fontWeight: 'bold',
    marginTop: 20,
  },
  item: {
    fontSize: 20,
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
  starCount: {
    fontSize: 14,
    color: 'black',
  },
});

export default EvaluationScreen;
