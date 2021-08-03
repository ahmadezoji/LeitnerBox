import {Icon} from 'native-base'
import React, {useState, useEffect, useRef} from 'react'
import {StyleSheet, Text, TouchableOpacity, View, Slider} from 'react-native'
import SoundRecorder from 'react-native-sound-recorder'
const formatNumber = number => `0${number}`.slice(-2)

const getRemaining = time => {
  const mins = Math.floor(time / 60)
  const secs = time - mins * 60
  return {mins: formatNumber(mins), secs: formatNumber(secs)}
}
const VoicePlayer = inputpath => {
  const Sound = require('react-native-sound')
  let [player, setPlayer] = useState(null)
  let [path, setPath] = useState(inputpath)
  let [startPlay, setStartPlay] = useState(false)
  let [speed, setSpeed] = useState(0)
  const [remainingSecs, setRemainingSecs] = useState(0)
  const [isActive, setIsActive] = useState(false)
  const {mins, secs} = getRemaining(remainingSecs)
  let [duration, setDuration] = useState(0)
  let [currentTime, setCurrentTime] = useState(0)

  const reset = () => {
    setRemainingSecs(0)
    setIsActive(false)
  }
  useEffect(() => {
    let interval = null
    let whoosh = null
    Sound.setCategory('Playback')
    whoosh = new Sound(inputpath.inputpath, Sound.MAIN_BUNDLE, error => {
      if (error) {
        console.log('failed to load the sound', error)
        return
      }
      if (whoosh._loaded) {
        whoosh.setVolume(2.5)
        // whoosh.setPan(1)
        // whoosh.setNumberOfLoops(-1)
      }
      setDuration(whoosh.getDuration())
      setPlayer(whoosh)
    })

    if (isActive) {
      interval = setInterval(() => {
        // setRemainingSecs(remainingSecs => remainingSecs + 1)
        player.getCurrentTime(seconds => {
          if (interval) {
            setCurrentTime(seconds)
          }
        })
        // player.pause(success => console.log(success))
      }, 100)
    } else if (!isActive && remainingSecs !== 0) {
      clearInterval(interval)
    }

    return () => clearInterval(interval)
  }, [isActive, remainingSecs])
  const StartPlay = () => {
    if (player !== null) {
      reset()
      setStartPlay(true)
      setIsActive(true)
      player.setSpeed(speed)
      player.play(success => {
        if (success) {
          StopPlay()
          console.log('successfully finished playing')
        } else {
          console.log('playback failed due to audio decoding errors')
        }
      })
    }
  }
  const StopPlay = () => {
    setStartPlay(false)
    setIsActive(false)
    player.pause()
  }
  let iconPlay = startPlay ? 'pause' : 'play'
  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <TouchableOpacity
          style={styles.playBtn}
          onPress={() => (startPlay ? StopPlay() : StartPlay())}>
          <Icon
            name={iconPlay}
            style={{textAlign: 'center', color: 'blue', fontSize: 30}}
          />
        </TouchableOpacity>
        <Slider
          value={currentTime}
          maximumValue={duration}
          minimumValue={0}
          style={styles.slider}
        />
        <TouchableOpacity
          style={styles.speedBtn}
          onPress={() => (speed <= 4 ? setSpeed(speed + 1) : setSpeed(0))}>
          <Text style={{color: 'black', fontSize: 15}}>x{speed}</Text>
        </TouchableOpacity>
      </View>
      {/* <Text style={styles.timerText}>{`${mins}:${secs}`}</Text> */}
      <Text style={styles.timerText}>{`${currentTime.toFixed(2)} s`}</Text>
    </View>
  )
}

const VoiceRecorder = inputpath => {
  const Sound = require('react-native-sound')

  let [path, setPath] = useState(inputpath)
  let [player, setPlayer] = useState(null)
  const [voiceUri, setVoiceUri] = useState('')
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
    let whoosh = null
    whoosh = new Sound(inputpath.inputpath, Sound.MAIN_BUNDLE, error => {
      if (error) {
        console.log('failed to load the sound', error)
        return
      }
    })
    whoosh.setVolume(2.5)
    whoosh.setPan(1)
    setPlayer(whoosh)
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

    player !== null &&
      player.play(success => {
        if (success) {
          StopPlay()
          console.log('successfully finished playing')
        } else {
          console.log('playback failed due to audio decoding errors')
        }
      })
  }
  const StopPlay = () => {
    setStartPlay(false)
    setIsActive(false)
    console.log(player)
    player !== null && player.stop()
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
            style={{textAlign: 'center', color: 'red', fontSize: 35}}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.playBtn}
          onPress={() => (startRecord ? StopRecord() : StartRecord())}>
          <Icon
            name={iconRecord}
            type={'MaterialCommunityIcons'}
            style={{textAlign: 'center', color: 'red', fontSize: 35}}
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
    backgroundColor: 'white',
    margin: 20,
    width: 200,
    height: 60,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: 'black',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.9,
    shadowRadius: 3,
    elevation: 3,
  },
  playBtn: {
    backgroundColor: 'white',
    borderColor: 'white',
    borderWidth: 2,
    borderRadius: 25,
    width: 35,
    height: 35,
    margin: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  speedBtn: {
    backgroundColor: 'white',
    borderColor: 'blue',
    borderWidth: 1,
    borderRadius: 5,
    width: 30,
    height: 30,
    margin: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timerText: {
    color: 'black',
    fontSize: 12,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  slider: {
    width: 120,
    height: 10,
    margin: 1,
  },
})
