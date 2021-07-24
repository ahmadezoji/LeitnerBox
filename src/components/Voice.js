import {Icon} from 'native-base'
import React, {useState} from 'react'
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native'

const VoicePlayer = inputpath => {
  const Sound = require('react-native-sound')
  let whoosh = null
  let [path, setPath] = useState(inputpath)
  let [startPlay, setStartPlay] = useState(false)
  let [speed, setSpeed] = useState(0)
  //   console.log(path.inputpath)
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'row',
      backgroundColor: 'red',
      margin: 20,
      width: 200,
      height: 50,
      borderRadius: 10,
      justifyContent: 'center',
      alignItems: 'center',
    },
    playBtn: {
      backgroundColor: 'white',
      width: 35,
      height: 35,
      borderRadius: 25,
      justifyContent: 'center',
      alignItems: 'center',
      margin: 10,
    },
  })
  const start = () => {
    Sound.setCategory('Playback')
    setStartPlay(true)
    console.log(path)
    whoosh = new Sound(path.inputpath, Sound.MAIN_BUNDLE, error => {
      if (error) {
        console.log('failed to load the sound', error)
        return
      }
      whoosh.setSpeed(speed)
      whoosh.play(success => {
        if (success) {
          stop()
          console.log('successfully finished playing')
        } else {
          console.log('playback failed due to audio decoding errors')
        }
      })
    })
    whoosh.setVolume(2.5)
    whoosh.setPan(1)
  }
  const stop = () => {
    setStartPlay(false)
    console.log(whoosh);
    // whoosh.pause()
  }
  let iconName = startPlay ? 'pause' : 'play'
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.playBtn}
        onPress={() => (startPlay ? stop() : start())}>
        <Icon
          name={iconName}
          style={{textAlign: 'center', color: 'blue', margin: 5}}
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.playBtn}
        onPress={() => (speed <= 4 ? setSpeed(speed + 1) : setSpeed(0))}>
        <Text style={{color: 'black', fontSize: 15}}>x{speed}</Text>
      </TouchableOpacity>
    </View>
  )
}

export {VoicePlayer}
