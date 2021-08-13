import React from 'react'
import {createAppContainer, createSwitchNavigator} from 'react-navigation'
import {createMaterialBottomTabNavigator} from 'react-navigation-material-bottom-tabs'
import {
  createStackNavigator,
  HeaderTitle,
  TransitionSpecs,
  HeaderStyleInterpolators,
} from 'react-navigation-stack'
import Learn, {Lessons, SubCategories} from './components/Learn'
import Profile from './components/Profile'
import Review, {ReviewLessons, ReviewSubCategories} from './components/Review'
import Splash from './components/Spalsh'
import {Colors} from './components/Colors'
import {Root, Icon} from 'native-base'
import {Alert, Text, TouchableOpacity, View} from 'react-native'
import Words from './components/Words'
import Card from './components/Card'
import {
  deletFile,
  extractSubCategory,
  getFileContent,
  getRootFolders,
  shareToFiles,
} from './components/FileManger'
import ReviewCard, {MyTimer} from './components/ReviewCard'
import ReviewWords, {getReviewWords} from './components/ReviewWords'
import {writeToFile} from './components/FileManger'
import AsyncStorage from '@react-native-community/async-storage'
import {EditCard, editSubCategory} from './components/Edit'
import {AddCard, addCategory, addLesson, addSubCategory} from './components/Add'

// --------------------------------------------
const MyTransitionToDown = {
  gestureDirection: 'vertical',
  transitionSpec: {
    open: TransitionSpecs.TransitionIOSSpec,
    close: TransitionSpecs.TransitionIOSSpec,
  },
  headerStyleInterpolator: HeaderStyleInterpolators.forFade,
  cardStyleInterpolator: ({current, next, layouts}) => {
    return {
      cardStyle: {
        transform: [
          {
            translateY: current.progress.interpolate({
              inputRange: [0, 1],
              outputRange: [layouts.screen.height, 0],
            }),
          },
        ],
      },
      overlayStyle: {
        opacity: current.progress.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 0.5],
        }),
      },
    }
  },
}
const MyTransitionToLeft = {
  gestureDirection: 'horizontal',
  transitionSpec: {
    open: TransitionSpecs.TransitionIOSSpec,
    close: TransitionSpecs.TransitionIOSSpec,
  },
  headerStyleInterpolator: HeaderStyleInterpolators.forFade,

  cardStyleInterpolator: ({current, next, layouts}) => {
    return {
      cardStyle: {
        transform: [
          {
            translateX: current.progress.interpolate({
              inputRange: [0, 1],
              outputRange: [layouts.screen.width, 0],
            }),
          },
        ],
      },
      overlayStyle: {
        opacity: current.progress.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 0.5],
        }),
      },
    }
  },
}

const ReviewStack = createStackNavigator(
  {
    review: Review,
    reviewcard: {
      screen: ReviewCard,

      navigationOptions: ({navigation}) => ({
        headerShown: true,
        ...MyTransitionToLeft,
        headerTitleStyle: {
          fontFamily: 'IRANSansMobile_Bold',
          textAlign: 'center',
          textAlignVertical: 'center',
          fontWeight: 'bold',
        },
        headerTitle: '',
        headerRight: () =>
          navigation.state.params.timer && (
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  color: 'black',
                  fontSize: 15,
                  textAlign: 'center',
                }}>
                {navigation.state.params.timer}
              </Text>
              {navigation.state.params.index + 1 <
                Object.keys(navigation.state.params.indexs).length && (
                <TouchableOpacity
                  style={{
                    backgroundColor: 'transparent',
                    justifyContent: 'center',
                    margin: 5,
                  }}
                  onPress={() => {
                    if (
                      navigation.state.params.index + 1 <
                      Object.keys(navigation.state.params.words).length
                    ) {
                      ;(navigation.state.params.index =
                        navigation.state.params.indexs[
                          navigation.state.params.index + 1
                        ]),
                        navigation.replace(
                          'reviewcard',
                          navigation.state.params,
                        )
                    }
                  }}>
                  <Icon name='stepforward' type='AntDesign' />
                </TouchableOpacity>
              )}
            </View>
          ),
      }),
    },
    reviewwords: {
      screen: ReviewWords,
      navigationOptions: ({navigation}) => ({
        ...MyTransitionToLeft,
        headerShown: true,
        headerTitleStyle: {
          fontFamily: 'IRANSansMobile_Bold',
          textAlign: 'center',
          textAlignVertical: 'center',
        },
        headerTitle: navigation.state.params.currentFile.name.split('.')[0],
        headerRight: () => (
          <TouchableOpacity
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              margin: 2,
            }}
            onPress={() => {
              shareToFiles(
                navigation.state.params.currentFile.path,
                navigation.state.params.currentFile.name,
              )
            }}>
            <Icon
              name='export'
              type='MaterialCommunityIcons'
              style={{color: 'black', fontSize: 30}}
            />
          </TouchableOpacity>
        ),
      }),
    },
    reviewSubCategories: {
      screen: ReviewSubCategories,
      navigationOptions: ({navigation}) => ({
        ...MyTransitionToLeft,
        headerShown: true,
        headerTitleStyle: {
          fontFamily: 'IRANSansMobile_Bold',
          textAlign: 'center',
        },
        headerTitle: navigation.state.params.categoryName,
      }),
    },
    reviewLessons: {
      screen: ReviewLessons,
      navigationOptions: ({navigation}) => ({
        ...MyTransitionToLeft,
        headerShown: true,
        headerTitleStyle: {
          fontFamily: 'IRANSansMobile_Bold',
          textAlign: 'center',
        },
        headerTitle: navigation.state.params.currentFile.name.split('.')[0],
        headerRight: () => (
          <TouchableOpacity
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              margin: 2,
            }}
            onPress={() => {
              shareToFiles(
                navigation.state.params.currentFile.path,
                navigation.state.params.currentFile.name,
              )
              // console.log(navigation.state.params.currentFile.path,navigation.state.params.currentFile.name)
            }}>
            <Icon
              name='export'
              type='MaterialCommunityIcons'
              style={{color: 'black', fontSize: 30}}
            />
          </TouchableOpacity>
        ),
      }),
    },
  },
  {
    defaultNavigationOptions: {
      headerShown: true,
      headerTitleStyle: {fontFamily: 'IRANSansMobile_Bold'},
      headerTitle: 'مرور لغات',
    },
  },
  {
    initialRouteName: 'review',
  },
)
const LearnStack = createStackNavigator(
  {
    learn: {
      screen: Learn,
      navigationOptions: ({navigation}) => ({
        headerShown: true,
        headerTitleStyle: {
          fontFamily: 'IRANSansMobile_Bold',
        },
        headerTitle: 'آموزش',
        headerRight: () => (
          <View style={{flexDirection: 'row', marginRight: 2}}>
            <TouchableOpacity onPress={() => navigation.push('addCategory')}>
              <Icon
                name='add-outline'
                type='Ionicons'
                style={{color: 'black', fontSize: 30}}
              />
            </TouchableOpacity>
          </View>
        ),
      }),
    },
    card: {
      screen: Card,
      navigationOptions: ({navigation}) => ({
        headerShown: true,
        ...MyTransitionToLeft,
        headerTitleStyle: {
          fontFamily: 'IRANSansMobile_Bold',
          textAlign: 'center',
        },
        headerTitle: '',
        headerRight: () => (
          <View style={{flexDirection: 'row', marginRight: 10}}>
            <TouchableOpacity
              onPress={() =>
                navigation.push('addCard', navigation.state.params)
              }>
              <Icon
                name='add-outline'
                type='Ionicons'
                style={{color: 'black', fontSize: 30}}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                margin: 2,
              }}
              onPress={() =>
                navigation.push('editCard', navigation.state.params)
              }>
              <Icon
                name='edit'
                type='MaterialIcons'
                style={{color: 'black', fontSize: 25}}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                margin: 2,
              }}
              onPress={() => {
                // console.log(navigation.state.params.words[navigation.state.params.index]='');
                Alert.alert('حذف کارت', 'آیا با حذف کارت موافقید ؟', [
                  {
                    text: 'خیر',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                  },
                  {
                    text: 'بله',
                    onPress: () => {
                      delete navigation.state.params.words[
                        navigation.state.params.index
                      ]
                      let path =
                        navigation.state.params.categoryName +
                        '/' +
                        navigation.state.params.subCategoryName +
                        '/' +
                        navigation.state.params.currentFile.name
                      writeToFile(
                        path,
                        navigation.state.params.currentFile.name + '.json',
                        navigation.state.params.words,
                        result => {
                          if (result) navigation.goBack()
                        },
                      )
                    },
                  },
                ])
              }}>
              <Icon
                name='delete'
                type='AntDesign'
                style={{color: 'black', fontSize: 25}}
              />
            </TouchableOpacity>
            {navigation.state.params.index + 1 <
              Object.keys(navigation.state.params.words).length && (
              <TouchableOpacity
                style={{
                  backgroundColor: 'transparent',
                  justifyContent: 'center',
                }}
                onPress={() => {
                  if (
                    navigation.state.params.index + 1 <
                    Object.keys(navigation.state.params.words).length
                  ) {
                    ;(navigation.state.params.index =
                      navigation.state.params.index + 1),
                      navigation.replace('card', navigation.state.params)
                  }
                }}>
                <Icon name='stepforward' type='AntDesign' />
              </TouchableOpacity>
            )}
          </View>
        ),
      }),
    },
    editCard: {
      screen: EditCard,
      navigationOptions: ({navigation}) => ({
        headerShown: true,
        ...MyTransitionToLeft,
        headerTitleStyle: {
          fontFamily: 'IRANSansMobile_Bold',
          textAlign: 'center',
        },
        headerTitle: 'ویرایش کارت',
      }),
    },
    words: {
      screen: Words,
      navigationOptions: ({navigation}) => ({
        ...MyTransitionToLeft,
        headerShown: true,
        headerTitleStyle: {
          fontFamily: 'IRANSansMobile_Bold',
          textAlign: 'center',
        },
        headerTitle: navigation.state.params.currentFile.name.split('.')[0],
        headerRight: () => (
          <View style={{flexDirection: 'row', marginRight: 2}}>
            <TouchableOpacity
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                margin: 2,
              }}
              onPress={() =>
                navigation.push('addCard', navigation.state.params)
              }>
              <Icon
                name='add-outline'
                type='Ionicons'
                style={{
                  color: 'black',
                  fontSize: 30,
                  textAlign: 'center',
                  textAlignVertical: 'center',
                }}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                margin: 2,
              }}
              onPress={() => {
                Alert.alert('حذف درس', 'آیا با حذف درس موافقید ؟', [
                  {
                    text: 'خیر',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                  },
                  {
                    text: 'بله',
                    onPress: () =>
                      deletFile(
                        navigation.state.params.currentFile.path,
                        result => {
                          if (result) {
                            navigation.state.params.currentFile.name !== null &&
                              AsyncStorage.removeItem(
                                navigation.state.params.categoryName +
                                  '/' +
                                  navigation.state.params.currentFile.name,
                              )
                            navigation.goBack()
                          }
                        },
                      ),
                  },
                ])
              }}>
              <Icon
                name='delete'
                type='AntDesign'
                style={{
                  color: 'black',
                  fontSize: 25,
                  textAlignVertical: 'center',
                  textAlign: 'center',
                }}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                margin: 2,
              }}
              onPress={() => {
                shareToFiles(navigation.state.params)
              }}>
              <Icon
                name='share-alternative'
                type='Entypo'
                style={{
                  color: 'black',
                  fontSize: 25,
                  textAlignVertical: 'center',
                  textAlign: 'center',
                }}
              />
            </TouchableOpacity>
          </View>
        ),
      }),
    },
    subCategories: {
      screen: SubCategories,
      navigationOptions: ({navigation}) => ({
        ...MyTransitionToLeft,
        headerShown: true,
        headerTitleStyle: {
          fontFamily: 'IRANSansMobile_Bold',
          textAlign: 'center',
        },
        headerTitle: navigation.state.params.categoryName,
        headerRight: () => (
          <View style={{flexDirection: 'row', marginRight: 2}}>
            <TouchableOpacity
              onPress={() =>
                navigation.push('addSubCategory', {
                  categoryName: navigation.state.params.categoryName,
                })
              }>
              <Icon
                name='add-outline'
                type='Ionicons'
                style={{color: 'black', fontSize: 30}}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                // console.log(navigation.state.params.currentFile.path)
                extractSubCategory(
                  navigation.state.params.currentFile.path,
                  navigation.state.params.currentFile.name,
                )
              }>
              <Icon
                name='import'
                type='MaterialCommunityIcons'
                style={{color: 'black', fontSize: 30}}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                margin: 2,
              }}
              onPress={() => {
                Alert.alert('حذف گروه', 'آیا با حذف گروه موافقید ؟', [
                  {
                    text: 'خیر',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                  },
                  {
                    text: 'بله',
                    onPress: () =>
                      deletFile(
                        navigation.state.params.currentFile.path,
                        result => {
                          if (result) navigation.goBack()
                        },
                      ),
                  },
                ])
              }}>
              <Icon
                name='delete'
                type='AntDesign'
                style={{
                  color: 'black',
                  fontSize: 25,
                  textAlignVertical: 'center',
                  textAlign: 'center',
                }}
              />
            </TouchableOpacity>
          </View>
        ),
      }),
    },
    addCard: {
      screen: AddCard,
      navigationOptions: ({navigation}) => ({
        headerShown: true,
        ...MyTransitionToLeft,
        headerTitleStyle: {
          fontFamily: 'IRANSansMobile_Bold',
          textAlign: 'center',
        },
        headerTitle: 'اضافه کردن کارت',
      }),
    },
    addCategory: {
      screen: addCategory,
      navigationOptions: ({navigation}) => ({
        headerShown: true,
        headerTitleStyle: {fontFamily: 'IRANSansMobile_Bold'},
        headerTitle: 'اضافه کردن گروه',
        ...MyTransitionToLeft,
      }),
    },
    addSubCategory: {
      screen: addSubCategory,
      navigationOptions: ({navigation}) => ({
        headerShown: true,
        headerTitleStyle: {fontFamily: 'IRANSansMobile_Bold'},
        headerTitle: 'اضافه کردن زیر گروه',
        ...MyTransitionToLeft,
      }),
    },
    editSubCategory: {
      screen: editSubCategory,
      navigationOptions: ({navigation}) => ({
        headerShown: true,
        ...MyTransitionToLeft,
        headerTitleStyle: {
          fontFamily: 'IRANSansMobile_Bold',
          textAlign: 'center',
        },
        headerTitle: 'ویرایش زیر گروه',
      }),
    },
    lessons: {
      screen: Lessons,
      navigationOptions: ({navigation}) => ({
        ...MyTransitionToLeft,
        headerShown: true,
        headerTitleStyle: {
          fontFamily: 'IRANSansMobile_Bold',
          textAlign: 'center',
        },
        headerTitle: navigation.state.params.currentFile.name.split('.')[0],
        headerRight: () => (
          <View style={{flexDirection: 'row', marginRight: 2}}>
            <TouchableOpacity
              onPress={() =>
                navigation.push('addLesson', {
                  categoryName: navigation.state.params.categoryName,
                  subCategoryName: navigation.state.params.currentFile.name,
                })
              }>
              <Icon
                name='add-outline'
                type='Ionicons'
                style={{color: 'black', fontSize: 30}}
              />
            </TouchableOpacity>
            <TouchableOpacity
              TouchableOpacity
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                margin: 2,
              }}
              onPress={() =>
                navigation.push('editSubCategory', navigation.state.params)
              }>
              <Icon
                name='edit'
                type='MaterialIcons'
                style={{color: 'black', fontSize: 25}}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                // console.log(navigation.state.params.currentFile.path,navigation.state.params.currentFile.name)
                extractSubCategory(
                  navigation.state.params.currentFile.path,
                  navigation.state.params.currentFile.name,
                )
              }>
              <Icon
                name='import'
                type='MaterialCommunityIcons'
                style={{color: 'black', fontSize: 30}}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                margin: 2,
              }}
              onPress={() => {
                Alert.alert('حذف زیر گروه', 'آیا با حذف زیر گروه موافقید ؟', [
                  {
                    text: 'خیر',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                  },
                  {
                    text: 'بله',
                    onPress: () =>
                      deletFile(
                        navigation.state.params.currentFile.path,
                        result => {
                          if (result) navigation.goBack()
                        },
                      ),
                  },
                ])
              }}>
              <Icon
                name='delete'
                type='AntDesign'
                style={{
                  color: 'black',
                  fontSize: 25,
                  textAlignVertical: 'center',
                  textAlign: 'center',
                }}
              />
            </TouchableOpacity>
          </View>
        ),
      }),
    },
    addLesson: {
      screen: addLesson,
      navigationOptions: ({navigation}) => ({
        headerShown: true,
        headerTitleStyle: {fontFamily: 'IRANSansMobile_Bold'},
        headerTitle: 'اضافه کردن درس',
        ...MyTransitionToLeft,
      }),
    },
  },
  {
    initialRouteName: 'learn',
  },
)

const ProfileStack = createStackNavigator(
  {
    profile: Profile,
  },
  {
    defaultNavigationOptions: {
      headerShown: true,
      headerTitleStyle: {fontFamily: 'IRANSansMobile_Bold'},
      headerTitle: 'پروفایل',
    },
  },
  {
    initialRouteName: 'profile',
  },
)
let hasReviewWord = 0
const getBadge = () => {
  let reviewCnt = 0
  hasReviewWord = 0
  getRootFolders('/', category => {
    for (let i = 0; i < category.length; i++) {
      let pathCategory = '/' + category[i].name
      getRootFolders(pathCategory, subCategories => {
        for (let j = 0; j < subCategories.length; j++) {
          let pathSubCategory =
            '/' + category[i].name + '/' + subCategories[j].name
          getRootFolders(pathSubCategory, lessons => {
            for (let k = 0; k < lessons.length; k++) {
              let pathFile = lessons[k].path
              let FileName = lessons[k].name + '.json'

              getFileContent(pathFile, FileName, result => {
                let today = new Date()
                let j = 0
                for (
                  let index = 0;
                  index < JSON.parse(result).length;
                  index++
                ) {
                  let review = new Date(
                    JSON.parse(result)[index].nextReviewDate,
                  )

                  if (
                    review <= today &&
                    JSON.parse(result)[index].position > -1
                  ) {
                    hasReviewWord = hasReviewWord + 1
                  }
                }
              })
            }
          })
        }
      })
    }
  })
}
const timerTask = () => {
  getBadge()
  setTimeout(() => {
    timerTask()
  }, 1000)
}
timerTask()

const TabNavigator = createMaterialBottomTabNavigator(
  {
    LEARN: {
      screen: LearnStack,
      navigationOptions: {
        tabBarLabel: (
          <Text
            style={{
              fontFamily: 'IRANSansMobile',
              textAlign: 'center',
              fontSize: 12,
            }}>
            آموزش
          </Text>
        ),
        tabBarIcon: ({tintColor}) => (
          <Icon
            color={tintColor}
            style={{fontSize: 18}}
            name={'book-reader'}
            type={'FontAwesome5'}
          />
        ),
        activeColor: 'black',
        inactiveColor: 'red',
        barStyle: {backgroundColor: Colors.background},
      },
    },
    REVIEW: {
      screen: ReviewStack,
      navigationOptions: ({navigation}) => ({
        tabBarLabel: (
          <Text
            style={{
              fontFamily: 'IRANSansMobile',
              textAlign: 'center',
              fontSize: 12,
            }}>
            مرور
          </Text>
        ),
        tabBarBadge: hasReviewWord,
        tabBarIcon: ({tintColor}) => (
          <View>
            <Icon
              color={tintColor}
              style={{fontSize: 18}}
              name={'chrome-reader-mode'}
              type={'MaterialIcons'}
            />
          </View>
        ),
        activeColor: 'black',
        inactiveColor: 'red',
        barStyle: {backgroundColor: Colors.background},
      }),
    },
    PROFILE: {
      screen: ProfileStack,
      navigationOptions: {
        tabBarLabel: (
          <Text
            style={{
              fontFamily: 'IRANSansMobile',
              textAlign: 'center',
              fontSize: 12,
            }}>
            پروفایل
          </Text>
        ),
        tabBarIcon: ({tintColor}) => (
          <View>
            <Icon
              color={tintColor}
              style={{fontSize: 18}}
              type='FontAwesome5'
              name='user'
            />
          </View>
        ),
        activeColor: 'black',
        inactiveColor: 'red',
        barStyle: {backgroundColor: Colors.background},
      },
    },
  },
  {
    initialRouteName: 'LEARN',
    activeColor: 'black',
    inactiveColor: 'red',
    barStyle: {backgroundColor: 'blue'},
  },
)
const RootNavigator = createSwitchNavigator(
  {
    Splash: Splash,
    Main: TabNavigator,
  },
  {
    initialRouteName: 'Splash',
  },
)

const Main = createAppContainer(RootNavigator)
export default Main
