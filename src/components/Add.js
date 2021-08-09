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
  createLesson,
  createSubCategory,
  getFileContent,
  writeToFile,
} from './FileManger'
import moment from 'moment'
import {VoiceRecorder} from './Voice'
import {ASTORAGE_QC, LANGUAGES, QUESTION_CASE} from './consts'

const appendText = array => {
  let text = ''
  for (let i = 0; i < array.length; i++) {
    if (i !== array.length - 1) text = text + array[i] + ','
    else text = text + array[i]
  }
  return text
}
const AddCard = ({navigation}) => {
  let [pathFile, setPathFile] = useState(
    navigation.state.params.currentFile.path,
  )
  let [englishWord, setEnglishWord] = useState('')
  let [meaning, setMeaning] = useState([])
  let [example, setExample] = useState('')
  let [imgUri, setImgUri] = useState('')
  let [voice1Path, setVoice1Path] = useState(pathFile + '/')
  let [voice2Path, setVoice2Path] = useState(pathFile + '/')
  let [voice3Path, setVoice3Path] = useState(pathFile + '/')
  let [coefTime, setCoefTime] = useState('1.2')
  let [readDate, setReaDate] = useState('null')
  let [nextReviewDate, setNextReviewDate] = useState('null')
  let [position, setPosition] = useState(-1)

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
  useEffect(() => {
    // console.log(navigation.state.params)\
    loadSettings()
  })
  const loadSettings = async () => {
    requestMicrophone()

    let key =
      navigation.state.params.categoryName +
      '/' +
      navigation.state.params.subCategoryName

    let array = await AsyncStorage.getItem(key) //داده های پیش فرض کتاب
    let defaultCoef = JSON.parse(array)[0]
    if (defaultCoef !== null || defaultCoef !== undefined) {
      setCoefTime(defaultCoef)
    }
  }
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
          setImgUri(englishWord + '.jpg')
        }
      })
    })
  }
  const saveCard = async () => {
    let index = await navigation.state.params.index
    let word = {
      englishWord: englishWord,
      meaning: meaning,
      example: example,
      imgUri: imgUri,
      voiceUri1: voice1Path,
      voiceUri2: voice2Path,
      voiceUri3: voice3Path,
      coefTime: coefTime,
      readDate: 'null',
      nextReviewDate: 'null',
      position: -1,
    }

    const newToDoList = [...navigation.state.params.words, word]
    let path =
      navigation.state.params.categoryName +
      '/' +
      navigation.state.params.subCategoryName +
      '/' +
      navigation.state.params.currentFile.name
    writeToFile(
      path,
      navigation.state.params.currentFile.name + '.json',
      newToDoList,
      result => {
        if (result) navigation.goBack()
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
const addLesson = ({navigation}) => {
  let [lessons, setLessons] = useState('')
  let [coefTime, setCoefTime] = useState('1.2')
  let [questionCase, setQuestionCase] = useState(0)
  let categoryName = navigation.state.params.categoryName
  let subCategoryName = navigation.state.params.subCategoryName

  const save = async () => {
    var obj = []
    createLesson(categoryName, subCategoryName, lessons, result => {
      if (result) {
        let path = categoryName + '/' + subCategoryName + '/' + lessons
        writeToFile(path, lessons + '.json', obj, result => {
          if (result) {
            navigation.navigate('lessons')
          }
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
        placeholder='نام درس رو وارد کنید '
        onChangeText={text => setLessons(text)}
        defaultValue={lessons}
      />
      <TouchableOpacity style={styles.NextBtn} onPress={() => save()}>
        <Text style={styles.textBtn}>ذخیره</Text>
      </TouchableOpacity>
    </LinearGradient>
  )
}
const addSubCategory = ({navigation}) => {
  let [subCategoryName, setSubCategoryName] = useState('')
  let [coefTime, setCoefTime] = useState('1.2')
  // let [questionCase, setQuestionCase] = useState(0)
  let [toggleCheckBox_word, setToggleCheckBox_word] = useState(false)
  let [toggleCheckBox_meaning, setToggleCheckBox_meaning] = useState(false)
  let [toggleCheckBox_example, setToggleCheckBox_example] = useState(false)
  let [toggleCheckBox_img, setToggleCheckBox_img] = useState(false)
  let [lang, setLang] = useState('en-IE')
  let categoryName = navigation.state.params.categoryName

  useEffect(() => {
    let array = [
      coefTime,
      [
        toggleCheckBox_word,
        toggleCheckBox_meaning,
        toggleCheckBox_example,
        toggleCheckBox_img,
      ],
      lang,
    ]
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
    var obj = []
    createSubCategory(categoryName, subCategoryName, result => {
      if (result) {
        let path = categoryName + '/' + subCategoryName
        let array = [
          coefTime,
          [
            toggleCheckBox_word,
            toggleCheckBox_meaning,
            toggleCheckBox_example,
            toggleCheckBox_img,
          ],
          lang,
        ]
        console.log(array)
        AsyncStorage.setItem(path, JSON.stringify(array))
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
              size: 30,
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
const addCategory = ({navigation}) => {
  const [categoryName, setCategoryName] = useState('')

  const save = () => {
    if (categoryName == null || categoryName == '') {
      Alert.alert('نام گروه نباید خالی باشد')
      return
    }
    createCategory(categoryName, result => {
      if (result)
        // navigation.push('addSubCategory', {categoryName: categoryName})
        navigation.navigate('learn')
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
const styles = StyleSheet.create({
  linearGradient: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
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
    width: 200,
    margin: 10,
    color: 'white',
  },
  textSettingLang: {
    color: 'black',
    fontSize: 15,
    textAlign: 'center',
    color: 'red',
  },
})

export {AddCard, addCategory, addSubCategory, addLesson}

{
  /* <Picker
          selectedValue={questionCase}
          style={styles.picker}
          onValueChange={(itemValue, itemIndex) => setQuestionCase(itemValue)}>
          <Picker.Item label='پرسش' value={QUESTION_CASE.englishWord} />
          <Picker.Item label='پاسخ' value={QUESTION_CASE.meaning} />
          <Picker.Item label='نمونه' value={QUESTION_CASE.example} />
          <Picker.Item label='عکس' value={QUESTION_CASE.image} />
        </Picker> */
}
