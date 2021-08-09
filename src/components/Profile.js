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
      intervalTime: '10',
      unit: DURATIONS.second,
      
    }
  }
  async componentDidMount () {
    let interval = await AsyncStorage.getItem(ASTORAGE_TIME)
    let unit = await AsyncStorage.getItem(ASTORAGE_UNIT)

    if (interval !== null) this.setState({intervalTime: interval})
    if (unit !== null) this.setState({unit: unit})
  }
  async save () {
    await AsyncStorage.setItem(ASTORAGE_TIME, this.state.intervalTime)
    await AsyncStorage.setItem(ASTORAGE_UNIT, this.state.unit)

    alert('save settings')
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
        <View style={{flexDirection: 'row'}}>
          <Picker
            ref={val => (this.picker = val)}
            selectedValue={this.state.unit}
            style={{height: 50, width: 150, margin: 10}}
            onValueChange={(itemValue, itemIndex) =>
              this.setState({unit: itemValue})
            }>
            <Picker.Item label='ثانیه' value={DURATIONS.second} />
            <Picker.Item label='دقیقه' value={DURATIONS.minute} />
            <Picker.Item label='ساعت' value={DURATIONS.hour} />
            <Picker.Item label='روز' value={DURATIONS.day} />
          </Picker>
          <TextInput
            style={styles.InputText}
            placeholder='تعداد واحد زمانی'
            onChangeText={text => this.setState({intervalTime: text})}
            value={this.state.intervalTime}
            defaultValue={this.state.intervalTime}
          />
        </View>
       
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
