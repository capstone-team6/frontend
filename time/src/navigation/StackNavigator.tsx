// StackNavigator.tsx

import React from 'react';
import { StackNavigationProp, createStackNavigator } from '@react-navigation/stack';
import SignIn from '../pages/SignIn';
import SignUp from '../pages/SignUp';
import BottomTabNavigation from './BottmTabNavigation'
import { RootStackParamList } from '../../types/Type';
import DeleteMem from '../pages/DeleteMem';

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
        <Stack.Screen name='BottomTabNavigation' component={BottomTabNavigation}
        options={{
            headerShown:false
        }}
        />
    </Stack.Navigator>
);
};

export default StackNavigators;
