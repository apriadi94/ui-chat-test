import React, {useState} from 'react';
import MainStack from './src/stack/MainStack'
import { NavigationContainer } from '@react-navigation/native';
import {AuthProvider} from './src/provider/AuthProvider'
import LoginScreen from './src/screen/LoginScreen'


const App = () => {
    const [Auth, setAuth] = useState({userId : null, username : ''})

    return(
     Auth.userId === null ?
     <LoginScreen setAuth={setAuth}/>
     :
     <AuthProvider Auth={Auth}>
        <NavigationContainer>
            <MainStack/>
        </NavigationContainer>
     </AuthProvider>
    )
};


export default App;
