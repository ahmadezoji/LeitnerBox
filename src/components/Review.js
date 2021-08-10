import AsyncStorage from '@react-native-community/async-storage'
import React, {useState, useEffect} from 'react'
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
import {getFileContent, getRootFiles, getRootFolders, readSettingJson} from './FileManger'
export default class Review extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      show: true,
      categories: [],
      refreshing: false,
    }
  }
  async componentDidMount () {
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
        colors={['#e68d03', '#d7d0c4', '#a28450']}
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
          renderItem={this.renderCategory}
          keyExtractor={(item, index) => {
            return item.id
          }}
        />
      </LinearGradient>
    )
  }
  // this.props.navigation.push('reviewwords', {currentFile: item})
  renderCategory = ({item}) => {
    return (
      <TouchableOpacity
        onPress={() =>
          this.props.navigation.navigate('reviewSubCategories', {
            currentFile: item,
            categoryName: item.name.split('.')[0],
          })
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
function calcCountReview (item) {
  try {
    let path = item.path
    let name = item.name + '.json'
    getFileContent(path, name, result => {
      let array = JSON.parse(result)
      let i = 0
      for (let index = 0; index < array.length; index++) {
        let word = array[index]
        if (JSON.stringify(word) !== 'null' && JSON.stringify(word) !== null) {
          i = i + 1
        }
      }
      return i
    })
  } catch (e) {
    return 0
  }
}

// const RenderSubCategories = ({item, navigation}) => {
//   let [count, setCount] = useState('0')
//   let categoryName = navigation.state.params.categoryName

//   useEffect(() => {
//     let today = new Date()
//     let path = item.path
//     let name = item.name + '.json'
//     getFileContent(path, name, result => {
//       let array = JSON.parse(result)
//       let i = 0
//       for (let index = 0; index < array.length; index++) {
//         let word = array[index]
//         if (JSON.stringify(word) !== 'null' && JSON.stringify(word) !== null) {
//           if (
//             new Date(word.nextReviewDate) <= today &&
//             word.position >= 0 &&
//             word.position <= STEPS_COUNT
//           ) {
//             i = i + 1
//           }
//         }
//       }
//       setCount(`لغات قابل مرور : ${i}`)
//     })
//   })
//   return (
//     <TouchableOpacity
//       onPress={() =>
//         navigation.push('reviewwords', {
//           currentFile: item,
//           categoryName: categoryName,
//         })
//       }
//       style={{
//         backgroundColor: '#67b0e2',
//         justifyContent: 'center',
//         alignItems: 'center',
//         margin: 5,
//         width: Dimensions.get('window').width - 100,
//         height: 100,
//         borderRadius: 5,
//         shadowColor: '#000000',
//         shadowOffset: {width: 0, height: 2},
//         shadowOpacity: 0.5,
//         shadowRadius: 5,
//         elevation: 10,
//         flexDirection: 'column',
//       }}>
//       <Text style={{color: 'blue', fontFamily: 'IRANSansMobile_Bold'}}>
//         {item.name.split('.')[0]}
//       </Text>
//       {count !== null && (
//         <Text style={{color: 'black', fontFamily: 'IRANSansMobile'}}>
//           {count}
//         </Text>
//       )}
//     </TouchableOpacity>
//   )
// }
const ReviewSubCategories = ({navigation}) => {
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
  return (
    <LinearGradient
      colors={['#e68d03', '#d7d0c4', '#a28450']}
      style={styles.linearGradient}>
      <StatusBar
        translucent
        backgroundColor='transparent'
        barStyle='dark-content'
      />

      <FlatList
        virtical
        onRefresh={() => _onRefresh()}
        refreshing={refreshing}
        pagingEnabled={true}
        data={subCategories}
        renderItem={({item}) => (
          // <RenderSubCategories item={item} navigation={navigation} />
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('reviewLessons', {
                currentFile: item,
                categoryName: categoryName,
                subCategoryName: item.name.split('.')[0],
              })
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
        )}
        keyExtractor={(item, index) => {
          return item.id
        }}
      />
    </LinearGradient>
  )
}
const RenderLessons = ({item, navigation,settings}) => {
  let [count, setCount] = useState('0')
  let categoryName = navigation.state.params.categoryName
  let subCategoryName = navigation.state.params.subCategoryName

  useEffect(() => {
    let today = new Date()
    let path = item.path
    let name = item.name + '.json'
    getFileContent(path, name, result => {
      let array = JSON.parse(result)
      let i = 0
      for (let index = 0; index < array.length; index++) {
        let word = array[index]
        if (JSON.stringify(word) !== 'null' && JSON.stringify(word) !== null) {
          if (
            new Date(word.nextReviewDate) <= today &&
            word.position >= 0 &&
            word.position <= JSON.parse(settings).stages
          ) {
            i = i + 1
          }
        }
      }
      setCount(`لغات قابل مرور : ${i}`)
    })
  })
  return (
    <TouchableOpacity
      onPress={() =>
        navigation.push('reviewwords', {
          currentFile: item,
          categoryName: categoryName,
          subCategoryName : subCategoryName,
          settings: settings,
        })
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
        flexDirection: 'column',
      }}>
      <Text style={{color: 'blue', fontFamily: 'IRANSansMobile_Bold'}}>
        {item.name.split('.')[0]}
      </Text>
      {count !== null && (
        <Text style={{color: 'black', fontFamily: 'IRANSansMobile'}}>
          {count}
        </Text>
      )}
    </TouchableOpacity>
  )
}
const ReviewLessons = ({navigation}) => {
  let [refreshing, setRefreshing] = useState(false)
  let [lessons, setLessons] = useState([])
  let [settings, setSettings] = useState(null)
  let categoryName = navigation.state.params.categoryName
  let subCategoryName = navigation.state.params.currentFile.name

  const _onRefresh = () => {
    setRefreshing(false)
    let path = '/' + categoryName + '/' + subCategoryName
    // getRootFolders(path, data => {
    //   setLessons(data)
    //   setRefreshing(true)
    // })
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
  })
  return (
    <LinearGradient
      colors={['#e68d03', '#d7d0c4', '#a28450']}
      style={styles.linearGradient}>
      <StatusBar
        translucent
        backgroundColor='transparent'
        barStyle='dark-content'
      />

      <FlatList
        virtical
        onRefresh={() => _onRefresh()}
        refreshing={refreshing}
        pagingEnabled={true}
        data={lessons}
        renderItem={({item}) => (
          <RenderLessons item={item} navigation={navigation} settings={settings}/>
        )}
        keyExtractor={(item, index) => {
          return item.id
        }}
      />
    </LinearGradient>
  )
}

export {ReviewSubCategories, RenderLessons, ReviewLessons}
