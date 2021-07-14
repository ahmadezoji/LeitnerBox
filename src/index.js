import React from 'react'
import {createAppContainer, createSwitchNavigator} from 'react-navigation'
import {createMaterialBottomTabNavigator} from 'react-navigation-material-bottom-tabs'
import {createStackNavigator, HeaderTitle} from 'react-navigation-stack'
import Learn from './components/Learn'
import Profile from './components/Profile'
import Review from './components/Review'
import Splash from './components/Spalsh'
import {Colors} from './components/Colors'
import {Root, Icon} from 'native-base'
import {TouchableOpacity, View} from 'react-native'
import Words from './components/Words'
import Card from './components/Card'
// --------------------------------------------

const ReviewStack = createStackNavigator(
  {
    review: Review,
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
    learn: Learn,
    words: Words,
    Card: Card,
  },
  {
    defaultNavigationOptions: ({navigationData}) => ({
      headerShown: true,
      headerTitleStyle: {fontFamily: 'IRANSansMobile_Bold'},
      headerTitle: 'آموزش',
      headerRight: () => (
        <View style={{flexDirection:'row',marginRight:10}}>
          <TouchableOpacity onPress={() => console.log(navigationData)}>
            <Icon
              name='add-outline'
              type='Ionicons'
              style={{color: 'black', fontSize: 30}}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => console.log(navigationData)}>
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
        inactiveColor: Colors.icons,
        barStyle: {backgroundColor: Colors.background},
      },
    },
    REVIEW: {
      screen: ReviewStack,
      navigationOptions: {
        tabBarLabel: 'مرور لغات',
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
        inactiveColor: Colors.icons,
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
        inactiveColor: Colors.icons,
        barStyle: {backgroundColor: Colors.background},
      },
    },
  },
  {
    initialRouteName: 'LEARN',
    activeColor: 'black',
    inactiveColor: 'red',
    barStyle: {backgroundColor: '#1B0A34'},
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
