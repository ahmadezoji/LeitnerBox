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
export default class Words extends React.Component {
  constructor (props) {
    super(props)
    this.state = {words: []}
  }
  async componentDidMount () {
    let words = await this.props.navigation.state.params
    this.setState({words: words})
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
        <ScrollView contentContainerStyle={{flexGrow: 1}}>
          <FlatList
            virtical
            pagingEnabled={true}
            numColumns={3}
            data={this.state.words}
            renderItem={this.renderWords}
            keyExtractor={({id}, index) => id}
          />
        </ScrollView>
      </View>
    )
  }
  renderWords = ({item}) => {
    return (
      <TouchableOpacity
        onPress={() => this.props.navigation.navigate('Card',item)}
        style={{
          height: 100,
          width:100,
          margin: 5,
          borderRadius: 20,
          shadowColor: '#000000',
          shadowOffset: {width: 0, height: 2},
          shadowOpacity: 0.5,
          shadowRadius: 3,
          elevation: 10,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text style={{color: 'blue'}}>{item.EnglishWord}</Text>
      </TouchableOpacity>
    )
  }
}
