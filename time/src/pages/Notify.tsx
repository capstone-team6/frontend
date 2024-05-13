import React, { useState } from 'react';
import { Dimensions, Image, StyleSheet, Text, TouchableNativeFeedback, TouchableOpacity, View } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import Delete from 'react-native-vector-icons/MaterialIcons'
import Setting from 'react-native-vector-icons/AntDesign'
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../types/Type';
import { useNavigation } from '@react-navigation/native';

type SetNav=StackNavigationProp<RootStackParamList,'Notify'>
const Notify = () => {
    const [selectedTab, setSelectedTab] = useState('Activity');
    const navigation=useNavigation<SetNav>()
    const goToNav=()=>{
        navigation.navigate('KeywordSet')
    }
    return (
        <View style={styles.container}>
            <View style={styles.options}>
                        <TouchableWithoutFeedback onPress={()=>setSelectedTab('Activity')}>
                            <View style={styles.tabItem}>
                                <Text style={[
                                    styles.option1,
                                    selectedTab === 'Activity' && styles.selectedOption,
                                    styles.tabTextMargin,
                                ]}>
                                활동 알림
                                </Text>
                                {selectedTab==='Activity'&&(
                                    <View style={styles.lineUnderOption}></View>
                                )}
                            </View>
                        </TouchableWithoutFeedback>
                        <TouchableNativeFeedback onPress={()=>setSelectedTab('Keyword')}>
                            <View style={styles.tabItem}>
                                <Text
                                style={[
                                    styles.option2,
                                    selectedTab === 'Keyword' && styles.selectedOption,
                                    styles.tabTextMargin,
                                ]}
                                >키워드 알림
                                </Text>
                                {selectedTab==='Keyword'&&(
                                    <View style={styles.lineUnderOption}></View>
                                )}
                            </View>
                        </TouchableNativeFeedback>
            </View>

            {selectedTab === 'Activity' && (
                <View  style={styles.textContainer}>
                    <View style={{margin:15}}>
                        <Delete name='close' size={20} style={{alignSelf:'flex-end'}}/>
                        <Text style={styles.text}>하하호호님과 틈새시간 거래 완료 했어요!</Text>
                        <Text style={styles.text}>하하호호님에게 후기를 남겨주세요 💌</Text>
                        <Text style={styles.textTime}>10분 전</Text>
                    </View>
                </View>
            )}
            {selectedTab === 'Keyword' && (
                <View>
                    <View style={{margin:15}}>
                        <View style={{flexDirection:'row',alignSelf:'center', justifyContent:'center'}}>
                            <Text style={{textAlign:'center',color:'black', marginBottom:10,marginRight:10}}>현재 키워드 알림 1개</Text>
                            <Setting name='setting' size={20} style={{color:'black'}}
                            onPress={()=>goToNav()}
                            />
                        </View>
                        <TouchableOpacity style={styles.postContainer}>
                            <Image
                                source={require('../assets/images/post1.jpg')}
                                style={styles.post_image}/>
                            <View style={styles.post_info}>
                                <Delete name='close' size={15} style={styles.deleteIcon}/>
                                <Text style={styles.info1}>3km · 5분 전</Text>
                                <Text style={styles.info2}>강아지 산책 부탁드려요</Text>
                                <Text style={styles.info3}>10,000원/20분</Text>
                            </View>
                            
                        </TouchableOpacity>
                    </View>
                </View>
            )}
        </View>
    );
};
const styles = StyleSheet.create({
    container: {
        height: Dimensions.get('screen').height,
        backgroundColor: 'white',
        flex: 1,
        
        
    },
    options: {
        flexDirection: 'row',
        justifyContent: 'space-around', 
        marginTop: 40,
    },
    option1: {
        color: 'black',
        fontFamily: 'NanumGothic-Bold',
        fontSize: 15,
        textAlign:'center',
        
        
    },
    selectedOption: {
        fontWeight: 'bold',
        color: 'black',
    },
    tabTextMargin: {
        marginBottom: 20,
    },
    lineUnderOption: {
        borderBottomWidth: 2,
        borderBottomColor: 'black',
        width: '100%',
        alignSelf: 'center',
    },
    option2: {
        color: 'black',
        fontFamily: 'NanumGothic-Bold',
        fontSize: 15,
    },
    tabItem: {
        alignItems: 'center',
        width: Dimensions.get('screen').width/2,
        // marginBottom: -10,
    },
    textContainer:{
        marginTop:30,
        borderWidth:0.3,
        borderColor:'gray',
        margin:20,
        borderRadius:7
    },
    text:{
        fontFamily:'NanumGothic-Regular',
        marginBottom:10,
        color:'black'
    },
    textTime:{
        color:'gray',
        fontFamily:'NanumGothic-Regular',
    },
    postContainer: {
        width: '95%',
        height: 110,
        borderRadius: 5,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        borderWidth: 0.1,
        borderColor: 'black',
        marginTop:10
    },
    post_image: {
        width: 95,
        height: 95,
        borderRadius: 25,
        // marginRight: 10,
        position: 'absolute',
        left: 10,
    },
    post_info: {
        flexDirection: 'column',
        // left:-20
        left:10
        
    },
    info1: {
        fontFamily: 'NanumGothic',
        fontSize: 11,
        color: '#747474',
        marginBottom: 5,
    },
    info2: {
        fontFamily: 'NanumGothic',
        fontSize: 16,
        color: '#3C444C',
        marginBottom: 5,
    },
    info3: {fontFamily: 'NanumGothic-bold', fontSize: 13, color: '#3C444C'},
    deleteIcon:{
        position: 'absolute',
        top: 0,
        left: 200,
    }
})
export default Notify;