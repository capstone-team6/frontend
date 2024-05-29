import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Ionicons from 'react-native-vector-icons/Ionicons';
interface data {
  title: string;
  content: string;
  nickname: string;
  images: string;
  objectionStatus: string;
}
function Appeal() {
  const [data, setData] = useState<data[]>();

  // const data1 = [
  //   {
  //     title: '이의신청',
  //     content: '처리중',
  //     nickname: 'hhh',
  //     images: [],
  //     objectionStatus: 'Reported',
  //   },
  // ];

  useEffect(() => {
    AsyncStorage.getItem('accessToken').then(token => {
      const parsedToken = token ? JSON.parse(token) : null;
      console.log(parsedToken);
      axios
        .get('http://13.125.118.92:8080/objection', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${parsedToken}`,
          },
        })
        .then(response => {
          console.log(JSON.stringify(response.data.data));
          const fetchedData = JSON.stringify(response.data.data);
          if (fetchedData) {
            const d = JSON.parse(fetchedData);
            setData(d);
          }
        })
        .catch(error => {
          console.error('Error fetching data:', error);
        });
    });
  }, []);

  const translateStatus = (status: string) => {
    switch (status) {
      case 'Reported':
        return '신고';
      case 'UnderReview':
        return '검토중';
      case 'COMPLETED':
        return '처리완료';
      case 'NoActionTaken':
        return '조치없음';
      default:
        return status;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.list}>
        {data?.map((item, index) => (
          <View key={index}>
            <View style={styles.item}>
              <Ionicons name="person-circle" size={80} color={'#352456'} />
              <Text style={styles.text}>{`${item.nickname}님과의 거래`}</Text>
              <View style={{paddingLeft: 40}}>
                <Text style={styles.btn}>
                  {translateStatus(item.objectionStatus)}
                </Text>
              </View>
            </View>
            <View style={styles.divider} />
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
    flexDirection: 'column',
  },
  // list: {
  //   paddingTop: 30,
  // },
  // item: {
  //   flexDirection: 'row',
  //   justifyContent: 'space-around',
  //   margin: 30,
  // },
  // text: {
  //   color: 'black',
  //   fontFamily: 'NanumGothic-Regular',
  //   fontSize: 20,
  // },
  btn: {
    width: 80,
    height: 30,
    backgroundColor: '#D9D9D9',
    borderRadius: 5,
    borderColor: 'gray',
    borderWidth: 1,
    textAlign: 'center',
    textAlignVertical: 'center',
    color: 'black',
    fontFamily: 'NanumGothic-Regular',
  },
  list: {
    flex: 1,
  },
  item: {
    flexDirection: 'row',
    // justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    // padding: 20,
    height: 100,
    paddingLeft: 40,
  },
  text: {
    fontSize: 20,
    fontFamily: 'NanumGothic',
    fontWeight: 'bold',
    color: 'black',
  },
  // btn: {
  //   fontSize: 14,
  //   color: 'blue',
  // },
  divider: {
    borderBottomColor: 'gray',
    borderBottomWidth: 1,
    width: '100%',
  },
});

export default Appeal;
