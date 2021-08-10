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
  PermissionsAndroid,
} from 'react-native'
import LottieView from 'lottie-react-native'
import LinearGradient from 'react-native-linear-gradient'
import {getFileContent} from './FileManger'

export default class Words extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      refreshing: false,
      words: [],
    }
  }

  onFocusFunction = () => {
    this._onRefresh()
  }
  async componentDidMount () {
    this.focusListener = this.props.navigation.addListener('willFocus', () => {
      this.onFocusFunction()
    })
    // this._onRefresh()
    console.log(this.props.navigation.state.params);
  }
  async _onRefresh () {
    let path = await this.props.navigation.state.params.currentFile.path
    let name =
      (await this.props.navigation.state.params.currentFile.name) + '.json'

    this.setState({refreshing: true})
    await getFileContent(path, name, result => {
      this.setState({words: []})
      let j = 0
      let array = JSON.parse(result)
      for (let i = 0; i < array.length; i++) {
        if (
          JSON.stringify(array[i]) !== 'null' &&
          JSON.stringify(array[i]) !== null
        ) {
          //seperate null object(deleted) words
          this.state.words[j] = array[i]
          j = j + 1
        }
      }

      // this.setState({
      //   words: JSON.parse(result),
      // })
      // console.log('words : '+this.props.navigation.state.params.words);
      this.props.navigation.state.params.words = this.state.words
      this.setState({refreshing: false})
    })
  }
  render () {
    return (
      <LinearGradient
        colors={['#4c669f', '#3b5998', '#192f6a']}
        style={styles.linearGradient}>
        <FlatList
          virtical
          onRefresh={() => this._onRefresh()}
          refreshing={this.state.refreshing}
          pagingEnabled={true}
          numColumns={3}
          data={this.state.words}
          renderItem={this.renderWords}
          keyExtractor={(item, index) => {
            return item.id
          }}
        />
      </LinearGradient>
    )
  }
  renderWords = ({item, index}) => {
    return (
      <TouchableOpacity
        onPress={() => (
          (this.props.navigation.state.params.index = index),
          this.props.navigation.navigate(
            'card',
            this.props.navigation.state.params,
          )
        )}
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
          backgroundColor: 'red',
          justifyContent: 'center',
          alignItems: 'center',
          opacity: item.readDate !== 'null' ? 0.5 : 1,
        }}>
        <Text style={{color: 'blue', fontFamily: 'IRANSansMobile'}}>
          {item.englishWord.length > 30
            ? item.englishWord.substring(0, 10) + '...'
            : item.englishWord}
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
