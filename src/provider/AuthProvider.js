import React, {useEffect, createContext} from 'react'
import { useState } from 'react/cjs/react.development';
import socketIOClient from "socket.io-client";
const ENDPOINT = "http://172.27.12.208:3000";
// const socket = socketIOClient(ENDPOINT);

export const AuthContext = createContext()

export const AuthProvider = ({Auth, children}) => {
    const [username, setusername] = useState(Auth.username)
    const token = 'ask_your_tech_lead';
    
    const socket = socketIOClient(ENDPOINT, {
        query : {
            token : "ask_your_tech_lead",
            userId : Auth.userId,
            username : Auth.username,
            profileImage : `https://picsum.photos/id/${Auth.userId * 5}/200/300`
        }
    });
    
    useEffect(() => {
        // socket.auth = {token, userId: Auth.userId, username: Auth.username, profileImage : `https://picsum.photos/id/${Auth.userId * 5}/200/300`};
        socket.connect();
          
    }, [])
    const AuthState = { socket, username }
    return(
        <AuthContext.Provider value={AuthState}>
            {children}
        </AuthContext.Provider>
    )
}