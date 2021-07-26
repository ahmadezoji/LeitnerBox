import AsyncStorage from '@react-native-community/async-storage'
import React, {useEffect, useState, useRef} from 'react'
import {
  StatusBar,
  Image,
  Dimensions,
  View,
  ActivityIndicator,
  Text,
  Easing,
  Animated,
  ScrollView,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  PermissionsAndroid,
  Platform,
} from 'react-native'
import LottieView from 'lottie-react-native'
import LinearGradient from 'react-native-linear-gradient'
import {Icon} from 'native-base'
import ImagePicker from 'react-native-image-picker'
import {picker} from './ImagePicker'
import SoundRecorder from 'react-native-sound-recorder'
import {
  appendToFile,
  copyFile,
  createCategory,
  createSubCategory,
  getFileContent,
  writeToFile,
} from './FileManger'
import moment from 'moment'
import {VoiceRecorder} from './Voice'

const addSubCategory = ({navigation}) => {
  const [subCategoryName, setSubCategoryName] = useState('')
  let categoryName = navigation.state.params.categoryName
  console.log(categoryName)
  const save = () => {
    var obj = []
    createSubCategory(categoryName, subCategoryName, result => {
      if (result) {
        let path = categoryName + '/' + subCategoryName
        console.log(path)
        writeToFile(path, subCategoryName + '.json', obj, result => {
          if (result) navigation.navigate('learn')
        })
      }
    })
  }
  return (
    <LinearGradient
      colors={['#4c669f', '#3b5998', '#192f6a']}
      style={styles.linearGradient}>
      <TextInput
        style={styles.InputText}
        placeholder='نام زیر گروه رو وارد کنید '
        onChangeText={text => setSubCategoryName(text)}
        defaultValue={subCategoryName}
      />
      <TouchableOpacity style={styles.NextBtn} onPress={() => save()}>
        <Text style={styles.textBtn}>ذخیره</Text>
      </TouchableOpacity>
    </LinearGradient>
  )
}
const addCategory = ({navigation}) => {
  const [categoryName, setCategoryName] = useState('')

  const save = () => {
    createCategory(categoryName, result => {
      if (result)
        navigation.navigate('addSubCategory', {categoryName: categoryName})
    })
  }
  return (
    <LinearGradient
      colors={['#4c669f', '#3b5998', '#192f6a']}
      style={styles.linearGradient}>
      <TextInput
        style={styles.InputText}
        placeholder='نام گروه رو وارد کنید '
        onChangeText={text => {
          setCategoryName(text)
          // navigation.state.params.categoryName = text;
        }}
        defaultValue={categoryName}
      />
      <TouchableOpacity style={styles.NextBtn} onPress={() => save()}>
        <Text style={styles.textBtn}>ذخیره</Text>
      </TouchableOpacity>
    </LinearGradient>
  )
}

const addCard1 = ({navigation}) => {
  const [meaning, setMeaning] = useState([])
  let [showWarning, setShowWarning] = useState(false)
  const onPars = text => {
    let array = text.split('،')
    setMeaning(array)
    navigation.state.params.meaning = array
  }

  return (
    <LinearGradient
      colors={['#4c669f', '#3b5998', '#192f6a']}
      style={styles.linearGradient}>
      <Text style={styles.TitleText}>{navigation.state.params.word}</Text>
      <TextInput
        style={styles.InputText}
        placeholder='معانی یا پاسخ را وارد کنید '
        multiline={true}
        onChangeText={text => onPars(text)}
        defaultValue={meaning}
      />
      <TouchableOpacity
        style={styles.NextBtn}
        onPress={() =>
          meaning.length > 0
            ? navigation.push('addCard2', navigation.state.params)
            : setShowWarning(true)
        }>
        <Text style={styles.textBtn}>بعدی</Text>
      </TouchableOpacity>
      {showWarning && <Text style={styles.warning}>{warning}</Text>}
    </LinearGradient>
  )
}
const addCard2 = ({navigation}) => {
  const [example, setExample] = useState('')
  const [voiceUri, setVoiceUri] = useState(
    navigation.state.params.word + '2.mp3',
  )
  let path =
    navigation.state.params.currentFile.path +
    '/' +
    navigation.state.params.word +
    '2.mp3'

  return (
    <LinearGradient
      colors={['#4c669f', '#3b5998', '#192f6a']}
      style={styles.linearGradient}>
      <Text style={styles.TitleText}>{navigation.state.params.word}</Text>

      {navigation.state.params.meaning.map((item, index) => (
        <Text style={styles.meaningText} key={index}>
          {item}
        </Text>
      ))}

      <TextInput
        style={styles.InputText}
        placeholder='مثال یا توضیحات را وارد کنید'
        multiline={true}
        onChangeText={text => {
          navigation.state.params.example = text
          navigation.state.params.voice2Path = voiceUri
        }}
        defaultValue={example}
      />
      <VoiceRecorder inputpath={path} />
      <TouchableOpacity
        style={styles.NextBtn}
        onPress={() => navigation.push('addCard3', navigation.state.params)}>
        <Text style={styles.textBtn}>بعدی</Text>
      </TouchableOpacity>
    </LinearGradient>
  )
}
const addCard3 = ({navigation}) => {
  const [imgUri, setImgUri] = useState('')
  navigation.state.params.imgUri = ''
  const chooseFile = () => {
    picker((source, data) => {
      // console.log(navigation.state.params.currentFile.path)
      let newPath =
        navigation.state.params.currentFile.path +
        '/' +
        navigation.state.params.word +
        '.jpg'
      console.log(newPath)
      copyFile(source.uri, newPath, result => {
        if (result) {
          setImgUri(newPath)
          navigation.state.params.imgUri = navigation.state.params.word + '.jpg'
        }
      })
    })
  }
  const saveCard = async () => {
    let interval = await AsyncStorage.getItem('intervalTime') //hour
    let unit = await AsyncStorage.getItem('intervalTimeUnit') //hour

    let word = {
      englishWord: navigation.state.params.word,
      meaning: navigation.state.params.meaning,
      example: navigation.state.params.example,
      imgUri: navigation.state.params.imgUri,
      voiceUri1: navigation.state.params.voice1Path,
      voiceUri2: navigation.state.params.voice2Path,
      readDate: 'null',
      nextReviewDate: 'null',
      position: -1,
    }

    const newToDoList = [...navigation.state.params.words, word]
    let path = navigation.state.params.categoryName + '/' + navigation.state.params.currentFile.name;
    writeToFile(
      path,
      navigation.state.params.currentFile.name + '.json',
      newToDoList,
      result => {
        if (result) navigation.navigate('learn')
      },
    )
  }
  return (
    <LinearGradient
      colors={['#4c669f', '#3b5998', '#192f6a']}
      style={styles.linearGradient}>
      <Text style={styles.TitleText}>{navigation.state.params.word}</Text>
      {navigation.state.params.meaning.map((item, index) => (
        <Text style={styles.meaningText} key={index}>
          {item}
        </Text>
      ))}
      <Text style={styles.exampleText}>{navigation.state.params.example}</Text>
      <Image
        source={{
          uri: 'file://' + imgUri,
        }}
        style={styles.wordImage}
      />
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <TextInput
          style={styles.BrowserPath}
          placeholder='آدرس عکس '
          onChangeText={text => (navigation.state.params.imgUri = text)}
          value={imgUri}
          // defaultValue={imgUri}
        />
        <TouchableOpacity style={styles.browsBtn} onPress={() => chooseFile()}>
          <Text style={styles.textBtn}>گالری</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.NextBtn} onPress={() => saveCard()}>
        <Text style={styles.textBtn}>ذخیره</Text>
      </TouchableOpacity>
      {/* <TouchableOpacity
        style={styles.NextBtn}
        onPress={() => navigation.push('addCard4', navigation.state.params)}>
        <Text style={styles.textBtn}>بعدی</Text>
      </TouchableOpacity> */}
    </LinearGradient>
  )
}

const addCard4 = ({navigation}) => {
  const [voiceUri, setVoiceUri] = useState(
    navigation.state.params.word + '2.mp3',
  )
  let path =
    navigation.state.params.currentFile.path +
    '/' +
    navigation.state.params.word +
    '2.mp3'

  return (
    <LinearGradient
      colors={['#4c669f', '#3b5998', '#192f6a']}
      style={styles.linearGradient}>
      <Text style={styles.TitleText}>{navigation.state.params.word}</Text>
      {navigation.state.params.meaning.map((item, index) => (
        <Text style={styles.meaningText} key={index}>
          {item}
        </Text>
      ))}
      <Text style={styles.TitleText}>{navigation.state.params.example}</Text>
      <Image
        source={{
          uri:
            'file://' +
            navigation.state.params.currentFile.path +
            '/' +
            navigation.state.params.imgUri,
        }}
        style={styles.wordImage}
      />
      <VoiceRecorder inputpath={path} />
      <TouchableOpacity style={styles.NextBtn} onPress={() => saveCard()}>
        <Text style={styles.textBtn}>ذخیره</Text>
      </TouchableOpacity>
    </LinearGradient>
  )
}
export {addCard1, addCard2, addCard3, addCard4, addCategory, addSubCategory}
const requestMicrophone = async () => {
  //replace your function with this code.
  if (Platform.OS === 'android') {
    console.log('is android')
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        {
          title: 'Permissions for record audio',
          message: 'Give permission to your device to record audio',
          buttonPositive: 'ok',
        },
      )
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('permission granted')
      } else {
        console.log('permission denied')
        return
      }
    } catch (err) {
      console.warn(err)
      return
    }
  }
}
const warning = 'پر کردن الزامی است'
export default class AddCard extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      text: '',
      showWarning: false,
      voice1Path: '',
    }
  }
  async componentDidMount () {
    requestMicrophone()

    // console.log(this.props.navigation.state.params);
    // console.log( this.props.navigation.state.params.currentFile);
  }
  render () {
    return (
      <LinearGradient
        colors={['#4c669f', '#3b5998', '#192f6a']}
        style={styles.linearGradient}>
        <TextInput
          style={styles.InputText}
          placeholder='واژه یا سوال  را وارد کنید'
          multiline={true}
          onChangeText={text => {
            this.props.navigation.state.params.word = text
            this.setState({
              text: text,
              voice1Path:
                this.props.navigation.state.params.currentFile.path +
                '/' +
                text +
                '1.mp3',
            })
            this.props.navigation.state.params.voice1Path = text + '1.mp3'
          }}
          defaultValue={this.state.text}
        />
        {this.state.text !== '' && (
          <VoiceRecorder inputpath={this.state.voice1Path} />
        )}
        <TouchableOpacity
          style={styles.NextBtn}
          onPress={() =>
            this.state.text !== ''
              ? this.props.navigation.push(
                  'addCard1',
                  this.props.navigation.state.params,
                )
              : this.setState({showWarning: true})
          }>
          <Text
            style={{
              color: 'black',
              fontFamily: 'IRANSansMobile',
              textAlign: 'center',
            }}>
            <Text style={styles.textBtn}>بعدی</Text>
          </Text>
        </TouchableOpacity>
        {this.state.showWarning && (
          <Text style={styles.warning}>{warning}</Text>
        )}
      </LinearGradient>
    )
  }
}
const styles = StyleSheet.create({
  linearGradient: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  TitleText: {
    color: 'black',
    fontSize: 25,
    textAlign: 'center',
    fontFamily: 'IRANSansMobile_Bold',
  },
  meaningText: {
    color: 'blue',
    fontSize: 15,
    textAlign: 'center',
    fontFamily: 'IRANSansMobile_Bold',
  },
  exampleText: {
    color: 'yellow',
    fontSize: 12,
    textAlign: 'center',
    fontFamily: 'IRANSansMobile_Bold',
  },
  wordImage: {
    width: 200,
    height: 100,
    borderRadius: 5,
  },
  InputText: {
    width: 250,
    height: 100,
    textAlignVertical: 'top',
    borderRadius: 5,
    backgroundColor: 'white',
    margin: 10,
    fontFamily: 'IRANSansMobile',
  },
  BrowserPath: {
    width: 250,
    height: 50,
    borderRadius: 5,
    backgroundColor: 'white',
    margin: 10,
    fontFamily: 'IRANSansMobile',
  },
  NextBtn: {
    backgroundColor: 'red',
    width: 100,
    height: 40,
    borderRadius: 10,
  },
  browsBtn: {
    backgroundColor: 'white',
    width: 50,
    height: 50,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textBtn: {
    fontFamily: 'IRANSansMobile',
    fontSize: 15,
    color: 'black',
    textAlign: 'center',
  },
  RecorderBtn: {
    backgroundColor: 'white',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
  },
  warning: {
    color: 'yellow',
    fontSize: 15,
    textAlign: 'center',
    textAlignVertical: 'center',
    margin: 20,
    fontFamily: 'IRANSansMobile',
  },
})
