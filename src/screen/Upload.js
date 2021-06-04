import React, { useEffect, useState, useContext, useCallback } from "react";
import {View, Button, Image, Dimensions, TouchableOpacity} from 'react-native'
import DocumentPicker from "react-native-document-picker/index";


import NativeUploady, {
  UploadyContext,
  useItemFinishListener,
  useItemStartListener,
  useItemErrorListener,
} from "@rpldy/native-uploady";

const Upload = ({socket, to}) => {
    const uploadyContext = useContext(UploadyContext);

    useItemFinishListener((item) => {
      const response = JSON.parse(item.uploadResponse.data);

      socket.emit('SEND_PRIVATE_MESSAGE', 
        {
            type : 'FILE', 
            content : response.data.name,
            meta: {
                ...response.data.meta,
                name : response.data.name,
                URL : response.data.url
            },
            
        }
      , [to])

    });

    useItemErrorListener((item) => {
      console.log(`itemss ${item.id} upload error !!!! `, item);
    });

    useItemStartListener((item) => {
      console.log(`itemsss ${item.id} starting to upload,name = ${item.file.name}`);
    });

    const pickFile = useCallback(async () => {
      try {
        const res = await DocumentPicker.pick({
          type: [DocumentPicker.types.images],
        });

        uploadyContext.upload(res);

      } catch (err) {
        if (DocumentPicker.isCancel(err)) {
          console.log("User cancelled the picker, exit any dialogs or menus and move on");
        } else {
          throw err;
        }
      }
    }, [uploadyContext]);

    return (
          <Button onPress={pickFile} title='upload'/>
    );
  };

  export default Upload;
