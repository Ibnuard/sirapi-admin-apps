import firestore from '@react-native-firebase/firestore';
import {GET_CURRENT_DATETIME, randomNumber} from './Utils';
import _ from 'lodash';
import {MONTH_LIST} from './Constants';

const productCollection = firestore().collection('Products');
const reportCollection = firestore().collection('Reports');
const requestCollection = firestore().collection('Request');
const reportDataCollection = firestore().collection('ReportData').doc('Month');
const notificationCollection = firestore().collection('AdminToken');

const ADMIN_ADD_PRODUCT = (id, data) => {
  return productCollection.doc(id).set(data);
};

const ADMIN_GET_ALL_PRODUCT = () => {
  return productCollection.get();
};

const ADMIN_DELETE_PRODUCT = (qty, id) => {
  return ADMIN_ON_DATA_REMOVED(qty).then(() => {
    return productCollection.doc(id).delete();
  });
};

const ADMIN_UPDATE_PRODUCT = (id, data) => {
  return productCollection.doc(id).update(data);
};

const ADMIN_GET_REPORT = () => {
  //  return reportCollection.doc('Product').get();
  return reportCollection.doc('Product').get();
};

function ADMIN_ON_DATA_ADDED(qty) {
  return firestore().runTransaction(async transaction => {
    const currentMonthNumber = Number(GET_CURRENT_DATETIME().split('-')[1]) - 1;
    const currentYear = GET_CURRENT_DATETIME().split('-')[0];
    const month = MONTH_LIST(false)[currentMonthNumber];

    const reportRef = reportCollection.doc('Product');
    const reportDataRef = reportDataCollection
      .collection(month.sub)
      .doc(currentYear);

    // Get post data first
    const reportSnapshot = await transaction.get(reportRef);
    const reportDataSnapshot = await transaction.get(reportDataRef);

    if (!reportSnapshot.exists) {
      throw 'Post does not exist!';
    }

    if (!reportDataSnapshot.exists) {
      console.log('Ref not exist!');
      transaction.set(reportDataRef, {
        productIn: qty,
        productOut: 0,
        yearId: currentYear,
      });
    } else {
      console.log('Ref exist!');
      transaction.update(reportDataRef, {
        productIn: reportDataSnapshot.data().productIn + qty,
      });
    }

    transaction.update(reportRef, {
      productIn: reportSnapshot.data().productIn + qty,
      productTotal: reportSnapshot.data().productTotal + qty,
      productAvailable: reportSnapshot.data().productAvailable + qty,
    });
  });
}

function ADMIN_ON_DATA_REMOVED(qty) {
  return firestore().runTransaction(async transaction => {
    const reportRef = reportCollection.doc('Product');
    // Get post data first
    const reportSnapshot = await transaction.get(reportRef);

    if (!reportSnapshot.exists) {
      throw 'Post does not exist!';
    }

    transaction.update(reportRef, {
      productIn: reportSnapshot.data().productIn - qty,
      productTotal: reportSnapshot.data().productTotal - qty,
      productAvailable: reportSnapshot.data().productAvailable - qty,
    });
  });
}

function ADMIN_ON_DATA_OUT(qty = 0, productId) {
  return firestore().runTransaction(async transaction => {
    const currentMonthNumber = Number(GET_CURRENT_DATETIME().split('-')[1]) - 1;
    const currentYear = GET_CURRENT_DATETIME().split('-')[0];
    const month = MONTH_LIST(false)[currentMonthNumber];

    const reportDataRef = reportDataCollection
      .collection(month.sub)
      .doc(currentYear);
    const reportRef = reportCollection.doc('Product');
    const productRef = productCollection.doc(productId);

    // Get post data first
    const reportSnapshot = await transaction.get(reportRef);
    const productSnapshot = await transaction.get(productRef);
    const reportDataSnapshot = await transaction.get(reportDataRef);

    if (!reportSnapshot.exists) {
      throw 'Report snap does not exist!';
    }

    if (!productSnapshot.exists) {
      throw 'Product snap does not exist!';
    }

    if (!reportDataSnapshot.exists) {
      console.log('Ref not exist!');
      transaction.set(reportDataRef, {
        productIn: 0,
        productOut: qty,
        yearId: currentYear,
      });
    } else {
      transaction.update(reportDataRef, {
        productOut: reportDataSnapshot.data().productOut + qty,
      });
    }

    transaction.update(reportRef, {
      productAvailable: reportSnapshot.data().productAvailable - qty,
      productOut: reportSnapshot.data().productOut + qty,
    });

    transaction.update(productRef, {
      productQuantity: productSnapshot.data().productQuantity - qty,
    });
  });
}

function ADMIN_ON_DATA_UPDATED(dif, type = 'inc') {
  return firestore().runTransaction(async transaction => {
    const currentMonthNumber = Number(GET_CURRENT_DATETIME().split('-')[1]) - 1;
    const currentYear = GET_CURRENT_DATETIME().split('-')[0];
    const month = MONTH_LIST(false)[currentMonthNumber];

    const reportRef = reportCollection.doc('Product');
    const reportDataRef = reportDataCollection
      .collection(month.sub)
      .doc(currentYear);

    // Get post data first
    const reportSnapshot = await transaction.get(reportRef);
    const reportDataSnapshot = await transaction.get(reportDataRef);

    if (!reportSnapshot.exists) {
      throw 'Product snap does not exist!';
    }

    if (!reportDataSnapshot.exists) {
      console.log('Ref not exist!');
      transaction.set(reportDataRef, {
        productIn: dif,
        productOut: 0,
        yearId: currentYear,
      });
    } else {
      transaction.update(reportDataRef, {
        productIn: reportDataSnapshot.data().productIn + dif,
      });
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
  return requestCollection.orderBy('datetime', 'asc').get();
};

const ADMIN_REJECT_REQUEST = id => {
  return requestCollection.doc(id).update({
    status: 'reject',
  });
};

const ADMIN_GET_PRODUCT_DETAIL = id => {
  return productCollection.doc(id).get();
};

const ADMIN_APPROVE_REQUEST = (requestId, productId, qty) => {
  return ADMIN_ON_DATA_OUT(qty, productId).then(() => {
    return requestCollection.doc(requestId).update({
      status: 'success',
    });
  });
};

//USER
const USER_CREATE_REQUEST = (product, requestData) => {
  const generateRequestId = `REQUEST${randomNumber(10000, 99999)}`;
  return requestCollection.doc(generateRequestId).set({
    product: product,
    requester: requestData,
    timestamp: GET_CURRENT_DATETIME('llll'),
    datetime: new Date(),
    status: 'pending',
    requestId: generateRequestId,
  });
};

//REPORT DATA
const CREATE_REPORT_DATA = data => {
  console.log('Create new report data month!');
  const currentMonthNumber = Number(GET_CURRENT_DATETIME().split('-')[1]) - 1;
  const currentYear = GET_CURRENT_DATETIME().split('-')[0];
  const month = MONTH_LIST(false)[currentMonthNumber];

  return reportDataCollection
    .doc(month.sub)
    .collection(currentYear)
    .doc('reports')
    .set({
      productIn: data?.in,
      productOut: data?.out,
    });
};

const GET_REPORT_DATA = month => {
  const currentYear = GET_CURRENT_DATETIME().split('-')[0];
  return reportDataCollection.collection(month).get();
};

//NOTIFICATION
const SAVE_ADMIN_TOKEN = (token = '') => {
  const tokenId = token.slice(0, 10);
  return notificationCollection.doc(tokenId).set({
    token: token,
  });
};

const GET_ADMIN_TOKEN = () => {
  return notificationCollection.get().then(snapshot => {
    let temp = [];
    if (snapshot.size > 0) {
      snapshot.forEach(data => {
        const datas = data.data();
        temp.push(datas);
      });

      return temp;
    } else {
      console.log('Not Exist');
    }
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
  ADMIN_APPROVE_REQUEST,
  USER_CREATE_REQUEST,
  CREATE_REPORT_DATA,
  GET_REPORT_DATA,
  SAVE_ADMIN_TOKEN,
  GET_ADMIN_TOKEN,
};
