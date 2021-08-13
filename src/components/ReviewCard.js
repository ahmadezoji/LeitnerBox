import AsyncStorage from '@react-native-community/async-storage'
import React, {useEffect, useState} from 'react'
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
  Alert,
} from 'react-native'
import Toast from 'react-native-simple-toast'
import LottieView from 'lottie-react-native'
import LinearGradient from 'react-native-linear-gradient'
import {writeToFile} from './FileManger'
import {
  ASTORAGE_TIME,
  ASTORAGE_UNIT,
  coef,
  COEFS,
  DURATIONS,
  QUESTION_CASE,
  STEPS_COUNT,
} from './consts'
import moment from 'moment'
import {Icon} from 'native-base'
import {VoicePlayer, VoiceRecorderWithOptions} from './Voice'
import {TTSBox} from './Card'
import {appendText} from './Utils'
let RNFS = require('react-native-fs')
const formatNumber = number => `0${number}`.slice(-2)

const getRemaining = time => {
  const mins = Math.floor(time / 60)
  const secs = time - mins * 60
  return {mins: formatNumber(mins), secs: formatNumber(secs)}
}

const MyTimer = (isStart, maxVal) => {
  let [time, setTime] = useState(0)
  let intervalTimer = null
  useEffect(() => {
    if (isStart) {
      intervalTimer = setInterval(() => {
        // setTime(moment(new Date().getTime()).format('ss:ms'))
        setTime(time + 1)
      }, 1000)
    } else {
      if (intervalTimer !== null) clearInterval(intervalTimer)
    }
  })
  console.log(time)
  return (
    <View style={{justifyContent: 'center', alignItems: 'center'}}>
      <Text
        style={{
          color: 'black',
          fontSize: 15,
          textAlign: 'center',
        }}>
        {time}
      </Text>
    </View>
  )
}
export default class ReviewCard extends React.Component {
  constructor (props) {
    super(props)
    let intervalTimer = null
    this.state = {
      showOver: false,
      word: {},
      loaded: false,
      remainingSecs: 0,
      isActive: false,
      recommendBtn: null,
      viewArrays: [],
      lang: 'en-IE',
      intervalTime: '10',
      intervalUnit: DURATIONS.second,
      stages: 5,
    }
  }
  componentWillMount () {
    this.startTimer(true)
  }
  async componentDidMount () {
    let words = await this.props.navigation.state.params.words
    let index = await this.props.navigation.state.params.index
    await this.setState({
      word: words[index],
      loaded: true,
      arraySetting: [],
    })

    this.loadSettings()
  }
  async startTimer () {
    if (!this.state.isActive) {
      this.intervalTimer = setInterval(() => {
        if (this.state.remainingSecs > 60) this._showOver()
        this.setState({remainingSecs: this.state.remainingSecs + 1})
        let time = getRemaining(this.state.remainingSecs)
        // let time = moment(new Date().getTime()).format('ss:s')
        let text = time.mins + ':' + time.secs
        this.props.navigation.setParams({timer: text})
        // console.log(moment(new Date().getTime()).format('ss:s'));
      }, 1000)
      this.setState({isActive: true})
    }
  }

  stopTimer () {
    if (this.state.isActive) clearInterval(this.intervalTimer)
  }
  async save (coef) {
    // let interval = await AsyncStorage.getItem(ASTORAGE_TIME)
    // let unit = await AsyncStorage.getItem(ASTORAGE_UNIT)
    let interval = await this.state.intervalTime
    let unit = await this.state.intervalUnit
    let STEPS_COUNT = await this.state.stages

    console.log(unit)

    console.log(interval, unit)

    if (interval == null || unit == null) {
      Alert.alert('از منو پروفایل ضریب زمانی و وارد کنید')
      return
    }

    let index = await this.props.navigation.state.params.index

    let position = this.props.navigation.state.params.words[index].position
    let today = new Date()
    // if (
    //   this.props.navigation.state.params.words[index].position >= 0 &&
    //   this.props.navigation.state.params.words[index].position <= STEPS_COUNT
    // ) {
    if (coef == COEFS.superEasy) {
      this.props.navigation.state.params.words[index].position = -20 //learned this word
    } else if (coef == COEFS.veryEasy && position + 2 <= STEPS_COUNT) {
      this.props.navigation.state.params.words[index].position =
        this.props.navigation.state.params.words[index].position + 2
      let newPosition = this.props.navigation.state.params.words[index].position
      this.props.navigation.state.params.words[index].nextReviewDate = moment(
        new Date(),
      ).add(Math.pow(2, newPosition) * interval, unit)
    } else if (coef == COEFS.easy && position + 1 <= STEPS_COUNT) {
      this.props.navigation.state.params.words[index].position =
        this.props.navigation.state.params.words[index].position + 1
      let newPosition = this.props.navigation.state.params.words[index].position
      this.props.navigation.state.params.words[index].nextReviewDate = moment(
        new Date(),
      ).add(Math.pow(2, newPosition) * interval, unit)
    } else if (coef == COEFS.medium) {
      // this.props.navigation.state.params.words[index].nextReviewDate = moment(new Date()).add(coef * interval, unit)
    } else if (coef == COEFS.hard && position - 1 >= 0) {
      this.props.navigation.state.params.words[index].position =
        this.props.navigation.state.params.words[index].position - 1
      let newPosition = this.props.navigation.state.params.words[index].position
      this.props.navigation.state.params.words[index].nextReviewDate = moment(
        new Date(),
      ).add(Math.pow(2, newPosition) * interval, unit)
    } else if (coef == COEFS.superHard) {
      this.props.navigation.state.params.words[index].position = 0
      this.props.navigation.state.params.words[index].readDate = today
      this.props.navigation.state.params.words[index].nextReviewDate = today
    }

    let path =
      this.props.navigation.state.params.categoryName +
      '/' +
      this.props.navigation.state.params.subCategoryName +
      '/' +
      this.props.navigation.state.params.currentFile.name

    writeToFile(
      path,
      this.props.navigation.state.params.currentFile.name + '.json',
      this.props.navigation.state.params.words,
      result => {
        let pos = this.props.navigation.state.params.words[index].position
        let next = this.props.navigation.state.params.words[index]
          .nextReviewDate
        if (pos !== null && next !== null && unit !== null) {
          let time_en = moment.unix(next)
          let time_st = moment.unix(today)
          let diff = time_en.diff(time_st, unit)

          Toast.show('جایگاه جدید :  ' + pos)
          Toast.show('مرور بعدی :  ' + parseInt(diff) / 1000 + ' ' + unit)
        }
        this.props.navigation.goBack()
      },
    )
  }
  _showOver () {
    this.setState({showOver: !this.state.showOver})
    this.stopTimer()
    if (
      this.state.word.coefTime !== null &&
      this.state.word.englishWord !== null &&
      this.state.showOver == false
    ) {
      let validTime =
        this.state.word.englishWord.length *
        parseFloat(this.state.word.coefTime)
      let duration = this.state.remainingSecs
      if (duration >= 0 && duration < validTime / 3) {
        this.setState({recommendBtn: COEFS.easy})
        Toast.show('بنظرم پاسخ راحت بود')
      } else if (duration > validTime / 3 && duration < 2 * (validTime / 3)) {
        this.setState({recommendBtn: COEFS.medium})
        Toast.show('بنظرم پاسخ متوسط بود')
      } else if (duration > 2 * (validTime / 3) && duration <= validTime) {
        this.setState({recommendBtn: COEFS.hard})
        Toast.show('بنظرم پاسخ سختی بود')
      } else if (duration > validTime) {
        this.setState({recommendBtn: COEFS.superHard})
        Toast.show('دیگه خیلی کشش دادی')
      }
    }
  }
  async loadSettings () {
    console.log(JSON.parse(this.props.navigation.state.params.settings).ttsLang)
    if (JSON.parse(this.props.navigation.state.params.settings) !== null)
      this.setState({
        viewArrays: JSON.parse(this.props.navigation.state.params.settings)
          .questionOrder,
        lang: JSON.parse(this.props.navigation.state.params.settings).ttsLang,
        intervalTime: JSON.parse(this.props.navigation.state.params.settings)
          .intervalTime,
        intervalUnit: JSON.parse(this.props.navigation.state.params.settings)
          .intervalUnit,
        stages: JSON.parse(this.props.navigation.state.params.settings).stages,
      })
  }
  renderQuestion = path => {
    return (
      <View style={{justifyContent: 'center', alignItems: 'center'}}>
        <Text style={styles.TitleText}>{this.state.word.englishWord}</Text>
        <TTSBox
          inputText={this.state.word.englishWord}
          lang={this.state.lang}
        />
        <VoicePlayer inputpath={path.path + '/' + this.state.word.voiceUri1} />
      </View>
    )
  }
  renderImage = path => {
    return (
      <View style={{justifyContent: 'center', alignItems: 'center'}}>
        <Image
          source={{
            uri:
              'file://' +
              this.props.navigation.state.params.currentFile.path +
              '/' +
              this.state.word.imgUri,
          }}
          style={styles.wordImage}
        />
      </View>
    )
  }
  renderAnswer = path => {
    return (
      <View style={{justifyContent: 'center', alignItems: 'center'}}>
        <Text style={styles.meaningText}>{this.state.word.meaning}</Text>
        {this.state.word.meaning && (
          <TTSBox
            inputText={appendText(this.state.word.meaning)}
            lang={this.state.lang}
          />
        )}
        <VoicePlayer inputpath={path.path + '/' + this.state.word.voiceUri2} />
      </View>
    )
  }
  renderExample = path => {
    return (
      <View style={{justifyContent: 'center', alignItems: 'center'}}>
        <Text style={styles.exampleText}>{this.state.word.example}</Text>
        <TTSBox inputText={this.state.word.example} lang={this.state.lang} />
        <VoicePlayer inputpath={path.path + '/' + this.state.word.voiceUri3} />
      </View>
    )
  }
  render () {
    let path = this.props.navigation.state.params.currentFile.path
    let defaultCaseView = (
      <View>
        {this.state.viewArrays.word && <this.renderQuestion path={path} />}
        {this.state.viewArrays.meaning && <this.renderAnswer path={path} />}
        {this.state.viewArrays.example && <this.renderExample path={path} />}
        {this.state.viewArrays.img && <this.renderImage path={path} />}
      </View>
    )

    return (
      <LinearGradient
        colors={['#e68d03', '#d7d0c4', '#a28450']}
        style={styles.linearGradient}>
        <StatusBar translucent backgroundColor='transparent' />
       
        <ScrollView contentContainerStyle={{flexGrow: 1}}>
          <View style={styles.container}>
            {!this.state.showOver && defaultCaseView}
            <TouchableOpacity
              style={styles.BtnShowOver}
              onPress={() => this._showOver()}>
              <Text style={styles.textBtn}>
                {this.state.showOver ? 'بستن' : 'نمایش پاسخ'}
              </Text>
            </TouchableOpacity>

            {this.state.showOver && (
              <View style={styles.container}>
                <this.renderQuestion path={path} />
                <this.renderAnswer path={path} />
                <this.renderExample path={path} />
                <this.renderImage path={path} />
                <View
                  style={{
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <View style={{flexDirection: 'row'}}>
                    <TouchableOpacity
                      // style={styles.Btn}
                      style={[
                        styles.Btn,
                        {
                          borderColor:
                            this.state.recommendBtn == COEFS.superEasy
                              ? 'white'
                              : 'transparent',
                        },
                      ]}
                      onPress={() => {
                        this.save(COEFS.superEasy)
                      }}>
                      <Text style={styles.textBtn}> بلدم بیخیال</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      // style={styles.Btn}
                      style={[
                        styles.Btn,
                        {
                          borderColor:
                            this.state.recommendBtn == COEFS.veryEasy
                              ? 'white'
                              : 'transparent',
                        },
                      ]}
                      onPress={() => {
                        this.save(COEFS.veryEasy)
                      }}>
                      <Text style={styles.textBtn}>خیلی ساده</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      // style={styles.Btn}
                      style={[
                        styles.Btn,
                        {
                          borderColor:
                            this.state.recommendBtn == COEFS.easy
                              ? 'white'
                              : 'transparent',
                        },
                      ]}
                      onPress={() => {
                        this.save(COEFS.easy)
                      }}>
                      <Text style={styles.textBtn}> ساده</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={{flexDirection: 'row'}}>
                    <TouchableOpacity
                      // style={styles.Btn}
                      style={[
                        styles.Btn,
                        {
                          borderColor:
                            this.state.recommendBtn == COEFS.medium
                              ? 'white'
                              : 'transparent',
                        },
                      ]}
                      onPress={() => {
                        this.save(COEFS.medium)
                      }}>
                      <Text style={styles.textBtn}>متوسط</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      // style={styles.Btn}
                      style={[
                        styles.Btn,
                        {
                          borderColor:
                            this.state.recommendBtn == COEFS.hard
                              ? 'white'
                              : 'transparent',
                        },
                      ]}
                      onPress={() => {
                        this.save(COEFS.hard)
                      }}>
                      <Text style={styles.textBtn}> سخت</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      // style={styles.Btn}
                      style={[
                        styles.Btn,
                        {
                          borderColor:
                            this.state.recommendBtn == COEFS.superHard
                              ? 'white'
                              : 'transparent',
                        },
                      ]}
                      onPress={() => {
                        this.save(COEFS.superHard)
                      }}>
                      <Text style={styles.textBtn}>بلد نیستم</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )}
          </View>
        </ScrollView>
        <VoiceRecorderWithOptions open={true} />
      </LinearGradient>
    )
  }
}

let styles = StyleSheet.create({
  linearGradient: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 50,
  },
  TitleText: {
    color: 'black',
    fontSize: 16,
    textAlign: 'center',
    fontFamily: 'IRANSansMobile_Bold',
  },
  meaningText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
    fontFamily: 'IRANSansMobile',
  },
  exampleText: {
    color: 'yellow',
    fontSize: 16,
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
  NextBtn: {
    backgroundColor: 'red',
    width: 100,
    height: 40,
    borderRadius: 10,
    margin: 10,
  },
  textBtn: {
    fontFamily: 'IRANSansMobile',
    fontSize: 10,
    color: 'black',
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  Btn: {
    backgroundColor: 'red',
    width: 100,
    height: 40,
    borderRadius: 10,
    margin: 10,
    borderWidth: 2,
    justifyContent: 'center',
  },
  BtnShowOver: {
    width: 100,
    height: 40,
    borderRadius: 10,
    backgroundColor: 'white',
    marginTop: 2,
    marginBottom: 50,
    justifyContent: 'center',
  },
})

export {MyTimer}
