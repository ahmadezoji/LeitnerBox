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
import {getFileContent} from './FileManger'

export default class Words extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      words: [],
    }
  }
  async componentDidMount () {
    let path = await this.props.navigation.state.params.currentFile.path
    let name =
      (await this.props.navigation.state.params.currentFile.name) + '.json'


    await getFileContent({path, name}, result => {
      this.setState({
        words: JSON.parse(result),
      })
      this.props.navigation.state.params.words = this.state.words
      
    })
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
            numColumns={3}
            data={this.state.words}
            renderItem={this.renderWords}
            keyExtractor={({id}, index) => id}
          />
        </ScrollView>
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
          opacity : item.readDate !== 'null' ? 0.5 : 1
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
