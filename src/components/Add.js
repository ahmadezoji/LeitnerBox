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
import RNFetchBlob from 'rn-fetch-blob'
const {config, fs} = RNFetchBlob
import LinearGradient from 'react-native-linear-gradient'
import {Icon} from 'native-base'
import ImagePicker from 'react-native-image-picker'
import {picker} from './ImagePicker'
import SoundRecorder from 'react-native-sound-recorder'
import {appendToFile, getFileContent, writeToFile} from './FileManger'

const addCategory = ({navigation}) => {
  const [name, setName] = useState('')

  const save = () => {
    var obj = []
    writeToFile(name + '.json', obj, result => {
      if (result) navigation.navigate('learn')
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
  const [meaning, setMeaning] = useState('')
  return (
    <LinearGradient
      colors={['#4c669f', '#3b5998', '#192f6a']}
      style={styles.linearGradient}>
      <Text style={styles.TitleText}>{navigation.state.params.word}</Text>
      <TextInput
        style={styles.InputText}
        placeholder='معنی را وارد کنید '
        onChangeText={text => setMeaning(text)}
        defaultValue={meaning}
      />
      <TouchableOpacity
        style={styles.NextBtn}
        onPress={() =>
          navigation.push('addCard2', {
            word: navigation.state.params.word,
            meaning: meaning,
            struct: navigation.state.params.struct,
          })
        }>
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
      <Text style={styles.TitleText}>{navigation.state.params.meaning}</Text>
      <TextInput
        style={styles.InputText}
        placeholder='مثال وارد کنید'
        onChangeText={text => setExample(text)}
        defaultValue={example}
      />
      <TouchableOpacity
        style={styles.NextBtn}
        onPress={() =>
          navigation.push('addCard3', {
            word: navigation.state.params.word,
            meaning: navigation.state.params.meaning,
            example: example,
            struct: navigation.state.params.struct,
          })
        }>
        <Text style={styles.textBtn}>بعدی</Text>
      </TouchableOpacity>
    </LinearGradient>
  )
}
const addCard3 = ({navigation}) => {
  const [imgUri, setImgUri] = useState('')
  const chooseFile = () => {
    picker((source, data) => {
      setImgUri(source.uri)
      console.log(source.uri)
    })
  }
  return (
    <LinearGradient
      colors={['#4c669f', '#3b5998', '#192f6a']}
      style={styles.linearGradient}>
      <Text style={styles.TitleText}>{navigation.state.params.word}</Text>
      <Text style={styles.TitleText}>{navigation.state.params.meaning}</Text>
      <Text style={styles.TitleText}>{navigation.state.params.example}</Text>
      {/* <Image source={{uri : imgUri}} style={{width:100,height:100}}/> */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <TextInput
          style={styles.InputText}
          placeholder='مثال وارد کنید'
          onChangeText={text => setImgUri(text)}
          value={imgUri}
          // defaultValue={imgUri}
        />
        <TouchableOpacity style={styles.browsBtn} onPress={() => chooseFile()}>
          <Text style={styles.textBtn}>گالری</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={styles.NextBtn}
        onPress={() =>
          navigation.push('addCard4', {
            word: navigation.state.params.word,
            meaning: navigation.state.params.meaning,
            example: navigation.state.params.example,
            imgUri: imgUri,
            struct: navigation.state.params.struct,
          })
        }>
        <Text style={styles.textBtn}>بعدی</Text>
      </TouchableOpacity>
    </LinearGradient>
  )
}
const addCard4 = ({navigation}) => {
  const [voiceUri, setVoiceUri] = useState('')
  const [startRecord, setStartRecord] = useState(false)
  let iconName = startRecord ? 'stop' : 'play'
  const saveCard = () => {
    let word = {
      EnglishWord: navigation.state.params.word,
      Meanings: [navigation.state.params.meaning],
      Example: navigation.state.params.example,
      imgUri: navigation.state.params.imgUri,
      voiceUri: voiceUri,
    }

    // console.log(navigation.state.params.struct.jsonFile,word);
    const newToDoList = [...navigation.state.params.struct.jsonFile, word]
    writeToFile(navigation.state.params.struct.item.name, newToDoList, result => {
      if (result) navigation.navigate('learn')
    })
    // appendToFile(navigation.state.params.struct.item.name, word, result => {
    //   if(result)
    //     navigation.navigate('learn')
    // })
  }
  const start = () => {
    SoundRecorder.start(SoundRecorder.PATH_CACHE + '/test.mp4').then(
      function () {
        setStartRecord(true)
        console.log('started recording')
      },
    )
  }
  const stop = () => {
    SoundRecorder.stop().then(function (result) {
      setStartRecord(false)
      console.log('stopped recording, audio file saved at: ' + result.path)
    })
  }
  return (
    <LinearGradient
      colors={['#4c669f', '#3b5998', '#192f6a']}
      style={styles.linearGradient}>
      <Text style={styles.TitleText}>{navigation.state.params.word}</Text>
      <Text style={styles.TitleText}>{navigation.state.params.meaning}</Text>
      <Text style={styles.TitleText}>{navigation.state.params.example}</Text>
      <Text style={styles.TitleText}>{navigation.state.params.imgUri}</Text>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <TouchableOpacity
          style={styles.RecorderBtn}
          onPress={() => (startRecord ? stop() : start())}>
          <Icon name={iconName} style={{color: 'blue', margin: 5}} />
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={styles.NextBtn}
        onPress={
          () => saveCard()
          // navigation.push('addCard3', {
          //   word: navigation.state.params.word,
          //   meaning: navigation.state.params.meaning,
          //   example: navigation.state.params.example,
          //   imgUri: navigation.state.params.imgUri,
          //   voiceUri: voiceUri,
          // })
        }>
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
    // let {item,jsonFile} = await this.props.navigation.state.params;
  }
  render () {
    return (
      <LinearGradient
        colors={['#4c669f', '#3b5998', '#192f6a']}
        style={styles.linearGradient}>
        <TextInput
          style={styles.InputText}
          placeholder='واژه را وارد کنید'
          onChangeText={text => this.setState({text: text})}
          defaultValue={this.state.text}
        />
        <TouchableOpacity
          style={styles.NextBtn}
          onPress={() =>
            this.props.navigation.push('addCard1', {
              word: this.state.text,
              struct: this.props.navigation.state.params.struct,
            })
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
    fontSize: 30,
    textAlign: 'center',
    fontFamily: 'IRANSansMobile_Bold',
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
  },
})
