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
import {getFileContent} from './FileManger'
import moment from 'moment'

export default class ReviewWords extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      words: [],
      refreshing: false,
    }
  }
  async componentDidMount () {
    this._onRefresh()
  }
  async _onRefresh () {
    this.setState({refreshing: true})
    let path = await this.props.navigation.state.params.currentFile.path
    let name =
      (await this.props.navigation.state.params.currentFile.name) + '.json'
    await getFileContent({path, name}, result => {
      let today = new Date()
      // console.log(today);
      let i = 0
      
      for (let index = 0; index < JSON.parse(result).length; index++) {
        let review = new Date(JSON.parse(result)[index].nextReviewDate)
        if (review <= today && JSON.parse(result)[index].position > -1) {
          const newToDoList = [...this.state.words, JSON.parse(result)[index]]
          this.setState({words: newToDoList})
          this.props.navigation.state.params.words = this.state.words
        }
      }
      this.setState({refreshing: false})
    })
  }
  render () {
    return (
      <LinearGradient
        colors={['#e68d03', '#d7d0c4', '#a28450']}
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
            numColumns={3}
            data={this.state.words}
            renderItem={this.renderWords}
            keyExtractor={({id}, index) => id}
          />
        </ScrollView>
      </LinearGradient>
    )
  }
  postCard(index) {
    this.props.navigation.state.params.index = index
    this.props.navigation.navigate(
      'reviewcard',
      this.props.navigation.state.params,
    )
  }
  renderWords = ({item, index}) => {
    return (
      <TouchableOpacity
        onPress={() => this.postCard(index)}
        style={{
          height: 100,
          width: 100,
          margin: 5,
          borderRadius: 20,
          shadowColor: '#000000',
          shadowOffset: {width: 0, height: 2},
          shadowOpacity: 0.5,
          shadowRadius: 3,
          elevation: 10,
          backgroundColor: '#67b0e2',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text style={{color: 'blue', fontFamily: 'IRANSansMobile'}}>
          {item.englishWord}
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
