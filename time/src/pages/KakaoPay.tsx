import React, { useEffect, useState } from 'react';
import IMP from 'iamport-react-native'
import Loading from './Loading';
import { RouteProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../types/Type';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { StackNavigationProp } from '@react-navigation/stack';

type Nav=StackNavigationProp<RootStackParamList,'KakaoPay'>
type PayProps=RouteProp<RootStackParamList,'KakaoPay'>
interface Prop{
    route:PayProps
}

const KakaoPay:React.FC<Prop> = ({route}) => {
    const {amountValue}=route.params
    const navigation=useNavigation<Nav>()
    const [id,setId]=useState<string>()
    AsyncStorage.getItem('kakaoId').then(id=>{
        const kakaoId=id
        if(id){
            setId(id)
        }
    })


    const data = {
        pg: 'kakaopay',
        pay_method: 'kakaopay',
        name: '틈새페이 충전',
        merchant_uid: `mid_${new Date().getTime()}`,
        amount: amountValue,
        buyer_name: `${id}`,
        buyer_tel: '01012345678',
        buyer_email: 'example@naver.com',
        buyer_addr: '서울시 강남구 신사동 661-16',
        buyer_postcode: '06018',
        app_scheme: 'example',
        // [Deprecated v1.0.3]: m_redirect_url
        escrow:false
        }
        
        
        
    const callback=(response: any)=> {
        // navigation.replace('Result',response)
        console.log(response.imp_success)
        if(response.imp_success){
            AsyncStorage.getItem('accessToken').then( async item=>{
                const token = item ? JSON.parse(item) : null;
                try{
                    const res= await axios.post(`http://13.125.118.92:8080/pay/${response.imp_uid}`,{},{
                        headers:{
                            Authorization: `Bearer ${token}`,
                        }
                    })
                    console.log(res)
                    navigation.navigate('Pay')
                }catch(error){
                    console.log(error)
                }
                
            })

        }
        
    }

    return (
        <IMP.Payment
        userCode={'imp16070056'}  // 가맹점 식별코드
        //tierCode={'AAA'}      // 티어 코드: agency 기능 사용자에 한함
        loading={<Loading />} // 웹뷰 로딩 컴포넌트
        data={data}           // 결제 데이터
        callback={callback}   // 결제 종료 후 콜백
      />
    );
};

export default KakaoPay;