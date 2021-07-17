import AsyncStorage from '@react-native-community/async-storage'
import React from 'react'
import {
  Dimensions,
  Text,
  ScrollView,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native'
let RNFS = require('react-native-fs')
let path = RNFS.ExternalDirectoryPath
const getRootFiles = callback => {
  RNFS.readDir(path) // On Android, use "RNFS.DocumentDirectoryPath" (MainBundlePath is not defined)
    .then(result => {
      //   console.log('GOT RESULT', result[0].name)
      callback(result)
      return Promise.all([RNFS.stat(result[0].path), result[0].path])
    })
    .catch(err => {
      console.log(err.message, err.code)
    })
  // .then(statResult => {
  //   if (statResult[0].isFile()) {
  //     // if we have a file, read it
  //     return RNFS.readFile(statResult[1], 'utf8')
  //   }

  //   return 'no file'
  // })
  // .then(contents => {
  //   // log the file contents
  //   console.log('content', contents)
  // })
}
const getFileContent = ({path}, callback) => {
  RNFS.readFile(path).then(contents => {
    callback(contents)
  })
}

const appendToFile = (fileName, obj, callback) => {
  let path = RNFS.ExternalDirectoryPath + '/' + fileName

  try {
    let string = JSON.stringify(obj)
    RNFS.appendFile(path, string, 'utf8')
      .then(success => {
        callback(true)
        // console.log('FILE WRITTEN!')
      })
      .catch(err => {
        callback(false)
        console.log(err.message)
      })
  } catch (ex) {
    console.error(ex)
  }
}
const deletFile = (path, callback) => {
  RNFS.unlink(path).then(() => {
    callback(true)
  })
}
const writeToFile = (fileName, obj, callback) => {
  let path = RNFS.ExternalDirectoryPath + '/' + fileName

  try {
    let string = JSON.stringify(obj)
    RNFS.writeFile(path, string, 'utf8')
      .then(success => {
        callback(true)
        // console.log('FILE WRITTEN!')
      })
      .catch(err => {
        callback(false)
        console.log(err.message)
      })
  } catch (ex) {
    console.error(ex)
  }
}
const GetFilename = ({url}) => {
  if (url) {
    let m = url.toString().match(/.*\/(.+?)\./)
    if (m && m.length > 1) {
      return m[1]
    }
  }
  return ''
}

export {getRootFiles, getFileContent, writeToFile, appendToFile,deletFile}
