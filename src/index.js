import React from 'react'
import {createAppContainer, createSwitchNavigator} from 'react-navigation'
import {createMaterialBottomTabNavigator} from 'react-navigation-material-bottom-tabs'
import {
  createStackNavigator,
  HeaderTitle,
  TransitionSpecs,
  HeaderStyleInterpolators,
} from 'react-navigation-stack'
import Learn, {SubCategories} from './components/Learn'
import Profile from './components/Profile'
import Review, {ReviewSubCategories} from './components/Review'
import Splash from './components/Spalsh'
import {Colors} from './components/Colors'
import {Root, Icon} from 'native-base'
import {Alert, Text, TouchableOpacity, View} from 'react-native'
import Words, {shareToFiles} from './components/Words'
import Card from './components/Card'
import AddCard, {
  addCard1,
  addCard2,
  addCard3,
  addCategory,
  addSubCategory,
} from './components/Add'
import {deletFile} from './components/FileManger'
import ReviewCard, {MyTimer} from './components/ReviewCard'
import ReviewWords, {getReviewWords} from './components/ReviewWords'
import {writeToFile} from './components/FileManger'
import AsyncStorage from '@react-native-community/async-storage'
import {EditCard} from './components/Edit'

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
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
              <Text
                style={{
                  color: 'black',
                  fontSize: 15,
                  textAlign: 'center',
                }}>
                {navigation.state.params.timer}
              </Text>
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
          <View style={{flexDirection: 'row', marginRight: 2}}>
            <TouchableOpacity
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                margin: 2,
              }}
              onPress={() => {
                shareToFiles(this.state.downloadUri)
              }}>
              <Icon
                name='share-alternative'
                type='Entypo'
                fontSize={25}
                style={{color: 'black', fontSize: 25}}
              />
            </TouchableOpacity>
          </View>
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
        headerRight: () => (
          <View style={{flexDirection: 'row', marginRight: 2}}>
            <TouchableOpacity
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                margin: 2,
              }}
              onPress={() => {
                shareToFiles(this.state.downloadUri)
              }}>
              <Icon
                name='share-alternative'
                type='Entypo'
                fontSize={25}
                style={{color: 'black', fontSize: 25}}
              />
            </TouchableOpacity>
          </View>
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
            <TouchableOpacity
              onPress={() => navigation.navigate('addCategory')}>
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
                        navigation.state.params.currentFile.name
                      writeToFile(
                        path,
                        navigation.state.params.currentFile.name + '.json',
                        navigation.state.params.words,
                        result => {
                          if (result) navigation.navigate('learn')
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
      }),
    },
    addCard1: {
      screen: addCard1,
      navigationOptions: ({navigation}) => ({
        headerShown: true,
        ...MyTransitionToLeft,
        headerTitleStyle: {
          fontFamily: 'IRANSansMobile_Bold',
          textAlign: 'center',
        },
      }),
    },
    addCard2: {
      screen: addCard2,
      navigationOptions: ({navigation}) => ({
        headerShown: true,
        ...MyTransitionToLeft,
        headerTitleStyle: {
          fontFamily: 'IRANSansMobile_Bold',
          textAlign: 'center',
        },
      }),
    },
    addCard3: {
      screen: addCard3,
      navigationOptions: ({navigation}) => ({
        headerShown: true,
        ...MyTransitionToLeft,
        headerTitleStyle: {
          fontFamily: 'IRANSansMobile_Bold',
          textAlign: 'center',
        },
      }),
    },
  },
  {
    initialRouteName: 'learn',
  },
)
const AddCategoryStack = createStackNavigator(
  {
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
  },
  // {
  //   defaultNavigationOptions: {
  //     headerShown: true,
  //     headerTitleStyle: {fontFamily: 'IRANSansMobile_Bold'},
  //     headerTitle: 'اضافه کردن گروه',
  //     ...MyTransitionToLeft,
  //   },
  // },
  {
    initialRouteName: 'addCategory',
  },
)

const AddCardStack = createStackNavigator(
  {
    addCard: AddCard,
    addCard1: addCard1,
    addCard2: addCard2,
    addCard3: addCard3,
  },
  {
    defaultNavigationOptions: {
      headerShown: true,
      ...MyTransitionToLeft,
      headerTitleStyle: {fontFamily: 'IRANSansMobile_Bold'},
      headerTitle: 'اضافه کردن کارت',
    },
  },
  {
    initialRouteName: 'addCard',
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
getReviewWords(result => (hasReviewWord = result))
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
    // AddCard: AddCardStack,
    AddCategoryStack: AddCategoryStack,
  },
  {
    initialRouteName: 'Splash',
  },
)

const Main = createAppContainer(RootNavigator)
export default Main
