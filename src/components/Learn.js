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
const words = require('../assets/words.json')
export default class Learn extends React.Component {
  constructor (props) {
    super(props)
    this.state = {}
  }
  componentDidMount () {}
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
        <ScrollView contentContainerStyle={{flexGrow: 1}}>
          <FlatList
            virtical
            pagingEnabled={true}
            data={words}
            renderItem={this.renderLesson}
            keyExtractor={({id}, index) => id}
          />
        </ScrollView>
      </View>
    )
  }
  renderLesson = ({item}) => {
    return (
      <TouchableOpacity
        onPress={() => this.props.navigation.push('words', item.Words)}
        style={{
          height: 100,
          width: Dimensions.get('window').width - 10,
          margin: 5,
          height: 200,
          borderRadius: 12,
          shadowColor: '#000000',
          shadowOffset: {width: 0, height: 2},
          shadowOpacity: 0.5,
          shadowRadius: 3,
          elevation: 10,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text style={{color: 'blue'}}>{item.Group}</Text>
      </TouchableOpacity>
    )
  }
}
