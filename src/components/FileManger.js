import AsyncStorage from '@react-native-community/async-storage'
import React from 'react'
import {
  Dimensions,
  Text,
  ScrollView,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  PermissionsAndroid,
} from 'react-native'
import Share from 'react-native-share'
import {zip, unzip, unzipAssets, subscribe} from 'react-native-zip-archive'
import FilePickerManager from 'react-native-file-picker'
let RNFS = require('react-native-fs')
let path = RNFS.ExternalDirectoryPath
import Toast from 'react-native-simple-toast'

const getRootFolders = (appendPath, callback) => {
  RNFS.readDir(path + appendPath)
    .then(result => {
      callback(result.filter(item => item.isDirectory() == true))
      return '' //Promise.all([RNFS.stat(result[0].path), result[0].path])
    })
    .catch(err => {
      console.log(err.message, err.code)
    })
}
const getRootFiles = (appendPath, callback) => {
  RNFS.readDir(path + appendPath)
    .then(result => {
      // console.log('GOT RESULT', result[0].isFile())
      callback(result.filter(item => item.isFile() == true))
      return '' //Promise.all([RNFS.stat(result[0].path), result[0].path])
    })
    .catch(err => {
      console.log(err.message, err.code)
    })
}
const readSettingJson = (path, callback) => {
  RNFS.readFile(path).then(contents => {
    callback(contents)
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
const createLesson = (categoryName, subCategoryName, lessonName, callback) => {
  let path =
    RNFS.ExternalDirectoryPath +
    '/' +
    categoryName +
    '/' +
    subCategoryName +
    '/' +
    lessonName
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

const shareToFiles = async (path, name) => {
  const granted = await PermissionsAndroid.check(
    'android.permission.READ_EXTERNAL_STORAGE',
  )
  if (!granted) {
    console.log('Permission not granted')
    const response = await PermissionsAndroid.request(
      'android.permission.READ_EXTERNAL_STORAGE',
    )
    if (!response) {
      console.log('Permission not granted & non respinse')
      return
    }
  } else {
    console.log('Permission granted')
    zip(path, RNFS.DownloadDirectoryPath + '/' + name + '.zip')
      .then(path => {
        const shareOptions = {
          title: 'Share file',
          failOnCancel: false,
          urls: ['file://' + RNFS.DownloadDirectoryPath + '/' + name + '.zip'],
        }
        console.log(shareOptions.urls)
        try {
          const ShareResponse = Share.open(shareOptions)
        } catch (error) {
          console.log('Error =>', error)
        }
      })
      .catch(error => {
        console.log('error' + error)
      })
  }
}
const extractSubCategory = async (categoryPath, categoryName) => {
  try {
    const charset = 'UTF-8'
    FilePickerManager.showFilePicker(null, response => {
      // console.log('Response = ', response)

      if (response.didCancel) {
        console.log('User cancelled file picker')
      } else if (response.error) {
        console.log('FilePickerManager Error: ', response.error)
      } else {
        if (response.fileName.includes('.zip')) {
          let subCategoryName = response.fileName.split('.')[0]
          createSubCategory(categoryName, subCategoryName, result => {
            if (result) {
              console.log(categoryPath + '/' + subCategoryName);
              unzip(response.path, categoryPath + '/' + subCategoryName, charset)
                .then(path => {
                  console.log(`unzip completed at ${path}`)
                })
                .catch(error => {
                  console.error(error)
                })
            }
          })
        } else {
          Toast.show('فایل نا معتبر')
        }
      }
    })
  } catch (err) {
    console.log(err)
  }
}

export {
  readSettingJson,
  getRootFolders,
  extractSubCategory,
  shareToFiles,
  getRootFiles,
  getFileContent,
  writeToFile,
  appendToFile,
  deletFile,
  createCategory,
  createSubCategory,
  createLesson,
  copyFile,
}
