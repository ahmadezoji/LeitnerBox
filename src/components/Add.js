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
  createFolder,
  getFileContent,
  writeToFile,
} from './FileManger'
import moment from 'moment'

const addCategory = ({navigation}) => {
  const [name, setName] = useState('')

  const save = () => {
    var obj = []
    createFolder(name, result => {
      console.log(result)
      if (result)
        writeToFile(name, name + '.json', obj, result => {
          if (result) navigation.navigate('learn')
        })
    })
  }
  return (
    <LinearGradient
      colors={['#4c669f', '#3b5998', '#192f6a']}
      style={styles.linearGradient}>
      <TextInput
        style={styles.InputText}
        placeholder='نام گروه رو وارد کنید '
        onChangeText={text => setName(text)}
        defaultValue={name}
      />
      <TouchableOpacity style={styles.NextBtn} onPress={() => save()}>
        <Text style={styles.textBtn}>ذخیره</Text>
      </TouchableOpacity>
    </LinearGradient>
  )
}

const addCard1 = ({navigation}) => {
  console.log(navigation.state.params)
  const [meaning, setMeaning] = useState('')
  const onPars = text => {
    let array = text.split('،')

    navigation.state.params.meaning = array
  }

  return (
    <LinearGradient
      colors={['#4c669f', '#3b5998', '#192f6a']}
      style={styles.linearGradient}>
      <Text style={styles.TitleText}>{navigation.state.params.word}</Text>
      <TextInput
        style={styles.InputText}
        placeholder='معنی را وارد کنید '
        onChangeText={text => onPars(text)}
        defaultValue={meaning}
      />
      <TouchableOpacity
        style={styles.NextBtn}
        onPress={() => navigation.push('addCard2', navigation.state.params)}>
        <Text style={styles.textBtn}>بعدی</Text>
      </TouchableOpacity>
    </LinearGradient>
  )
}
const addCard2 = ({navigation}) => {
  const [example, setExample] = useState('')
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
        placeholder='مثال وارد کنید'
        onChangeText={text => (navigation.state.params.example = text)}
        defaultValue={example}
      />
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

      // console.log(source.uri)
    })
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
          style={styles.InputText}
          placeholder='مثال وارد کنید'
          onChangeText={text => (navigation.state.params.imgUri = text)}
          value={imgUri}
          // defaultValue={imgUri}
        />
        <TouchableOpacity style={styles.browsBtn} onPress={() => chooseFile()}>
          <Text style={styles.textBtn}>گالری</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={styles.NextBtn}
        onPress={() => navigation.push('addCard4', navigation.state.params)}>
        <Text style={styles.textBtn}>بعدی</Text>
      </TouchableOpacity>
    </LinearGradient>
  )
}
const formatNumber = number => `0${number}`.slice(-2)

const getRemaining = (time) => {
  const mins = Math.floor(time / 60)
  const secs = time - mins * 60
  return {mins: formatNumber(mins), secs: formatNumber(secs)}
}


const addCard4 = ({navigation}) => {
  const [voiceUri, setVoiceUri] = useState('')
  const [startRecord, setStartRecord] = useState(false)
  const [remainingSecs, setRemainingSecs] = useState(0);
  const [isActive, setIsActive] = useState(false);  
  let iconName = startRecord ? 'stop' : 'record'
  const {mins, secs} = getRemaining(remainingSecs)

  const reset = () => {
    setRemainingSecs(0);
    setIsActive(false);
  }

  useEffect(() => {
    let interval = null
    if (isActive) {
      interval = setInterval(() => {
        setRemainingSecs(remainingSecs => remainingSecs + 1)
      }, 1000)
    } else if (!isActive && remainingSecs !== 0) {
      clearInterval(interval)
    }
    return () => clearInterval(interval)
  }, [isActive, remainingSecs])

  // const startTimer = () => {
  //   setTimeout(() => {
  //     setTimer(timer + 1)
  //     setIsActive(!isActive);
  //   }, 1000)
  // }
  const saveCard = async () => {
    let interval = await AsyncStorage.getItem('intervalTime') //hour
    let unit = await AsyncStorage.getItem('intervalTimeUnit') //hour
    let word = {
      englishWord: navigation.state.params.word,
      meaning: navigation.state.params.meaning,
      example: navigation.state.params.example,
      imgUri: navigation.state.params.imgUri,
      voiceUri: voiceUri,
      readDate: 'null',
      nextReviewDate: 'null',
      position: -1,
    }

    const newToDoList = [...navigation.state.params.words, word]

    writeToFile(
      navigation.state.params.currentFile.name,
      navigation.state.params.currentFile.name + '.json',
      newToDoList,
      result => {
        if (result) navigation.navigate('learn')
      },
    )
  }
  const start = () => {
    //SoundRecorder.PATH_DOCUMENT
    reset();
    SoundRecorder.start(
      navigation.state.params.currentFile.path +
        '/' +
        navigation.state.params.word +
        '.wav',
    ).then(function () {
      setStartRecord(true)
      setIsActive(!isActive);
      console.log('started recording')
    })
  }
  const stop = () => {
    SoundRecorder.stop().then(function (result) {
      setStartRecord(false)
      reset();
      console.log('stopped recording, audio file saved at: ' + result.path)
      setVoiceUri(navigation.state.params.word + '.wav')
    })
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
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <TouchableOpacity
          style={styles.RecorderBtn}
          onPress={() => (startRecord ? stop() : start())}>
          <Icon name={iconName} type={"MaterialCommunityIcons"} style={{color: 'red', margin: 5}} />
        </TouchableOpacity>
        <Text style={styles.timerText}>{`${mins}:${secs}`}</Text>
      </View>
      <TouchableOpacity style={styles.NextBtn} onPress={() => saveCard()}>
        <Text style={styles.textBtn}>ذخیره</Text>
      </TouchableOpacity>
    </LinearGradient>
  )
}
export {addCard1, addCard2, addCard3, addCard4, addCategory}

export default class AddCard extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      text: '',
    }
  }
  async componentDidMount () {
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
          placeholder='واژه را وارد کنید'
          onChangeText={text => {
            this.props.navigation.state.params.word = text
            this.setState({text: text})
          }}
          defaultValue={this.state.text}
        />
        <TouchableOpacity
          style={styles.NextBtn}
          onPress={() =>
            this.props.navigation.push(
              'addCard1',
              this.props.navigation.state.params,
            )
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
    width: 200,
    height: 50,
    borderRadius: 5,
    backgroundColor: 'white',
    margin: 10,
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
  timerText: {
    color: 'white',
    fontSize: 10,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
})
