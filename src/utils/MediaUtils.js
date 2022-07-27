import {launchCamera, launchImageLibrary} from 'react-native-image-picker';

const CONFIG = {
  mediaType: 'photo',
  quality: 0.5,
  includeBase64: true,
};

export const getImageFromGallery = async () => {
  const result = await launchImageLibrary(CONFIG);

  return result;
};

export const getImageFromCamera = async () => {
  const result = await launchCamera(CONFIG);

  return result;
};
