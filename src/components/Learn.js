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
import {
  getFileContent,
  getRootFiles,
  getRootFolders,
  readSettingJson,
} from './FileManger'
import moment from 'moment'
import Profile from './Profile'
import {ASTORAGE_TIME, ASTORAGE_UNIT} from './consts'
import { VoiceRecorderWithOptions } from './Voice'
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
    getRootFolders('/', data => {
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
        <FlatList
          virtical
          onRefresh={() => this._onRefresh()}
          refreshing={this.state.refreshing}
          pagingEnabled={true}
          data={this.state.categories}
          renderItem={this.renderCategories}
          keyExtractor={(item, index) => {
            return item.id
          }}
        />
      </LinearGradient>
    )
  }
  renderCategories = ({item}) => {
    return (
      <TouchableOpacity
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
  let categoryName = navigation.state.params.categoryName

  const _onRefresh = () => {
    setRefreshing(false)
    let path = '/' + categoryName
    getRootFolders(path, data => {
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
        onPress={() =>
          navigation.push('lessons', {
            currentFile: item,
            categoryName: categoryName,
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
  return (
    <LinearGradient
      colors={['#4c669f', '#3b5998', '#192f6a']}
      style={styles.linearGradient}>
      <StatusBar
        translucent
        backgroundColor='transparent'
        barStyle='dark-content'
      />

      <FlatList
        style={{flex: 1}}
        virtical
        onRefresh={() => _onRefresh()}
        refreshing={refreshing}
        pagingEnabled={true}
        data={subCategories}
        renderItem={renderSubCategories}
        keyExtractor={(item, index) => {
          return item.id
        }}
        ListFooterComponent={<View style={{height: 100}} />}
      />
    </LinearGradient>
  )
}

const Lessons = ({navigation}) => {
  let [refreshing, setRefreshing] = useState(false)
  let [lessons, setLessons] = useState([])
  let [settings, setSettings] = useState(null)
  let categoryName = navigation.state.params.categoryName
  let subCategoryName = navigation.state.params.currentFile.name

  const _onRefresh = () => {
    setRefreshing(false)
    let path = '/' + categoryName + '/' + subCategoryName
    getRootFolders(path, data => {
      setLessons(data)
      getRootFiles(path, data => {
        let array = data.filter(item =>
          item.name.includes(subCategoryName + '.json'),
        )
        let path = array[0].path
        readSettingJson(path, data => {
          setSettings(data)
          navigation.state.params.settings = data
        })
      })
      setRefreshing(true)
    })
  }
  useEffect(() => {
    _onRefresh()
    // console.log(navigation.state.params)
  })

  const renderLesson = ({item}) => {
    return (
      <TouchableOpacity
        onPress={() => {
          navigation.push('words', {
            currentFile: item,
            categoryName: categoryName,
            subCategoryName: subCategoryName,
            settings: settings,
          })
        }}
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

      <FlatList
        style={{flex: 1}}
        virtical
        onRefresh={() => _onRefresh()}
        refreshing={refreshing}
        pagingEnabled={true}
        data={lessons}
        renderItem={renderLesson}
        keyExtractor={(item, index) => {
          return item.id
        }}
        ListFooterComponent={<View style={{height: 100}} />}
      />
    </LinearGradient>
  )
}
export {SubCategories, Lessons}
