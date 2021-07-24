import AsyncStorage from '@react-native-community/async-storage'
import React, {useState} from 'react'
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
import LottieView from 'lottie-react-native'
import LinearGradient from 'react-native-linear-gradient'
import {writeToFile} from './FileManger'
import {coef, COEFS} from './consts'
import moment from 'moment'
import {Icon} from 'native-base'
import {VoicePlayer} from './Voice'

export default class ReviewCard extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      showOver: false,
      word: [],
      loaded: false,
    }
  }
  async componentDidMount () {
    let words = await this.props.navigation.state.params.words
    let index = await this.props.navigation.state.params.index
    this.setState({
      word: words[this.props.navigation.state.params.index],
      loaded: true,
    })
  }

  async save (coef) {
    let interval = await AsyncStorage.getItem('intervalTime') //minute
    let unit = await AsyncStorage.getItem('intervalTimeUnit') //minute
    let index = await this.props.navigation.state.params.index

    // console.log(moment(.diff(new Date()));

    if (coef == COEFS.superEasy) {
      this.props.navigation.state.params.words[index].position = -20 //learned this word
    } else if (coef == COEFS.veryEasy) {
      this.props.navigation.state.params.words[index].position =
        this.props.navigation.state.params.words[index].position + 2
    } else if (coef == COEFS.easy) {
      this.props.navigation.state.params.words[index].position =
        this.props.navigation.state.params.words[index].position + 1
    } else if (coef == COEFS.medium) {
      // this.props.navigation.state.params.words[index].nextReviewDate = moment(new Date()).add(coef * interval, unit)
    } else if (coef == COEFS.hard) {
      this.props.navigation.state.params.words[index].position =
        this.props.navigation.state.params.words[index].position - 1
    }

    let position = this.props.navigation.state.params.words[index].position
    console.log(position)

    this.props.navigation.state.params.words[index].nextReviewDate = moment(
      new Date(),
    ).add(Math.pow(2, position) * interval, unit)

    console.log(this.props.navigation.state.params.words[index].nextReviewDate);

    writeToFile(
     this.props.navigation.state.params.currentFile.name,
      this.props.navigation.state.params.currentFile.name,
      this.props.navigation.state.params.words,
      result => {
        console.log(result)
      },
    )
  }
  render () {
    let size = Object.keys(this.props.navigation.state.params.words).length
    let index = this.props.navigation.state.params.index + 1
    let fileName = this.state.word.voiceUri
    let path =
      this.props.navigation.state.params.currentFile.path + '/' + fileName
    return (
      <LinearGradient
        colors={['#e68d03', '#d7d0c4', '#a28450']}
        style={styles.linearGradient}>
        <StatusBar translucent backgroundColor='transparent' />
        <ScrollView contentContainerStyle={{flexGrow: 1}}>
          <View style={{justifyContent: 'center', alignItems: 'center'}}>
            <Text style={{color: 'black', fontSize: 30, textAlign: 'center'}}>
              {this.state.word.englishWord}
            </Text>
            <TouchableOpacity
              style={styles.BtnShowOver}
              onPress={() => this.setState({showOver: !this.state.showOver})}>
              <Text style={styles.textBtn}>نمایش پاسخ</Text>
            </TouchableOpacity>
            {this.state.showOver && (
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Image
                  // source={{uri: 'file:////storage/emulated/0/Pictures/Img.jpg'}}
                  source={{
                    uri:
                      'file://' +
                      this.props.navigation.state.params.currentFile.path +
                      '/' +
                      this.state.word.imgUri,
                  }}
                  style={{width: 200, height: 100}}
                />
                <Text
                  style={{
                    margin: 10,
                    color: 'black',
                    fontSize: 15,
                    textAlign: 'center',
                  }}>
                  {this.state.word.meaning}
                </Text>

                <Text
                  style={{color: 'black', fontSize: 15, textAlign: 'center'}}>
                  {this.state.word.example}
                </Text>
                {this.state.loaded && <VoicePlayer inputpath={path} />}
                {index < size && (
                  <TouchableOpacity
                    style={styles.NextBtn}
                    onPress={() => {
                      if (index < size) {
                        this.props.navigation.state.params.index = index
                        this.props.navigation.replace(
                          'reviewcard',
                          this.props.navigation.state.params,
                        )
                      }
                    }}>
                    <Text style={styles.textBtn}>بعدی</Text>
                  </TouchableOpacity>
                )}

                <View style={{flexDirection: 'column'}}>
                  <View style={{flexDirection: 'row'}}>
                    <TouchableOpacity
                      style={styles.Btn}
                      onPress={() => {
                        this.save(COEFS.superEasy)
                      }}>
                      <Text style={styles.textBtn}> بلدم بیخیال</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.Btn}
                      onPress={() => {
                        this.save(COEFS.veryEasy)
                      }}>
                      <Text style={styles.textBtn}>خیلی ساده</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.Btn}
                      onPress={() => {
                        this.save(COEFS.easy)
                      }}>
                      <Text style={styles.textBtn}> ساده</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={{flexDirection: 'row'}}>
                    <TouchableOpacity
                      style={styles.Btn}
                      onPress={() => {
                        this.save(COEFS.medium)
                      }}>
                      <Text style={styles.textBtn}>متوسط</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.Btn}
                      onPress={() => {
                        this.save(COEFS.hard)
                      }}>
                      <Text style={styles.textBtn}> سخت</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )}
          </View>
        </ScrollView>
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
  },
  Btn: {
    backgroundColor: 'red',
    width: 100,
    height: 40,
    borderRadius: 10,
    margin: 10,
  },
  BtnShowOver: {
    width: 100,
    height: 40,
    borderRadius: 10,
    backgroundColor: 'white',
    marginTop: 2,
    marginBottom: 50,
  },
})
