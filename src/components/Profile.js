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
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Picker,
  Alert,
} from 'react-native'
import LottieView from 'lottie-react-native'
import {ASTORAGE_LANGUAGE, ASTORAGE_TIME, ASTORAGE_UNIT, DURATIONS} from './consts'


export default class Profile extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      show: true,
      
    }
  }
  async componentDidMount () {
  }
  async save () {
  }

  render () {
    return (
      <View
        style={{
          flex: 1,
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'white',
        }}>
        <StatusBar translucent backgroundColor='transparent' />
   
       
        <TouchableOpacity style={styles.NextBtn} onPress={() => this.save()}>
          <Text style={styles.textBtn}>ذخیره</Text>
        </TouchableOpacity>
      </View>
    )
  }
}
const styles = StyleSheet.create({
  InputText: {
    width: 150,
    height: 50,
    borderWidth: 1,
    borderColor: 'red',
    borderRadius: 5,
    margin: 10,
    textAlign: 'center',
  },
  NextBtn: {
    backgroundColor: 'red',
    width: 100,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
 
})
