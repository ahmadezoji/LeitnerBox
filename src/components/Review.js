import AsyncStorage from '@react-native-community/async-storage'
import React from 'react'
import {
  StatusBar,
  Image,
  Dimensions,
  View,
  ActivityIndicator,
  Animated,
  Text,
  Easing,
  StyleSheet,
  ScrollView,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native'
import LottieView from 'lottie-react-native'
import LinearGradient from 'react-native-linear-gradient'
import {getRootFiles} from './FileManger'
export default class Review extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      show: true,
      categories: [],
      refreshing:false
    }
  }
  async componentDidMount () {
    getRootFiles(data => {
      this.setState({categories: data})
    })
  }
  _onRefresh = () => {
    this.setState({refreshing: true});
    getRootFiles(data => {
      this.setState({categories: data,refreshing: false})
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
        onPress={() =>
          this.props.navigation.push('reviewwords', {currentFile: item})
        }
        style={{
          backgroundColor: '#67b0e2',
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

const styles = StyleSheet.create({
  linearGradient: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
})
