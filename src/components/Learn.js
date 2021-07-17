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
import LottieView from 'lottie-react-native'
import LinearGradient from 'react-native-linear-gradient'
import { getRootFiles } from './FileManger'
// const words = require('../assets/words.json')
export default class Learn extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      categories: [],
    }
  }
  componentDidMount () {
    getRootFiles((data) => {
      this.setState({categories:data})
    });
  }
  render () {
    return (
      <LinearGradient
        colors={['#4c669f', '#3b5998', '#192f6a']}
        style={styles.linearGradient}>
        <ScrollView contentContainerStyle={{flexGrow: 1}}>
          <FlatList
            virtical
            pagingEnabled={true}
            data={this.state.categories}
            renderItem={this.renderLesson}
            keyExtractor={({id}, index) => id}
          />
        </ScrollView>
      </LinearGradient>
    )
  }
  renderLesson = ({item}) => {
    return (
      <TouchableOpacity
        onPress={() => this.props.navigation.push('words', {item:item})}
        style={{
          backgroundColor: 'red',
          justifyContent: 'center',
          alignItems: 'center',
          margin: 5,
          width: Dimensions.get('window').width - 100,
          height: 100,
          borderRadius: 5,
          shadowColor: '#000000',
          shadowOffset: {width: 0, height: 2},
          shadowOpacity: 0.5,
          shadowRadius: 5,
          elevation: 10,
        }}>
        <Text style={{color: 'blue', fontFamily: 'IRANSansMobile_Bold'}}>
          {item.name.split('.')[0]}
        </Text>
      </TouchableOpacity>
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
})
