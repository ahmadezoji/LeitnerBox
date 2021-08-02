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
const getRootFiles = (appendPath, callback) => {
  RNFS.readDir(path + appendPath)
    .then(result => {
      //   console.log('GOT RESULT', result[0].name)
      callback(result)
      return '' //Promise.all([RNFS.stat(result[0].path), result[0].path])
    })
    .catch(err => {
      console.log(err.message, err.code)
    })
}

const getFileContent = (path, name, callback) => {
  RNFS.readFile(path + '/' + name).then(contents => {
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
const createCategory = (categoryName, callback) => {
  let path = RNFS.ExternalDirectoryPath + '/' + categoryName
  RNFS.mkdir(path).then(result => callback(true))
}
const createSubCategory = (categoryName, subCategoryName, callback) => {
  let path =
    RNFS.ExternalDirectoryPath + '/' + categoryName + '/' + subCategoryName
  RNFS.mkdir(path).then(result => callback(true))
}
const copyFile = (lastPath, newPath, callback) => {
  RNFS.copyFile(lastPath, newPath)
    .then(val => callback(true))
    .catch(error => callback(error))
}
const writeToFile = (folderName, fileName, obj, callback) => {
  let path = RNFS.ExternalDirectoryPath + '/' + folderName + '/' + fileName
  try {
    let string = JSON.stringify(obj)
    RNFS.writeFile(path, string, 'utf8')
      .then(success => {
        callback(true)
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
export {
  getRootFiles,
  getFileContent,
  writeToFile,
  appendToFile,
  deletFile,
  createCategory,
  createSubCategory,
  copyFile,
}
