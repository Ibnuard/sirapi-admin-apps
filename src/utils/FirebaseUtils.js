import firestore from '@react-native-firebase/firestore';
import {GET_CURRENT_DATETIME, randomNumber} from './Utils';

const productCollection = firestore().collection('Products');
const reportCollection = firestore().collection('Reports');
const requestCollection = firestore().collection('Request');

const ADMIN_ADD_PRODUCT = (id, data) => {
  return productCollection.doc(id).set(data);
};

const ADMIN_GET_ALL_PRODUCT = () => {
  return productCollection.get();
};

const ADMIN_DELETE_PRODUCT = id => {
  return productCollection.doc(id).delete();
};

const ADMIN_UPDATE_PRODUCT = (id, data) => {
  return productCollection.doc(id).update(data);
};

const ADMIN_GET_REPORT = () => {
  return reportCollection.doc('Product').get();
};

function ADMIN_ON_DATA_ADDED(qty) {
  return firestore().runTransaction(async transaction => {
    const reportRef = reportCollection.doc('Product');
    // Get post data first
    const reportSnapshot = await transaction.get(reportRef);

    if (!reportSnapshot.exists) {
      throw 'Post does not exist!';
    }

    transaction.update(reportRef, {
      productIn: reportSnapshot.data().productIn + qty,
      productTotal: reportSnapshot.data().productTotal + qty,
      productAvailable: reportSnapshot.data().productAvailable + qty,
    });
  });
}

function ADMIN_ON_DATA_UPDATED(dif, type = 'inc') {
  return firestore().runTransaction(async transaction => {
    const reportRef = reportCollection.doc('Product');
    // Get post data first
    const reportSnapshot = await transaction.get(reportRef);

    if (!reportSnapshot.exists) {
      throw 'Post does not exist!';
    }

    transaction.update(reportRef, {
      productIn:
        type == 'inc'
          ? reportSnapshot.data().productIn + dif
          : reportSnapshot.data().productIn - dif,
      productTotal:
        type == 'inc'
          ? reportSnapshot.data().productTotal + dif
          : reportSnapshot.data().productTotal - dif,
      productAvailable:
        type == 'inc'
          ? reportSnapshot.data().productAvailable + dif
          : reportSnapshot.data().productAvailable - dif,
    });
  });
}

const ADMIN_GET_ALL_REQUEST = () => {
  return requestCollection.get();
};

const ADMIN_REJECT_REQUEST = id => {
  return requestCollection.doc(id).update({
    status: 'reject',
  });
};

const ADMIN_GET_PRODUCT_DETAIL = id => {
  return productCollection.doc(id).get();
};

const USER_CREATE_REQUEST = (product, requestData) => {
  const generateRequestId = `REQUEST${randomNumber(10000, 99999)}`;
  return requestCollection.doc(generateRequestId).set({
    product: product,
    requester: requestData,
    timestamp: GET_CURRENT_DATETIME('llll'),
    status: 'pending',
    requestId: generateRequestId,
  });
};

export {
  ADMIN_ADD_PRODUCT,
  ADMIN_GET_ALL_PRODUCT,
  ADMIN_DELETE_PRODUCT,
  ADMIN_UPDATE_PRODUCT,
  ADMIN_GET_REPORT,
  ADMIN_ON_DATA_ADDED,
  ADMIN_ON_DATA_UPDATED,
  ADMIN_GET_ALL_REQUEST,
  ADMIN_REJECT_REQUEST,
  ADMIN_GET_PRODUCT_DETAIL,
  USER_CREATE_REQUEST,
};
