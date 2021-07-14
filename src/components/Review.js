import AsyncStorage from '@react-native-community/async-storage';
import React from 'react';
import { StatusBar, Image, Dimensions, View, ActivityIndicator, Animated, Text, Easing } from 'react-native';
import LottieView from 'lottie-react-native';
export default class Review extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            show: true,
            top: new Animated.Value(0),
        };
    }
    componentDidMount() {
    }
    render() {
        return (
            <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center',justifyContent:'center', backgroundColor: 'white' }}>
                <StatusBar translucent backgroundColor="transparent" />
                <Text style={{fontFamily: 'IRANSansMobile',color:'black',fontSize:30}}>Review</Text>
            </View>
        )
    }
}
