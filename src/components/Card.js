import AsyncStorage from '@react-native-community/async-storage'
import React from 'react'
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
const Sound = require('react-native-sound')
import LottieView from 'lottie-react-native'
import LinearGradient from 'react-native-linear-gradient'
import {writeToFile} from './FileManger'
import moment from 'moment'
import {Icon} from 'native-base'
import {VoicePlayer} from './Voice'
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

    // console.log(this.props.navigation.state.params);

    this.setState({word: words[index], loaded: true})

    let interval = await AsyncStorage.getItem('intervalTime') //minute
    let unit = await AsyncStorage.getItem('intervalTimeUnit') //minute

    let today = new Date()
    this.props.navigation.state.params.words[index].position = 0
    let position = this.props.navigation.state.params.words[index].position
    this.props.navigation.state.params.words[index].readDate = today
    this.props.navigation.state.params.words[index].nextReviewDate = moment(
      today,
    ).add(Math.pow(2, position) * interval, unit)
    this.save()
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
    let pathVoice1 =
      this.props.navigation.state.params.currentFile.path +
      '/' +
      this.state.word.voiceUri1
    let pathVoice2 =
      this.props.navigation.state.params.currentFile.path +
      '/' +
      this.state.word.voiceUri2

    // console.log('ahmad:'+path);

    return (
      <LinearGradient
        colors={['#4c669f', '#3b5998', '#192f6a']}
        style={styles.linearGradient}>
        <StatusBar translucent backgroundColor='transparent' />
        <ScrollView
          contentContainerStyle={{flexGrow: 1}}
          showsVerticalScrollIndicator={false}>
          <View style={{justifyContent: 'center', alignItems: 'center'}}>
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
            <VoicePlayer inputpath={pathVoice1} />
            {/* {this.state.word.meaning.map((item, index) => ( */}
            <Text style={styles.meaningText} key={index}>
              {this.state.word.meaning}
            </Text>
            {/* ))} */}
            <Text style={styles.exampleText}>{this.state.word.example}</Text>
            <VoicePlayer inputpath={pathVoice2} />
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
