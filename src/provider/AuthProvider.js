import React, {useEffect, createContext} from 'react'
import { useState } from 'react/cjs/react.development';
import socketIOClient from "socket.io-client";
const ENDPOINT = "http://192.168.64.113:3000";
const socket = socketIOClient(ENDPOINT);

export const AuthContext = createContext()

export const AuthProvider = ({Auth, children}) => {
    console.log(Auth)
    const [username, setusername] = useState(Auth.username)
    const token = 'ask_your_tech_lead';
    useEffect(() => {
        socket.auth = {token, userId: Auth.userId, username: Auth.username};
        socket.connect();
    }, [])
    const AuthState = { socket, username }
    return(
        <AuthContext.Provider value={AuthState}>
            {children}
        </AuthContext.Provider>
    )
}