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
import {getFileContent, getRootFiles} from './FileManger'
import moment from 'moment'
import {STEPS_COUNT} from './consts'
const getReviewWords = async callback => {
  let pathCategory = ''
  let reviewCnt = 0
  getRootFiles('/', category => {
    for (let i = 0; i < category.length; i++) {
      pathCategory = '/' + category[i].name
      getRootFiles(pathCategory, subCategories => {
        for (let j = 0; j < subCategories.length; j++) {
          let pathFile = subCategories[j].path
          let FileName = subCategories[j].name + '.json'

          getFileContent(pathFile, FileName, result => {
            let today = new Date()
            let j = 0
            for (let index = 0; index < JSON.parse(result).length; index++) {
              let review = new Date(JSON.parse(result)[index].nextReviewDate)
              if (review <= today && JSON.parse(result)[index].position > -1) {
                reviewCnt = reviewCnt + 1
                callback(reviewCnt)
              }
            }
          })
        }
      })
    }
  })
}

export default class ReviewWords extends React.Component {
  constructor (props) {
    super(props)
    this.today = new Date()
    this.state = {
      words: [],
      refreshing: false,
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
  }
  async _onRefresh () {
    this.today = new Date()
    this.setState({words: []})
    this.setState({refreshing: true})
    let path = await this.props.navigation.state.params.currentFile.path
    let name =
      (await this.props.navigation.state.params.currentFile.name) + '.json'
    await getFileContent(path, name, result => {
      let today = new Date()
      let i = 0
      let j = 0
      let array = JSON.parse(result)
      let indexs = []
      for (let index = 0; index < array.length; index++) {
        let word = array[index]
        if (JSON.stringify(word) !== 'null' && JSON.stringify(word) !== null) {
          // console.log(word.nextReviewDate,today);
          if (
            new Date(word.nextReviewDate) <= this.today &&
            word.position >= 0 &&
            word.position <= STEPS_COUNT
          ) {
            indexs[i] = index
            i = i + 1
          }
          this.state.words[j] = word
          j = j + 1
        }
      }

      this.props.navigation.state.params.words = this.state.words
      this.props.navigation.state.params.indexs = indexs

      this.setState({refreshing: false})
    })
  }
  render () {
    return (
      <LinearGradient
        colors={['#e68d03', '#d7d0c4', '#a28450']}
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
  async postCard (index) {
    await (this.props.navigation.state.params.index = index)
    this.props.navigation.navigate(
      'reviewcard',
      this.props.navigation.state.params,
    )
  }
  renderWords = ({item, index}) => {
    if (
      new Date(item.nextReviewDate) <= this.today &&
      item.position >= 0 &&
      item.position <= STEPS_COUNT
    ) {
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
            {item.englishWord.length > 30
              ? item.englishWord.substring(0, 10) + '...'
              : item.englishWord}
          </Text>
        </TouchableOpacity>
      )
    } else {
      return
    }
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

export {getReviewWords}
