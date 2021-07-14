import AsyncStorage from '@react-native-community/async-storage';
import React from 'react';
import { StatusBar, Image, Dimensions, View, ActivityIndicator, Animated, Text, Easing } from 'react-native';
import LottieView from 'lottie-react-native';
export default class Splash extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            show: true,
            top: new Animated.Value(0),
        };
    }
    async navigate() {
        this.props.navigation.navigate('Main');
        // let index = await AsyncStorage.getItem('wizard');
        // if (index == "3")
        //     this.props.navigation.navigate('Main');
        // else {
        //     if (index == "0" || index == null)
        //         this.props.navigation.navigate('wizard1');
        //     else if (index == "1")
        //         this.props.navigation.navigate('wizard2');
        //     else if (index == "2")
        //         this.props.navigation.navigate('wizard3');
        // }
    }
    componentDidMount() {
        setTimeout(() => {
            this.setState({ show: false })
            Animated.timing(this.state.top, {
                toValue: 35,
                duration: 1000,
                easing: Easing.linear,
                useNativeDriver: false,
            }).start(() => {
                this.navigate();
            })
        }, 500);
    }
    render() {
        const upDown = this.state.top.interpolate({
            inputRange: [0, 35],
            outputRange: [0, 1]
        });
        const AnimatedStyles = [
            {
                flexDirection: 'column',
                height: '10%',
                top: this.state.top,
                opacity: upDown

            }
        ];
        return (
            <View style={{ flex: 1, flexDirection: 'column-reverse', alignItems: 'center', backgroundColor: 'white' }}>
                <StatusBar translucent backgroundColor="transparent" />
                <LottieView    source={require('../assets/loading-word.json')} autoPlay loop />
                <Animated.View style={AnimatedStyles}>
                    <Text style={{ textAlign: 'center', color: 'black', fontSize: 25, fontWeight: 'bold' }}>Leitner Words</Text>
                    <Text style={{ textAlign: 'center', color: 'black', fontSize: 10 }}>v 1.0.0</Text>
                </Animated.View>
            </View>
        )
    }
}
