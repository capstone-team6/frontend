// StackNavigator.tsx

import React from 'react';
import { StackNavigationProp, createStackNavigator } from '@react-navigation/stack';
import SignIn from '../pages/SignIn';
import SignUp from '../pages/SignUp';
import BottomTabNavigation from './BottmTabNavigation'
import { RootStackParamList } from '../../types/Type';
import DeleteMem from '../pages/DeleteMem';
import BottmTabNavigation from './BottmTabNavigation';
import Main from '../pages/Main';

const Stack = createStackNavigator<RootStackParamList>();
interface StackNavProps{
    onLoginSuccess:()=>void
}

const StackNavigators:React.FC<StackNavProps>=({onLoginSuccess}) => {
    
    return (
    <Stack.Navigator>
        <Stack.Screen name='SignIn' options={{headerShown:false}}>
            {props => <SignIn {...props} onLoginSuccess={onLoginSuccess} />}
        </Stack.Screen>
        <Stack.Screen name='SignUp' component={SignUp} options={{
            headerTitle:"회원가입",
            headerTitleStyle:{
                fontFamily:'NanumGothic-Bold',
                fontSize: 28, color:'black'
            },
        }}/>
        <Stack.Screen name='BottmTabNavigation' component={BottmTabNavigation}
        options={{
            headerShown:false
        }}
        />
        {/* <Stack.Screen name='Main' component={Main} options={{
            headerShown:true
        }}/> */}
    </Stack.Navigator>
);
};

export default StackNavigators;
