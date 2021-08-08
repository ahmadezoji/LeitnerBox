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

const appendText = array => {
  let text = ''
  for (let i = 0; i < array.length; i++) {
    if (i !== array.length - 1) text = text + array[i] + ','
    else text = text + array[i]
  }
  return text
}
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
    Tts.setDefaultLanguage('fr');
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
      })
  }
  async componentDidMount () {
    let words = await this.props.navigation.state.params.words
    let index = await this.props.navigation.state.params.index

    await this.setState({word: words[index], loaded: true})

    console.log(this.state.word);

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
      this.props.navigation.state.params.subCategoryName +
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
    let path = this.props.navigation.state.params.currentFile.path
    return (
      <LinearGradient
        colors={['#4c669f', '#3b5998', '#192f6a']}
        style={styles.linearGradient}>
        <StatusBar translucent backgroundColor='transparent' />
        <ScrollView
          contentContainerStyle={{flexGrow: 1}}
          showsVerticalScrollIndicator={false}>
          {this.state.word && (
            <View style={styles.container}>
              <Text style={styles.TitleText}>
                {this.state.word.englishWord}
              </Text>
              <TTSBox inputText={this.state.word.englishWord} />
              <VoicePlayer inputpath={path + '/' + this.state.word.voiceUri1} />

              <Text style={styles.meaningText}>{this.state.word.meaning}</Text>
              <TTSBox inputText={this.state.word.meaning} />
              <VoicePlayer inputpath={path + '/' + this.state.word.voiceUri2} />

              <Text style={styles.exampleText}>{this.state.word.example}</Text>
              <TTSBox inputText={this.state.word.example} />
              <VoicePlayer inputpath={path + '/' + this.state.word.voiceUri3} />

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
              <Text style={styles.reviewDate}>
                {this.state.word.nextReviewDate}
              </Text>
              <Text style={styles.position}>{this.state.word.position}</Text>
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
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 50,
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
  reviewDate: {
    color: 'green',
    fontFamily: 'IRANSansMobile',
    fontSize: 12,
  },
  position: {
    color: 'green',
    fontFamily: 'IRANSansMobile',
    fontSize: 12,
  },
})

export {TTSBox}
