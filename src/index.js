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
import Review, { ReviewSubCategories } from './components/Review'
import Splash from './components/Spalsh'
import {Colors} from './components/Colors'
import {Root, Icon} from 'native-base'
import {Alert, TouchableOpacity, View} from 'react-native'
import Words from './components/Words'
import Card from './components/Card'
import AddCard, {
  addCard1,
  addCard2,
  addCard3,
  addCard4,
  addCategory,
  addSubCategory,
} from './components/Add'
import {deletFile} from './components/FileManger'
import ReviewCard from './components/ReviewCard'
import ReviewWords from './components/ReviewWords'
import {writeFile} from 'react-native-fs'
import {writeToFile} from './components/FileManger'

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
        },
        headerTitle: '',
        headerRight: () => (
          <View style={{flexDirection: 'row', marginRight: 10}}>
            <TouchableOpacity onPress={() => navigation.push('addCard')}>
              <Icon
                name='add-outline'
                type='Ionicons'
                style={{color: 'black', fontSize: 30}}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => console.log(navigation)}>
              <Icon
                name='edit'
                type='MaterialIcons'
                style={{color: 'black', fontSize: 25}}
              />
            </TouchableOpacity>
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
              onPress={() =>
                navigation.navigate('addSubCategory', {
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
            <TouchableOpacity onPress={() => console.log(navigation)}>
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
                      console.log(navigation.state.params)
                      writeToFile(
                        navigation.state.params.currentFile.name,
                        navigation.state.params.currentFile.name,
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
                navigation.navigate('addSubCategory', {
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
  {
    defaultNavigationOptions: {
      headerShown: true,
      headerTitleStyle: {fontFamily: 'IRANSansMobile_Bold'},
      headerTitle: 'اضافه کردن گروه',
      ...MyTransitionToLeft,
    },
  },
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
    addCard4: addCard4,
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

const TabNavigator = createMaterialBottomTabNavigator(
  {
    LEARN: {
      screen: LearnStack,
      navigationOptions: {
        tabBarLabel: 'آموزش',
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
      navigationOptions: {
        tabBarLabel: 'مرور لغات',
        tabBarBadge: '2',
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
      },
    },
    PROFILE: {
      screen: ProfileStack,
      navigationOptions: {
        tabBarLabel: 'پروفایل',
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
    barStyle: {backgroundColor: 'blue', fontFamily: 'IRANSansMobile'},
  },
)
const RootNavigator = createSwitchNavigator(
  {
    Splash: Splash,
    Main: TabNavigator,
    AddCard: AddCardStack,
    AddCategoryStack: AddCategoryStack,
  },
  {
    initialRouteName: 'Splash',
  },
)

const Main = createAppContainer(RootNavigator)
export default Main
