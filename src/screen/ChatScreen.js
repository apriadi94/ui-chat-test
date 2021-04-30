import React, {useState, useEffect, useContext, useRef} from 'react'
import {View, Text, Button, ScrollView, TextInput, TouchableOpacity, ImageBackground} from 'react-native'
import { AuthContext } from '../provider/AuthProvider'
import ImgBg from '../assets/chat-background.png'
import HighlightText from '@sanar/react-native-highlight-text';
import { HeaderBackButton } from '@react-navigation/stack';




const ChatScreen = ({navigation, route}) => {
    const {socket} = useContext(AuthContext)
    const {to} = route.params
    const [Chat, setChat] = useState([])
    const [Loading, setLoading] = useState(true)
    const [content, setcontent] = useState({
        type : 'TEXT', content : ''
    })

    const [Page, setPage] = useState(1)
    const [Search, setSearch] = useState('')
    const [isSearch, setIsSearch] = useState(false)

    const scrollViewRef = useRef();

    const getPreviusChat = () => {
        socket.emit('FETCH_PREV_MESSAGE', to, Page, Search);
        socket.on('MESSAGE_SENT_PREV_PAGE', messageList => {
            setChat(messageList)
        });
        setPage(Page => Page + 1)
    }
   

    useEffect(() => {
        navigation.setOptions({
            title : to.name,
            headerRight: () => (
                <View style={{flexDirection : 'row'}}>
                        <View style={{marginRight : 10}}>
                            <Button
                                onPress={getPreviusChat}
                                title="prev"
                            />
                        </View>
                        <View style={{marginRight : 10}}>
                            <Button
                                onPress={() => {
                                    setIsSearch(!isSearch)
                                    setSearch('')
                                }}
                                title={isSearch ? 'cancel' : 'search'}
                            />
                        </View>
                </View>
    
            ),
            headerLeft: (props) => (
                <HeaderBackButton
                  {...props}
                  onPress={() => {
                    navigation.navigate('Home')
                  }}
                />
              ),
        })
        
        socket.emit('FETCH_MESSAGE', to, Page, Search);
        socket.on('MESSAGE_SENT', messageList => {
            setChat(messageList)
            socket.emit('READ_MESSAGE', to)
            setLoading(false)
        });

        socket.on('PRIVATE_MESSAGE', (message, To) => {
            console.log(message)
        //    if(To.id === to.id){
        //     setChat(Chat => [...Chat, message])
        //     socket.emit('READ_MESSAGE', to)
        //    }

            setChat(Chat => [...Chat, message])
            if (to.id_chat !== null) {
                socket.emit('READ_MESSAGE', to)
            }
           
        });
    }, [Search, isSearch, Page])
    
    const SendChat = () => {
        socket.emit('PRIVATE_MESSAGE', content, to)
        setcontent({type : 'TEXT', content : ''})
    }

    const SearchUpChat = () => {
        socket.emit('FETCH_PREV_SEARCH_MESSAGE', to, Page, Search);
        socket.on('MESSAGE_SENT_PREV_SEARCH_PAGE', (messageList, LasPage) => {
            setPage(LasPage)
            setChat(messageList)
        });
    }

    return(
        <ImageBackground source={ImgBg} style={{flex : 1, backgroundColor : '#fff'}}>
            {
                isSearch ?
                <View style={{backgroundColor : '#fff', flexDirection : 'row'}}>
                    <View style={{flex : 1, borderBottomWidth : 1, marginBottom : 10, marginTop : -10, marginHorizontal : 20}}>
                        <TextInput value={Search} onChangeText={(text) => setSearch(text)}/>
                    </View>
                    <View style={{marginRight : 10, marginTop : 5}}>
                        <Button onPress={SearchUpChat} title='UP'/>
                    </View>
                </View> : null
            }
            <ScrollView 
                // ref={scrollViewRef}
                // onContentSizeChange={() => scrollViewRef.current.scrollToEnd()}
            >
           {
               Loading ? <View><Text>Loading...</Text></View> :
               <View style={{flex : 1, marginTop : 10, marginHorizontal : 10, marginBottom : 10}}>
                   {
                       Chat.map((list, index) => 
                        <View key={index} style={{marginTop : 10, alignItems : list.sender === to.id ? 'flex-end' : 'flex-start'}}>
                            <View style={{backgroundColor : list.sender === to.id ? '#80ffaa' : '#b3daff', height : 50, borderRadius : 10}}>
                                <View style={{marginTop : 5, marginLeft : 10, marginRight : 10}}>
                                    {
                                        list.search ?
                                        <HighlightText
                                            highlightStyle={{ backgroundColor: 'yellow' }}
                                            searchWords={[Search]}
                                            textToHighlight={list.content}
                                            caseSensitive={false}
                                        /> :
                                        <Text style={{fontSize : 14}}>{list.content}</Text>
                                    }
                                </View>
                            </View>
                        </View>
                       )
                   }
                </View>
           }
           </ScrollView>
           <View style={{justifyContent : 'flex-end'}}>
               <View style={{flexDirection : 'row'}}>
                    <View style={{flex : 1, marginHorizontal : 10, backgroundColor : 'white', height : 40, marginBottom : 10, borderRadius : 10}}>
                            <TextInput style={{color : 'black', fontSize : 18, marginLeft : 10}} value={content.content} onChangeText={(text) => setcontent({...content, content : text})}/>
                    </View>
                    <TouchableOpacity onPress={SendChat} style={{backgroundColor : 'green', width : 40, marginBottom : 10, marginRight : 5, borderRadius : 20}}>
                        <View style={{backgroundColor : 'green', width : 50, marginBottom : 5, marginRight : 5, borderRadius : 20}}>

                        </View>
                    </TouchableOpacity>
               </View>
           </View>
        </ImageBackground>
    )
}

export default ChatScreen