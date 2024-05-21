import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { RootStackParamList } from '../../types/Type';
import { RouteProp, useNavigation } from '@react-navigation/native';
import Mater from 'react-native-vector-icons/MaterialIcons'

type Nav=StackNavigationProp<RootStackParamList,'PostSet'>
type IdProp=RouteProp<RootStackParamList,'PostSet'>
interface Props{
    route:IdProp
}
const PostSet:React.FC<Props> = ({route}) => {
    const {boardId}=route.params
    const navigation=useNavigation<Nav>()

    const goToReport=()=>{
        navigation.navigate('ReportPost',{boardId})
    }
    return (
        <View style={styles.container}>
            <View style={styles.options}>
                <TouchableOpacity style={styles.options_detail} onPress={goToReport}>
                    <Mater name='report' size={40} color='black'/>
                    <Text style={{fontFamily:'NanumGothic-Bold', color:'#313131', fontSize:16, marginRight:45}}>신고하기</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles=StyleSheet.create({
    container:{
        backgroundColor:'white',
        flex:1
    },
    options:{
        flexDirection:'column',
        alignItems:'center',
        marginTop:30,
    },
    options_detail:{
        flexDirection:'row',
        borderColor:'gray',
        borderWidth:0.5,
        width:300,
        height:80,
        margin:5,
        justifyContent:'space-around',
        alignItems:'center',
        borderRadius:7,
    }
})

export default PostSet;