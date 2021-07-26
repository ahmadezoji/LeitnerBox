import AsyncStorage from '@react-native-community/async-storage'
import React, {useState, useEffect} from 'react'
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
      refreshing: false,
    }
  }
  onFocusFunction = () => {
    this._onRefresh()
  }
  async componentDidMount () {
    this.focusListener = this.props.navigation.addListener('didFocus', () => {
      this.onFocusFunction()
    })
    this._onRefresh()
  }
  _onRefresh = () => {
    this.setState({refreshing: true})
    getRootFiles('/', data => {
      this.setState({categories: data, refreshing: false})
    })
  }
  render () {
    return (
      <LinearGradient
        colors={['#4c669f', '#3b5998', '#192f6a']}
        style={styles.linearGradient}>
        <StatusBar
          translucent
          backgroundColor='transparent'
          barStyle='dark-content'
        />
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
            renderItem={this.renderCategories}
            keyExtractor={({id}, index) => id}
          />
        </ScrollView>
      </LinearGradient>
    )
  }
  renderCategories = ({item}) => {
    return (
      <TouchableOpacity
        // onPress={() => this.props.navigation.push('words', {currentFile: item})}
        onPress={() =>
          this.props.navigation.navigate('subCategories', {
            currentFile: item,
            categoryName: item.name.split('.')[0],
          })
        }
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

const styles = StyleSheet.create({
  linearGradient: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
})

const SubCategories = ({navigation}) => {
  let [refreshing, setRefreshing] = useState(false)
  let [subCategories, setSubCategories] = useState([])
  let categoryName = navigation.state.params.categoryName;

  const _onRefresh = () => {
    setRefreshing(false)
    let path = '/' + categoryName
    getRootFiles(path, data => {
      setSubCategories(data)
      setRefreshing(true)
    })
  }
  useEffect(() => {
    _onRefresh()
  })
  const renderSubCategories = ({item}) => {
    return (
      <TouchableOpacity
        onPress={() => navigation.push('words', {currentFile: item,categoryName:categoryName})}
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
  return (
    <LinearGradient
      colors={['#4c669f', '#3b5998', '#192f6a']}
      style={styles.linearGradient}>
      <StatusBar
        translucent
        backgroundColor='transparent'
        barStyle='dark-content'
      />
      <ScrollView
        contentContainerStyle={{flexGrow: 1}}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={_onRefresh} />
        }>
        <FlatList
          virtical
          pagingEnabled={true}
          data={subCategories}
          renderItem={renderSubCategories}
          keyExtractor={({id}, index) => id}
        />
      </ScrollView>
    </LinearGradient>
  )
}

export {SubCategories}
