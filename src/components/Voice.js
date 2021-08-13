import {Icon} from 'native-base'
import React, {useState, useEffect, useRef} from 'react'
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Slider,
  Dimensions,
  Animated,
  Easing,
} from 'react-native'
import SoundRecorder from 'react-native-sound-recorder'
import Toast from 'react-native-simple-toast'

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
  let sound = useRef(null)
  let myInterval = null
  const startPlaying = async () => {
    if (sound.current == null) return
    await setDuration(sound.current.getDuration())
    sound.current.setCurrentTime(0)
    sound.current.setSpeed(speed)
    sound.current.play(success => {
      if (success) stopPlayer()
    })
    sound.current.setCurrentTime(currentTime)
    setStartPlay(true)
    if (myInterval !== null) clearInterval(myInterval)
    myInterval = setInterval(() => {
      sound.current.getCurrentTime(secs => {
        setCurrentTime(secs)
      })
    }, 100)
    console.warn('Now playing')
  }
  const stopPlayer = () => {
    console.log('stop')
    clearInterval(myInterval)
    setStartPlay(false)
    setCurrentTime(0)
    if (sound.current !== null) sound.current = null
    console.warn('Now stoped')
  }
  const pausePlaying = () => {
    clearInterval(myInterval)
    setStartPlay(false)
    sound.current.pause()
    sound.current.release()
    console.warn('Now paused')
  }
  const _onplay = () => {
    if (!startPlay) {
      Sound.setCategory('Playback')
      if (sound.current !== null) sound.current = null
      sound.current = new Sound(inputpath.inputpath, null, startPlaying)
    } else {
      pausePlaying()
    }
  }
  let iconPlay = startPlay ? 'pause' : 'play'
  return (
    <View style={styles.containerPlayer}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <TouchableOpacity style={styles.playBtn} onPress={() => _onplay()}>
          <Icon
            name={iconPlay}
            style={{textAlign: 'center', color: 'blue', fontSize: 30}}
          />
        </TouchableOpacity>
        <Slider
          value={currentTime}
          maximumValue={duration}
          minimumValue={0}
          onValueChange={val => {
            console.log(val)
            if (sound.current !== null) {
              setCurrentTime(val)
              sound.current.setCurrentTime(val)
            }
          }}
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
  let sound = useRef(null)

  const reset = () => {
    setRemainingSecs(0)
    setIsActive(false)
  }
  useEffect(() => {
    let interval = null
    Sound.setCategory('Playback')
    sound.current = new Sound(inputpath.inputpath, Sound.MAIN_BUNDLE, error => {
      if (error) {
        console.log('failed to load the sound', error)
        return
      }
      if (sound.current._loaded) {
        sound.current.setVolume(2.5)
      }
    })

    if (isActive) {
      interval = setInterval(() => {
        setRemainingSecs(remainingSecs => remainingSecs + 1)
      }, 1000)
    } else if (!isActive && remainingSecs !== 0) {
      clearInterval(interval)
    }
    return () => clearInterval(interval)
  }, [isActive, remainingSecs])
  const startPlaying = () => {
    reset()
    if (sound.current._duration == -1) {
      Toast.show('اشکال در پخش صدا')
      return
    }
    sound.current.play(success => {
      if (success) stopPlaying()
    })
    setStartPlay(true)
    setIsActive(true)
    console.warn('Now playing')
  }

  const stopPlaying = () => {
    sound.current.pause()
    setStartPlay(false)
    setIsActive(false)
    console.warn('Now paused')
  }
  const _onplay = () => {
    if (!startPlay) {
      startPlaying()
    } else {
      stopPlaying()
    }
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
    <View style={styles.containerRecorder}>
      <View style={{flexDirection: 'row'}}>
        <TouchableOpacity style={styles.playBtn} onPress={() => _onplay()}>
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

const VoiceRecorderWithOptions = params => {
  let ScreenWidth = Dimensions.get('window').width
  let [left, setLeft] = useState(new Animated.Value(ScreenWidth))
  let [open, close] = useState(params.open)
  const [startRecord, setStartRecord] = useState(false)
  const [startPlay, setStartPlay] = useState(false)
  let iconRecord = startRecord ? 'stop' : 'record'
  let iconPlay = startPlay ? 'pause' : 'play'
  const [remainingSecs, setRemainingSecs] = useState(0)
  const {mins, secs} = getRemaining(remainingSecs)
  const BoxAnimatedStyles = [
    {
      width: 200,
      height: 60,
      backgroundColor: 'white',
      left: left,
      borderRadius: 10,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: 'black',
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.9,
      shadowRadius: 3,
      elevation: 3,
    },
  ]
  const CloseanimatedBox = () => {
    Animated.timing(left, {
      toValue: ScreenWidth,
      duration: 700,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start(() => {})
  }
  const OpenanimatedBox = () => {
    Animated.timing(left, {
      toValue: 100,
      duration: 700,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start(() => {})
  }
  useEffect(() => {
    open && OpenanimatedBox()
    !open && CloseanimatedBox()
  })

  return (
    <Animated.View style={BoxAnimatedStyles}>
      <View style={{flexDirection: 'row'}}>
        <TouchableOpacity style={styles.playBtn} onPress={() => _onplay()}>
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
    </Animated.View>
  )
}
export {VoicePlayer, VoiceRecorder, VoiceRecorderWithOptions}

const styles = StyleSheet.create({
  containerRecorder: {
    flexDirection: 'column',
    backgroundColor: 'white',
    margin: 5,
    width: 100,
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
  containerPlayer: {
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
