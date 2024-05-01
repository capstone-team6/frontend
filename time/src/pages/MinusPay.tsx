import { Picker } from '@react-native-picker/picker';
import React from 'react';
import { Dimensions, StyleSheet, Text, TextInput, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

const MinusPay = () => {
    return (
        <View style={styles.container}>
            <View style={styles.box}>
                <View>
                    <Text style={styles.top}>틈새 페이 인출</Text>
                </View>
                <View style={styles.line}></View>
                <View style={styles.items}>
                    <View style={styles.cacheBox}>
                        <Text style={styles.text}>5000 캐시</Text>
                    </View>
                    <View>
                        <TextInput placeholder='인출 할 금액을 적어주세요'></TextInput>
                        <View style={{borderWidth:1, borderColor:'#D9D9D9'}}></View>
                    </View>
                    <View style={styles.inputs}>
                        <View style={styles.boxMini}>
                            <Picker>
                                <Picker.Item label="은행선택" value="" style={{textAlignVertical:'center'}} />
                                <Picker.Item label="국민은행" value="국민은행" />
                                <Picker.Item label="우리은행" value="우리은행" />
                                <Picker.Item label="신한은행" value="신한은행" />
                                <Picker.Item label="농협은행" value="농형은행" />
                                <Picker.Item label="기업은행" value="기업은행" />
                            </Picker>
                        </View>
                        <View style={styles.boxMini} >
                            <TextInput placeholder='예금주명'></TextInput>
                        </View>
                    </View>
                    <View style={styles.boxMini}>
                        <TextInput placeholder='계좌번호'></TextInput>
                    </View>
                    <View style={styles.btns}>
                        <TouchableOpacity>
                            <Text style={styles.btnText}>닫기</Text>
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <Text style={styles.btnText}>인출</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    );
};

const styles=StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'white'
    },
    box:{
        borderColor:'#C9BAE5',
        borderWidth:2,
        height:Dimensions.get('screen').height/1.5,
        padding:20,
        margin:40,
        borderRadius:10
    },
    top:{
        textAlign:'center',
        fontSize:27,
        color:'black',
        fontFamily:'NanumGothic-Regular'
    },
    line:{
        borderColor:'#C9BAE5',
        borderWidth:1,
        marginTop:20,
    },
    items:{
        flexDirection:'column',
        alignItems:'center'
    },
    cacheBox:{
        borderColor:'#D9D9D9',
        borderWidth:2,
        padding:20,
        margin:40,
        borderRadius:10,
        width:150,
        
    },
    text:{
        fontSize:15,
        textAlign:'center',
        color:'black',
        fontFamily:'NanumGothic-Regular'
    },
    inputs:{
        marginTop:20,
        flexDirection:'row',
        marginBottom:5
        
    },
    boxMini:{
        width: 150,
        height:50,
        borderWidth: 2,
        borderColor: '#D9D9D9',
        borderRadius:5,
        margin:5
    },
    btns:{
        flexDirection:'row',
        marginTop:90,
    },
    btnText:{
        fontFamily:'NanumGothic-Regular',
        color:'black',
        fontSize:20,
        paddingRight:50,
        paddingLeft:50
    }
})
export default MinusPay;