import React, {useState, useEffect, useContext, useRef} from 'react'
import {View, Text, Button, ScrollView, TextInput, TouchableOpacity, ImageBackground} from 'react-native'
import { AuthContext } from '../provider/AuthProvider'
import ImgBg from '../assets/chat-background.png'
import HighlightText from '@sanar/react-native-highlight-text';
import { HeaderBackButton } from '@react-navigation/stack';
import NativeUploady from "@rpldy/native-uploady";
import Upload from './Upload'




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
    const [ListSearchChat, setListSearchCaht] = useState([])
    const [OnPageSearch, setOnPageSearch] = useState(null)
    const [OnIndexSerach, setOnIndexSearch] = useState(0)

    const [dataSourceCords, setDataSourceCords] = useState([]);


    const scrollViewRef = useRef();

    const getPreviusChat = () => {
        socket.emit('FETCH_PREV_MESSAGE', to, Page, Search);
        socket.on('PREV_MESSAGE_SENT', messageList => {
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
        socket.on('MESSAGE_SENT', async (messageList, ArraySearch) => {
            setListSearchCaht(ArraySearch)
            setChat(messageList)
            socket.emit('READ_MESSAGE', to)
            setLoading(false)
        });


        socket.on('PRIVATE_MESSAGE_SENT', (message, To) => {
            setChat(Chat => [...Chat, message])
            if (to.id_chat !== null) {
                socket.emit('READ_MESSAGE', to)
            }
            scrollViewRef.current.scrollToEnd({animated: true})
           
        });
    }, [Search, isSearch, Page])
    
    const SendChat = () => {
        socket.emit('SEND_PRIVATE_MESSAGE', content, [to])
        setcontent({type : 'TEXT', content : ''})
    }

    const SearchUpChat = () => {
        if(ListSearchChat[OnIndexSerach]){
            socket.emit('FETCH_PREV_SEARCH_MESSAGE', to, ListSearchChat[OnIndexSerach].page, Search);
            socket.on('PREV_SEARCH_MESSAGE_SENT', (messageList, LasPage) => {
                setOnPageSearch(ListSearchChat[OnIndexSerach].id)
                setPage(LasPage)
                setChat(messageList)
                setOnIndexSearch(OnIndexSerach + 1)
            });
        }else{
            alert('Tidak ada lagi')
        }
    }


    return(
        <ImageBackground source={ImgBg} style={{flex : 1, backgroundColor : '#fff'}}>
            {
                isSearch ?
                <View style={{backgroundColor : '#fff', flexDirection : 'row'}}>
                    <View style={{flex : 1, borderBottomWidth : 1, marginBottom : 10, marginTop : -10, marginHorizontal : 20}}>
                        <TextInput value={Search} onChangeText={(text) => {
                            setSearch(text)
                            setOnIndexSearch(0)
                            }}/>
                    </View>
                    <View style={{marginRight : 10, marginTop : 5}}>
                        <Button onPress={SearchUpChat} title='UP'/>
                    </View>
                </View> : null
            }
            <ScrollView 
                ref={scrollViewRef}
                onContentSizeChange={() => {
                    if(dataSourceCords.length === 10){
                        scrollViewRef.current.scrollToEnd({animated: true})
                    }
                }}
            >
           {
               Loading ? <View><Text>Loading...</Text></View> :
               <View style={{flex : 1, marginTop : 10, marginHorizontal : 10, marginBottom : 10}}>
                   {
                       Chat.map((list, index) => 
                        <View 
                            onLayout={(event) => {
                                const layout = event.nativeEvent.layout;
                                dataSourceCords[index] = layout.y;
                                setDataSourceCords(dataSourceCords);
                            }}
                        key={index} style={{marginTop : 10, alignItems : list.sender === to.id ? 'flex-end' : 'flex-start'}}>
                            <View style={{backgroundColor : list.id === OnPageSearch ? 'white' : 'rgba(76, 175, 80, 0)', borderRadius : 10}}>
                                <View style={{backgroundColor : list.sender === to.id ? '#80ffaa' : '#b3daff', height : 50, borderRadius : 10, marginHorizontal : 10, marginVertical : 10}}>
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
                        </View>
                       )
                   }
                </View>
           }
           </ScrollView>
           <View style={{justifyContent : 'flex-end'}}>
               <View style={{flexDirection : 'row'}}>
                   <View style={{marginLeft : 10, marginTop : 5, borderRadius : 20}}>
                   <NativeUploady
                        destination={{
                                    url: `http://cerdas-staging.ap-southeast-1.elasticbeanstalk.com/api/chat/upload`,
                                    headers: {
                                        "Accept-Language" :"",
                                        "Device-Id" : "",
                                        "Device-Type" : 0,
                                        "Authorization" : `bearer`
                                    }
                                }}>
                        <Upload socket={socket} to={to}/>
                    </NativeUploady>
                   </View>
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