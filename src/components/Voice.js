import {Icon} from 'native-base'
import React, {useState, useEffect} from 'react'
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native'
import SoundRecorder from 'react-native-sound-recorder'
const formatNumber = number => `0${number}`.slice(-2)

const getRemaining = time => {
  const mins = Math.floor(time / 60)
  const secs = time - mins * 60
  return {mins: formatNumber(mins), secs: formatNumber(secs)}
}
const VoicePlayer = inputpath => {
  const Sound = require('react-native-sound')
  let whoosh = null;
  let [path, setPath] = useState(inputpath)
  let [startPlay, setStartPlay] = useState(false)
  let [speed, setSpeed] = useState(0)
  const [remainingSecs, setRemainingSecs] = useState(0)
  const [isActive, setIsActive] = useState(false)
  const {mins, secs} = getRemaining(remainingSecs)

  const reset = () => {
    setRemainingSecs(0)
    setIsActive(false)
  }
  useEffect(() => {
    let interval = null
    if (isActive) {
      interval = setInterval(() => {
        setRemainingSecs(remainingSecs => remainingSecs + 1)
      }, 1000)
    } else if (!isActive && remainingSecs !== 0) {
      clearInterval(interval)
    }
    return () => clearInterval(interval)
  }, [isActive, remainingSecs])
  const StartPlay = () => {
    Sound.setCategory('Playback')
    reset()
    setStartPlay(true)
    setIsActive(true)
    whoosh = new Sound(inputpath.inputpath, Sound.MAIN_BUNDLE, error => {
      if (error) {
        console.log('failed to load the sound', error)
        return
      }
      whoosh.setSpeed(speed)
      whoosh.play(success => {
        if (success) {
          StopPlay()
          console.log('successfully finished playing')
        } else {
          console.log('playback failed due to audio decoding errors')
        }
      })
    })
    whoosh.setVolume(2.5)
    whoosh.setPan(1)
  }
  const StopPlay = () => {
    setStartPlay(false)
    setIsActive(false)
    console.log(whoosh);
    // whoosh.pause()
  }
  let iconPlay = startPlay ? 'pause' : 'play'
  return (
    <View style={styles.container}>
      <View style={{flexDirection: 'row'}}>
        <TouchableOpacity
          style={styles.playBtn}
          onPress={() => (startPlay ? StopPlay() : StartPlay())}>
          <Icon
            name={iconPlay}
            style={{textAlign: 'center', color: 'blue', fontSize: 35}}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.playBtn}
          onPress={() => (speed <= 4 ? setSpeed(speed + 1) : setSpeed(0))}>
          <Text style={{color: 'black', fontSize: 15}}>x{speed}</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.timerText}>{`${mins}:${secs}`}</Text>
    </View>
  )
}

const VoiceRecorder = inputpath => {
  const Sound = require('react-native-sound')
  let whoosh = null
  let [path, setPath] = useState(inputpath)
  const [voiceUri, setVoiceUri] = useState('')
  let [speed, setSpeed] = useState(0)
  const [startRecord, setStartRecord] = useState(false)
  const [startPlay, setStartPlay] = useState(false)
  const [remainingSecs, setRemainingSecs] = useState(0)
  const [isActive, setIsActive] = useState(false)
  let iconRecord = startRecord ? 'stop' : 'record'
  let iconPlay = startPlay ? 'pause' : 'play'
  const {mins, secs} = getRemaining(remainingSecs)

  const reset = () => {
    setRemainingSecs(0)
    setIsActive(false)
  }
  useEffect(() => {
    let interval = null
    if (isActive) {
      interval = setInterval(() => {
        setRemainingSecs(remainingSecs => remainingSecs + 1)
      }, 1000)
    } else if (!isActive && remainingSecs !== 0) {
      clearInterval(interval)
    }
    return () => clearInterval(interval)
  }, [isActive, remainingSecs])
  const StartPlay = () => {
    Sound.setCategory('Playback')
    reset()
    setStartPlay(true)
    setIsActive(true)
    whoosh = new Sound(inputpath.inputpath, Sound.MAIN_BUNDLE, error => {
      if (error) {
        console.log('failed to load the sound', error)
        return
      }
      whoosh.setSpeed(speed)
      whoosh.play(success => {
        if (success) {
          StopPlay()
          console.log('successfully finished playing')
        } else {
          console.log('playback failed due to audio decoding errors')
        }
      })
    })
    whoosh.setVolume(2.5)
    whoosh.setPan(1)
  }
  const StopPlay = () => {
    setStartPlay(false)
    setIsActive(false)
    // whoosh.pause()
  }
  const StartRecord = () => {
    reset()
    SoundRecorder.start(inputpath.inputpath).then(function () {
      setStartRecord(true)
      setIsActive(true)
      console.log('started recording')
    })
  }
  const StopRecord = () => {
    SoundRecorder.stop().then(function (result) {
      setStartRecord(false)
      reset()
      setIsActive(false)
      console.log('stopped recording, audio file saved at: ' + result.path)
      setVoiceUri(navigation.state.params.word + '.mp3')
    })
  }
  return (
    <View style={styles.container}>
      <View style={{flexDirection: 'row'}}>
        <TouchableOpacity
          style={styles.playBtn}
          onPress={() => (startPlay ? StopPlay() : StartPlay())}>
          <Icon
            name={iconPlay}
            style={{textAlign: 'center', color: 'blue', fontSize: 35}}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.playBtn}
          onPress={() => (startRecord ? StopRecord() : StartRecord())}>
          <Icon
            name={iconRecord}
            type={'MaterialCommunityIcons'}
            style={{textAlign: 'center', color: 'blue', fontSize: 35}}
          />
        </TouchableOpacity>
      </View>
      <Text style={styles.timerText}>{`${mins}:${secs}`}</Text>
    </View>
  )
}

export {VoicePlayer, VoiceRecorder}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    backgroundColor: 'red',
    margin: 20,
    width: 200,
    height: 70,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playBtn: {
    backgroundColor: 'red',
    borderColor: 'white',
    borderWidth: 2,
    borderRadius: 25,
    width: 50,
    height: 50,
    margin: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timerText: {
    color: 'white',
    fontSize: 10,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
})
