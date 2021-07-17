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
import {Alert, TouchableOpacity, View} from 'react-native'
import Words from './components/Words'
import Card from './components/Card'
import AddCard, {
  addCard1,
  addCard2,
  addCard3,
  addCard4,
  addCategory,
} from './components/Add'
import {deletFile} from './components/FileManger'
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
    learn: {
      screen: Learn,
      navigationOptions: ({navigation}) => ({
        headerShown: true,
        headerTitleStyle: {fontFamily: 'IRANSansMobile_Bold'},
        headerTitle: 'آموزش',
        headerRight: () => (
          <View style={{flexDirection: 'row', marginRight: 10}}>
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
        headerTitleStyle: {fontFamily: 'IRANSansMobile_Bold'},
        headerTitle: 'آموزش',
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
    words: {
      screen: Words,
      navigationOptions: ({navigation}) => ({
        headerShown: true,
        headerTitleStyle: {fontFamily: 'IRANSansMobile_Bold'},
        headerTitle: navigation.state.params.item.name.split('.')[0],
        headerRight: () => (
          <View style={{flexDirection: 'row', marginRight: 10}}>
            <TouchableOpacity
              onPress={() =>
                navigation.push('addCard', {struct: navigation.state.params})
              }>
              <Icon
                name='add-outline'
                type='Ionicons'
                style={{color: 'black', fontSize: 30}}
              />
            </TouchableOpacity>
            <TouchableOpacity
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
                      deletFile(navigation.state.params.item.path, result => {
                        if (result) navigation.navigate('learn');
                      }),
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
  },
  {
    initialRouteName: 'learn',
  },
)
const AddCategoryStack = createStackNavigator(
  {
    addCategory: addCategory,
  },
  {
    defaultNavigationOptions: {
      headerShown: true,
      headerTitleStyle: {fontFamily: 'IRANSansMobile_Bold'},
      headerTitle: 'اضافه کردن گروه',
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
        inactiveColor: Colors.icons,
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
    barStyle: {backgroundColor: '#1B0A34', fontFamily: 'IRANSansMobile'},
  },
)
const RootNavigator = createSwitchNavigator(
  {
    Splash: Splash,
    Main: TabNavigator,
    AddCard: AddCardStack,
    AddCategory: AddCategoryStack,
  },
  {
    initialRouteName: 'Splash',
  },
)

const Main = createAppContainer(RootNavigator)
export default Main
