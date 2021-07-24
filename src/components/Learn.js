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
  RefreshControl,
} from 'react-native'
import LottieView from 'lottie-react-native'
import LinearGradient from 'react-native-linear-gradient'
import {getRootFiles} from './FileManger'
import moment from 'moment'
// const words = require('../assets/words.json')
export default class Learn extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      categories: [],
      refreshing:false
    }
  }
  onFocusFunction = () => {
    this._onRefresh();
  }
  async componentDidMount () {
    this.focusListener = this.props.navigation.addListener('didFocus', () => {
      this.onFocusFunction()
    })
    getRootFiles(data => {
      this.setState({categories: data})
    })
  }
  _onRefresh = () => {
    this.setState({refreshing: true});
    getRootFiles(data => {
      // console.log(data);
      this.setState({categories: data,refreshing: false})
    })
  }
  render () {
    return (
      <LinearGradient
        colors={['#4c669f', '#3b5998', '#192f6a']}
        style={styles.linearGradient}>
        <ScrollView
          contentContainerStyle={{flexGrow: 1}}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh}
            />
          }>
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
        onPress={() => this.props.navigation.push('words', {currentFile: item})}
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
