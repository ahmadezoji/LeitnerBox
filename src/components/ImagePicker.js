import * as ImagePicker from 'react-native-image-picker'
// More info on all the options is below in the README...just some common use cases shown here
const options = {
  title: 'انتخاب تصویر',
  takePhotoButtonTitle: 'گرفتن از دوربین ...',
  chooseFromLibraryButtonTitle: 'انتخاب از گالری تصاویر ...',
  cancelButtonTitle: 'منصرف شدم',
  saveToPhotos: true,
  storageOptions: {
    skipBackup: true,
    path: 'images',
  },
}

/**
 * The first arg is the options object for customization (it can also be null or omitted for default options),
 * The second arg is the callback which sends object: response (more info below in README)
 */
export const picker = callback => {
  ImagePicker.launchImageLibrary(options, response => {
    // console.log('Response = ', response.assets[0]);
    if (response == null) {
      callback(null)
      return
    }

    if (response.didCancel) {
      // console.log('User cancelled image picker');
    } else if (response.error) {
      // console.log('ImagePicker Error: ', response.error);
    } else if (response.customButton) {
      // console.log('User tapped custom button: ', response.customButton);
    } else {
      let source = {uri: response.assets[0].uri}

      // You can also display the image using data:
      // let source = { uri: 'data:image/jpeg;base64,' + response.data };
      callback(source, response.data)
    }
  })
}
