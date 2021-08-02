import AsyncStorage from '@react-native-community/async-storage'
import React, {useState, useEffect} from 'react'
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
} from 'react-native'
import Toast from 'react-native-simple-toast'
const Sound = require('react-native-sound')
import LottieView from 'lottie-react-native'
import LinearGradient from 'react-native-linear-gradient'
import {ifExistFile, writeToFile} from './FileManger'
import moment from 'moment'
import {Icon} from 'native-base'
import {VoicePlayer} from './Voice'
import Tts from 'react-native-tts'
let RNFS = require('react-native-fs')

const TTSBox = inputText => {
  let [speed, setSpeed] = useState(6)
  let [text, setText] = useState(inputText.inputText)
  let [lang, setLang] = useState('')

  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      borderColor: 'yellow',
      borderWidth: 1,
      borderRadius: 4,
      margin: 5,
      width: 100,
    },
    TTSBox: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    TTSIcon: {
      color: 'white',
      fontSize: 20,
      margin: 5,
    },
    speedText: {
      color: 'white',
      fontSize: 12,
      textAlign: 'center',
      textAlignVertical: 'center',
      margin: 5,
    },
  })

  useEffect(() => {
    setText(inputText.inputText)
    Tts.setDefaultRate(speed / 10)
  })
  const play = () => {
    try {
      if (text !== null || text !== '') Tts.speak(text)
    } catch (error) {
      Toast.show('خطا در پخش صدا')
    }
  }
  // readLang();
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.TTSBox} onPress={() => play()}>
        <Icon style={styles.TTSIcon} name='sound' type='AntDesign' />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.TTSBox}
        onPress={() => {
          // setSpeedDefault(speed)
          speed < 9 ? setSpeed(speed + 1) : setSpeed(1)
        }}>
        <Text style={styles.speedText}>x{speed}</Text>
      </TouchableOpacity>
    </View>
  )
}
export default class Card extends React.Component {
  constructor (props) {
    super(props)
    ;(this.player = null),
      (this.state = {
        word: {},
        startPlay: false,
        duration: 0,
        playerSpeed: 1.0,
        loaded: false,
        pathVoice1: '',
        pathVoice2: '',
      })
  }
  async componentDidMount () {
    let words = await this.props.navigation.state.params.words
    let index = await this.props.navigation.state.params.index

    await this.setState({word: words[index], loaded: true})

    if (this.state.word !== null) {
      let path = this.props.navigation.state.params.currentFile.path
      RNFS.exists(path).then(result => {
        if (result) {
          this.setState({
            pathVoice1: path + '/' + this.state.word.voiceUri1,
            pathVoice2: path + '/' + this.state.word.voiceUri2,
          })
        }
      })
    }

    // console.log(String(this.state.word.meaning[0]));

    let interval = await AsyncStorage.getItem('intervalTime') //minute
    let unit = await AsyncStorage.getItem('intervalTimeUnit') //minute

    if (this.props.navigation.state.params.words[index].readDate == 'null') {
      console.log('start card')
      let today = new Date()
      this.props.navigation.state.params.words[index].position = 0
      this.props.navigation.state.params.words[index].readDate = today
      this.props.navigation.state.params.words[index].nextReviewDate = today
      this.save()
    }
  }
  async save () {
    let path =
      this.props.navigation.state.params.categoryName +
      '/' +
      this.props.navigation.state.params.currentFile.name
    writeToFile(
      path,
      this.props.navigation.state.params.currentFile.name + '.json',
      this.props.navigation.state.params.words,
      result => {
        if (result) {
          console.log(result)
        }
      },
    )
  }
  render () {
    let size = Object.keys(this.props.navigation.state.params.words).length
    let index = this.props.navigation.state.params.index + 1
    console.log(this.state.pathVoice2);
    return (
      <LinearGradient
        colors={['#4c669f', '#3b5998', '#192f6a']}
        style={styles.linearGradient}>
        <StatusBar translucent backgroundColor='transparent' />
        <ScrollView
          contentContainerStyle={{flexGrow: 1}}
          showsVerticalScrollIndicator={false}>
          {this.state.word && (
            <View
              style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
              <TTSBox inputText={this.state.word.englishWord} />
              <View style={{flexDirection: 'row'}}>
                <Text style={styles.TitleText}>
                  {this.state.word.englishWord}
                </Text>
                {index < size && (
                  <TouchableOpacity
                    style={styles.NextBtn}
                    onPress={() => {
                      if (index < size) {
                        ;(this.props.navigation.state.params.index = index),
                          this.props.navigation.replace(
                            'card',
                            this.props.navigation.state.params,
                          )
                      }
                    }}>
                    {/* <Text style={styles.textBtn}>>|</Text> */}
                    <Icon name='stepforward' type='AntDesign' />
                  </TouchableOpacity>
                )}
              </View>
              {this.state.pathVoice1 !== '' && (
                <VoicePlayer inputpath={this.state.pathVoice1} />
              )}
              <Text style={styles.meaningText} key={index}>
                {this.state.word.meaning}
              </Text>
              <TTSBox inputText={this.state.word.example} />
              <Text style={styles.exampleText}>{this.state.word.example}</Text>
              {this.state.pathVoice2 !== '' && (
                <VoicePlayer inputpath={this.state.pathVoice2} />
              )}
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
          )}
        </ScrollView>
      </LinearGradient>
    )
  }
  start () {
    let path =
      this.props.navigation.state.params.currentFile.path +
      '/' +
      this.state.word.voiceUri
    Sound.setCategory('Playback')
    let whoosh = new Sound(path, Sound.MAIN_BUNDLE, error => {
      if (error) {
        console.log('failed to load the sound', error)
        return
      }
      whoosh.setSpeed(this.state.playerSpeed)
      whoosh.play(success => {
        if (success) {
          console.log('successfully finished playing')
        } else {
          console.log('playback failed due to audio decoding errors')
        }
      })
    })
    whoosh.setVolume(1.5)
    whoosh.setPan(1)
  }
  stop () {
    this.player.pause()
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
  NextBtn: {
    backgroundColor: 'transparent',
    width: 40,
    height: 40,
    borderRadius: 20,
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
})
