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
} from 'react-native'
import LottieView from 'lottie-react-native'
import RNFetchBlob from 'rn-fetch-blob'
const {config, fs} = RNFetchBlob
export default class Card extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      word: [],
      meanings: [],
    }
  }
  async componentDidMount () {
    let word = await this.props.navigation.state.params
    this.setState({word: word, meanings: word.Meanings})
  }
  render () {
    return (
      <View
        style={{
          flex: 1,
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#f1c40f',
        }}>
        <StatusBar translucent backgroundColor='transparent' />
        <Text style={{color: 'black', fontSize: 30,textAlign:'center'}}>{this.state.word.EnglishWord}</Text>
        <Image
          // source={{uri: 'file:////storage/emulated/0/Pictures/Img.jpg'}}
          source={{uri:'http://dl.abr.co.ir/tscobox/media/Garfield/home.png'}}
          style={{width: 200, height: 100}}
        />
        <ScrollView contentContainerStyle={{flexGrow: 1}}>
          <FlatList
            virtical
            showsVerticalScrollIndicator={false}
            pagingEnabled={true}
            data={this.state.meanings}
            renderItem={({item}) => (
              <View
                style={{backgroundColor: '#d4e3e0', width: '90%', height: 100,borderRadius:20,margin:5,alignItems:'center',justifyContent:'center'}}>
                <Text style={{color: 'black', fontSize: 20,textAlign:'center'}}>{item}</Text>
              </View>
            )}
            keyExtractor={({id}, index) => id}
          />
        </ScrollView>
      </View>
    )
  }
}
