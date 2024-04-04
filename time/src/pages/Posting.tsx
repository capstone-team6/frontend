import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TextInput,
  Button,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import Photo from 'react-native-vector-icons/MaterialIcons'

const Posting = () => {
  const [selectedValue, setSelectedValue] = useState('');

  return (
    <ScrollView>
      <View style={styles.Posting_container}>
        <View style={styles.container}>
          <Text style={styles.container_text}>사진</Text>
          <Photo name='add-a-photo' size={35}/>
        </View>
        <View style={styles.container}>
          <Text style={styles.container_text}>제목</Text>
          <TextInput placeholder="제목" style={styles.titleInput}></TextInput>
        </View>
        <View style={styles.container}>
          <Text style={styles.container_text}>카테고리</Text>
          <View style={styles.container_view}>
            <TouchableOpacity style={styles.categoryBtn}>
              <Text style={styles.categoryBtn_text}>재능기부</Text>
            </TouchableOpacity>
            <View style={styles.space} />
            <TouchableOpacity style={styles.categoryBtn}>
              <Text style={styles.categoryBtn_text}>개산책</Text>
            </TouchableOpacity>
            <View style={styles.space} />
            <TouchableOpacity style={styles.categoryBtn}>
              <Text style={styles.categoryBtn_text}>심부름</Text>
            </TouchableOpacity>
            <View style={styles.space} />
            <TouchableOpacity style={styles.categoryBtn}>
              <Text style={styles.categoryBtn_text}>티켓팅</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.container_view}>
            <TouchableOpacity style={styles.categoryBtn}>
              <Text style={styles.categoryBtn_text}>오픈런</Text>
            </TouchableOpacity>
            <View style={styles.space} />
            <TouchableOpacity style={styles.categoryBtn}>
              <Text style={styles.categoryBtn_text}>나눔</Text>
            </TouchableOpacity>
            <View style={styles.space} />
            <TouchableOpacity style={styles.categoryBtn}>
              <Text style={styles.categoryBtn_text}>기타</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.container}>
          <Text style={styles.container_text}>시간</Text>
          <View style={{flexDirection: 'row'}}>
            <TextInput style={styles.input}></TextInput>
            <Picker
              selectedValue={selectedValue}
              onValueChange={item => setSelectedValue(item)}
              style={{
                width: 120,
                height: 40,
                borderWidth: 1,
                borderColor: 'black',
              }}>
              <Picker.Item label="단위" value="" />
              <Picker.Item label="분" value="minutes" />
              <Picker.Item label="시간" value="hours" />
            </Picker>
          </View>
        </View>

        <View style={styles.container}>
          <Text style={styles.container_text}>가격</Text>
          <View style={styles.container_view}>
            <TouchableOpacity style={styles.priceBtn}>
              <Text style={{color: 'black'}}>팔기</Text>
            </TouchableOpacity>
            <View style={{width: 10}} />
            <TouchableOpacity style={styles.priceBtn}>
              <Text style={{color: 'black'}}>사기</Text>
            </TouchableOpacity>
          </View>
          <View style={{flexDirection: 'row'}}>
            <TextInput style={styles.input}></TextInput>
            <View style={{width: 5}} />
            <Text
              style={{
                color: 'black',
                height: 40,
                marginTop: 10,
                marginLeft: 10,
              }}>
              원
            </Text>
          </View>
        </View>
        <View style={styles.container}>
          <Text style={styles.container_text}>내용</Text>
          <TextInput
            placeholder="자세한 내용을 적어주세요.
          (유해성 게시물의 경우 게시가 제한됩니다.)"
            multiline={true}
            style={styles.textInput}
          />
        </View>
        <View style={styles.container}>
          <Text style={styles.container_text}>틈새위치</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  Posting_container: {
    height: Dimensions.get('screen').height,
    backgroundColor: 'white',
    flex: 1,
  },
  container: {
    flexDirection: 'column',
    margin: 20,
    marginBottom: 10,
  },
  container_text: {
    fontFamily: 'NanumGothic-Bold',
    fontSize: 15,
    color: '#000000',
    marginBottom: 10,
  },
  titleInput: {
    height: 45,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'black',
    padding: 10,
  },
  textInput: {
    height: 100,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    textAlignVertical: 'top',
  },
  container_view: {
    flexDirection: 'row',
    margin: 5,
  },
  priceBtn: {
    backgroundColor: '#E8EAEC',
    width: 50,
    height: 24,
    alignItems: 'center',
    borderRadius: 10,
  },
  space: {
    width: 15,
  },
  input: {
    borderWidth: 0,
    borderBottomWidth: 1,
    height: 40,
    width: 110,
    marginLeft: 5,
  },
  categoryBtn: {
    backgroundColor: '#E8EAEC',
    width: 80,
    height: 35,
    borderRadius: 10,
    justifyContent: 'center',
  },
  categoryBtn_text: {
    color: 'black',
    textAlign: 'center',
  },
});

export default Posting;
