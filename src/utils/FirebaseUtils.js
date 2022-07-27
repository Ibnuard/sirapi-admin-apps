import firestore from '@react-native-firebase/firestore';

const productCollection = firestore().collection('Products');

const ADMIN_ADD_PRODUCT = data => {
  return productCollection.add(data);
};

const ADMIN_GET_ALL_PRODUCT = () => {
  return productCollection.get();
};

export {ADMIN_ADD_PRODUCT, ADMIN_GET_ALL_PRODUCT};
