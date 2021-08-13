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
  Picker,
} from 'react-native'
import CheckBox from '@react-native-community/checkbox'
import Toast from 'react-native-simple-toast'
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
import {ASTORAGE_QC, DURATIONS, LANGUAGES, QUESTION_CASE} from './consts'
import { appendText } from './Utils'
const editSubCategory = ({navigation}) => {
  let [subCategoryName, setSubCategoryName] = useState('')
  let [coefTime, setCoefTime] = useState('1.2')
  let [toggleCheckBox_word, setToggleCheckBox_word] = useState(false)
  let [toggleCheckBox_meaning, setToggleCheckBox_meaning] = useState(false)
  let [toggleCheckBox_example, setToggleCheckBox_example] = useState(false)
  let [toggleCheckBox_img, setToggleCheckBox_img] = useState(false)
  let [lang, setLang] = useState('en-IE')
  let [intervalTime, setIntervalTime] = useState('10')
  let [intervalUnit, setIntervalUnit] = useState(DURATIONS.second)
  let [stages, setStages] = useState('5')
  let [load, setLoad] = useState(false)
  let categoryName = navigation.state.params.categoryName

  const loadSettings = async () => {
    let jsonSetting = JSON.parse(navigation.state.params.settings)

    if (jsonSetting !== null) {
      setSubCategoryName(jsonSetting.name)
      setCoefTime(jsonSetting.coefTime)
      setToggleCheckBox_word(jsonSetting.questionOrder.word)
      setToggleCheckBox_meaning(jsonSetting.questionOrder.meaning)
      setToggleCheckBox_example(jsonSetting.questionOrder.example)
      setToggleCheckBox_img(jsonSetting.questionOrder.img)
      setLang(jsonSetting.ttsLang)
      setIntervalTime(jsonSetting.intervalTime)
      setIntervalUnit(jsonSetting.intervalUnit)
      setStages(jsonSetting.stages)

      setLoad(true)
    }
  }
  useEffect(() => {
    !load &&  loadSettings()
  })

  const save = async () => {
    if (
      subCategoryName == null ||
      subCategoryName == '' ||
      parseFloat(coefTime) == null
    ) {
      Alert.alert('نام زیر گروه نباید خالی باشد')
      return
    }
 
    let obj = {
      name: subCategoryName,
      coefTime: coefTime,
      questionOrder: {
        word: toggleCheckBox_word,
        meaning: toggleCheckBox_meaning,
        example: toggleCheckBox_example,
        img: toggleCheckBox_img,
      },
      ttsLang: lang,
      intervalTime: intervalTime,
      intervalUnit: intervalUnit,
      stages: stages,
    }
    let path = categoryName + '/' + subCategoryName
    writeToFile(path, subCategoryName + '.json', obj, result => {
      if (result) {
        navigation.navigate('subCategories')
      }
    })
  }
  return (
    <ScrollView
      contentContainerStyle={{flexGrow: 1}}
      showsVerticalScrollIndicator={false}>
      <LinearGradient
        colors={['#4c669f', '#3b5998', '#192f6a']}
        style={styles.linearGradient}>
        <TextInput
          style={styles.InputText}
          placeholder='نام زیر گروه رو وارد کنید '
          editable={false}
          onChangeText={text => setSubCategoryName(text)}
          defaultValue={subCategoryName}
        />
        <View style={{flexDirection: 'row'}}>
          <TextInput
            style={styles.InputTextCoef}
            placeholder='ضریب'
            keyboardType='numeric'
            onChangeText={text => {
              setCoefTime(text)
            }}
            value={coefTime}
            defaultValue={coefTime}
          />
          <Text style={styles.lableText}>(s)ضریب زمان پاسخگویی</Text>
        </View>

        <View
          style={{flex: 1, alignItems: 'flex-end', width: '60%', margin: 20}}>
          <Text
            style={{
              color: 'white',
              fontFamily: 'IRANSansMobile_Bold',
              fontSize: 20,
            }}>
            مورد پرسش
          </Text>
          <View style={{flexDirection: 'row'}}>
            <CheckBox
              disabled={false}
              value={toggleCheckBox_word}
              onValueChange={newValue => setToggleCheckBox_word(newValue)}
            />
            <Text style={styles.lableText}>پرسش</Text>
          </View>
          <View style={{flexDirection: 'row'}}>
            <CheckBox
              disabled={false}
              value={toggleCheckBox_meaning}
              onValueChange={newValue => setToggleCheckBox_meaning(newValue)}
            />
            <Text style={styles.lableText}>پاسخ</Text>
          </View>
          <View style={{flexDirection: 'row'}}>
            <CheckBox
              disabled={false}
              value={toggleCheckBox_example}
              onValueChange={newValue => setToggleCheckBox_example(newValue)}
            />
            <Text style={styles.lableText}>توضیحات</Text>
          </View>
          <View style={{flexDirection: 'row'}}>
            <CheckBox
              disabled={false}
              value={toggleCheckBox_img}
              onValueChange={newValue => setToggleCheckBox_img(newValue)}
            />
            <Text style={styles.lableText}>عکس</Text>
          </View>
        </View>
        <View style={{alignItems: 'flex-start'}}>
          <View style={{flexDirection: 'row'}}>
            <Picker
              selectedValue={intervalUnit}
              style={{height: 50, width: 100, margin: 2, textColor: 'white'}}
              onValueChange={(itemValue, itemIndex) =>
                setIntervalUnit(itemValue)
              }>
              <Picker.Item label='ثانیه' value={DURATIONS.second} />
              <Picker.Item label='دقیقه' value={DURATIONS.minute} />
              <Picker.Item label='ساعت' value={DURATIONS.hour} />
              <Picker.Item label='روز' value={DURATIONS.day} />
            </Picker>
            <TextInput
              style={styles.inputTextIntervalTime}
              placeholder='تعداد واحد زمانی'
              onChangeText={text => setIntervalTime(text)}
              value={intervalTime}
              defaultValue={intervalTime}
            />
            <Text style={styles.lableText}>واحد زمانی</Text>
          </View>
          <View style={{flexDirection: 'row'}}>
            <TextInput
              style={styles.inputTextIntervalTime}
              placeholder='تعداد مرتیه'
              onChangeText={text => setStages(text)}
              value={stages}
              defaultValue={stages}
            />
            <Text style={styles.lableText}>تعداد مرتبه</Text>
          </View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Picker
            style={styles.picker}
            selectedValue={lang}
            style={{height: 50, width: 150, margin: 10}}
            onValueChange={(itemValue, itemIndex) => setLang(itemValue)}
            itemStyle={{
              backgroundColor: 'grey',
              color: 'black',
              fontFamily: 'IRANSansMobile',
              fontSize: 17,
            }}>
            <Picker.Item
              label='انگلیسی_بریتانیا'
              value={LANGUAGES.english_british}
            />
            <Picker.Item
              label='انگلیسی_آمریکا'
              value={LANGUAGES.english_american}
            />
            <Picker.Item label='فرانسوی' value={LANGUAGES.french} />
            <Picker.Item label='آلمانی' value={LANGUAGES.deutsch_germany} />
            <Picker.Item label='اسپانیایی' value={LANGUAGES.spanish} />
            <Picker.Item label='روسی' value={LANGUAGES.russian} />
            <Picker.Item label='ترکی' value={LANGUAGES.turkish} />
            <Picker.Item label='چینی' value={LANGUAGES.chinese} />
            <Picker.Item label='هندی' value={LANGUAGES.india} />
            <Picker.Item label='ایتالیایی' value={LANGUAGES.italian} />
            <Picker.Item label='پرتقالی' value={LANGUAGES.portuguese} />
            <Picker.Item label='ژاپنی' value={LANGUAGES.japanese} />
            <Picker.Item label='عربی' value={LANGUAGES.arabic} />
          </Picker>
          <Text style={styles.textSettingLang}>زبان text to speech</Text>
        </View>
        <TouchableOpacity style={styles.NextBtn} onPress={() => save()}>
          <Text style={styles.textBtn}>ذخیره</Text>
        </TouchableOpacity>
      </LinearGradient>
    </ScrollView>
  )
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
  let [voice1Path, setVoice1Path] = useState(word.voiceUri1)
  let [voice2Path, setVoice2Path] = useState(word.voiceUri2)
  let [voice3Path, setVoice3Path] = useState(word.voiceUri3)
  let [coefTime, setCoefTime] = useState(word.coefTime)
  let [readDate, setReaDate] = useState(word.readDate)
  let [nextReviewDate, setNextReviewDate] = useState(word.nextReviewDate)
  let [position, setPosition] = useState(word.position)

  useEffect(() => {
    // console.log(pathFile + '/' + voice1Path)
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
    navigation.state.params.words[index].voiceUri1 = voice1Path
    navigation.state.params.words[index].voiceUri2 = voice2Path
    navigation.state.params.words[index].voiceUri3 = voice3Path
    navigation.state.params.words[index].readDate = readDate
    navigation.state.params.words[index].nextReviewDate = nextReviewDate
    navigation.state.params.words[index].position = position

    let path =
      navigation.state.params.categoryName +
      '/' +
      navigation.state.params.subCategoryName +
      '/' +
      navigation.state.params.currentFile.name
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
        <View style={{flexDirection: 'row'}}>
          <TextInput
            style={styles.InputText}
            placeholder='واژه یا سوال  را وارد کنید'
            multiline={true}
            onChangeText={text => {
              setVoice1Path(text + '1.mp3')
              setVoice2Path(text + '2.mp3')
              setVoice3Path(text + '3.mp3')
              setEnglishWord(text)
            }}
            defaultValue={englishWord}
          />
          <VoiceRecorder inputpath={pathFile + '/' + voice1Path} />
        </View>
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
        <View style={{flexDirection: 'row'}}>
          <TextInput
            style={styles.InputText}
            placeholder='معانی یا پاسخ را وارد کنید '
            multiline={true}
            onChangeText={text => onPars(text)}
            value={appendText(meaning)}
          />
          <VoiceRecorder inputpath={pathFile + '/' + voice2Path} />
        </View>
        <View style={{flexDirection: 'row'}}>
          <TextInput
            style={[styles.InputText, {height: 100, textAlignVertical: 'top'}]}
            placeholder='مثال یا توضیحات را وارد کنید'
            multiline={true}
            onChangeText={text => {
              setExample(text)
            }}
            defaultValue={example}
          />
          <VoiceRecorder inputpath={pathFile + '/' + voice3Path} />
        </View>
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
  picker: {
    height: 50,
    width: 150,
    margin: 10,
    color: 'white',
  },
})

export {EditCard, editSubCategory}
