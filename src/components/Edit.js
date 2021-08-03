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
  Alert,
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

const appendText = array => {
  let text = ''
  for (let i = 0; i < array.length; i++) {
    if (i !== array.length - 1) text = text + array[i] + ','
    else text = text + array[i]
  }
  return text
}
const EditCard = ({navigation}) => {
  let [word, setWord] = useState(
    navigation.state.params.words[navigation.state.params.index],
  )
  let [pathFile, setPathFile] = useState(
    navigation.state.params.currentFile.path,
  )
  let [englishWord, setEnglishWord] = useState(word.englishWord)
  let [meaning, setMeaning] = useState(word.meaning)
  let [example, setExample] = useState(word.example)
  let [imgUri, setImgUri] = useState(word.imgUri)
  let [voice1Path, setVoice1Path] = useState(pathFile + '/' + word.voiceUri1)
  let [voice2Path, setVoice2Path] = useState(pathFile + '/' + word.voiceUri2)
  let [coefTime, setCoefTime] = useState(word.coefTime)
  let [readDate, setReaDate] = useState(word.readDate)
  let [nextReviewDate, setNextReviewDate] = useState(word.nextReviewDate)
  let [position, setPosition] = useState(word.position)

  useEffect(() => {
    // console.log(navigation.state.params)
  })
  const onPars = text => {
    let array = text.split('،')
    setMeaning(array)
  }
  const chooseFile = () => {
    setImgUri('')
    picker((source, data) => {
      if (source == null) return
      let newPath = pathFile + '/' + englishWord + '.jpg'
      copyFile(source.uri, newPath, result => {
        if (result) {
          setImgUri(newPath)
        }
      })
    })
  }
  const saveCard = async () => {
    let index = await navigation.state.params.index
    navigation.state.params.words[index].englishWord = englishWord
    navigation.state.params.words[index].meaning = meaning
    navigation.state.params.words[index].example = example
    navigation.state.params.words[index].coefTime = coefTime
    navigation.state.params.words[index].readDate = readDate
    navigation.state.params.words[index].nextReviewDate = nextReviewDate
    navigation.state.params.words[index].position = position

    let path =
      navigation.state.params.categoryName +
      '/' +
      navigation.state.params.currentFile.name
    console.log(navigation.state.params.words[index])
    writeToFile(
      path,
      navigation.state.params.currentFile.name + '.json',
      navigation.state.params.words,
      result => {
        navigation.navigate('card', navigation.state.params)
      },
    )
  }
  return (
    <LinearGradient
      colors={['#4c669f', '#3b5998', '#192f6a']}
      style={styles.linearGradient}>
      <StatusBar translucent backgroundColor='transparent' />
      <ScrollView
        contentContainerStyle={{flexGrow: 1}}
        showsVerticalScrollIndicator={false}>
        {word && (
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <TextInput
              style={styles.InputText}
              placeholder='واژه یا سوال  را وارد کنید'
              multiline={true}
              onChangeText={text => {
                setVoice1Path(pathFile + '/' + text + '1.mp3')
                setVoice2Path(pathFile + '/' + text + '2.mp3')
                setEnglishWord(text)
              }}
              defaultValue={englishWord}
            />

            <View style={{flexDirection: 'row'}}>
              <TextInput
                style={styles.InputTextCoef}
                placeholder='ضریب'
                onChangeText={text => {
                  setCoefTime(text)
                }}
                value={coefTime}
                defaultValue={coefTime}
              />
              <Text style={styles.lableText}>(s)ضریب زمان پاسخگویی</Text>
            </View>
            {englishWord !== '' && <VoiceRecorder inputpath={voice1Path} />}
            <TextInput
              style={styles.InputText}
              placeholder='معانی یا پاسخ را وارد کنید '
              multiline={true}
              onChangeText={text => onPars(text)}
              value={appendText(meaning)}
            />
            <TextInput
              style={styles.InputText}
              placeholder='مثال یا توضیحات را وارد کنید'
              multiline={true}
              onChangeText={text => {
                setExample(text)
              }}
              defaultValue={example}
            />
            <VoiceRecorder inputpath={voice2Path} />
            <Image
              source={{
                uri: 'file://' + pathFile + '/' + imgUri,
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
                value={pathFile + '/' + imgUri}
              />
              <TouchableOpacity
                style={styles.browsBtn}
                onPress={() => chooseFile()}>
                <Text style={styles.textBtn}>گالری</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.NextBtn} onPress={() => saveCard()}>
              <Text style={styles.textBtn}>ذخیره</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </LinearGradient>
  )
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
    fontSize: 20,
    textAlign: 'center',
    fontFamily: 'IRANSansMobile_Bold',
  },
  meaningText: {
    color: 'red',
    fontSize: 15,
    textAlign: 'center',
    fontFamily: 'IRANSansMobile',
  },
  exampleText: {
    color: 'yellow',
    fontSize: 12,
    textAlign: 'center',
    fontFamily: 'IRANSansMobile',
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
    width: 70,
    height: 40,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    margin: 5,
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
  lableText: {
    textAlign: 'center',
    textAlignVertical: 'center',
    color: 'red',
    fontSize: 12,
    fontFamily: 'IRANSansMobile',
  },
  InputTextCoef: {
    borderRadius: 2,
    backgroundColor: 'white',
    margin: 10,
    fontFamily: 'IRANSansMobile',
    textAlign: 'center',
  },
})

export {EditCard}
