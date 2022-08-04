import firestore from '@react-native-firebase/firestore';
import {GET_CURRENT_DATETIME, randomNumber} from './Utils';
import _ from 'lodash';
import {MONTH_LIST} from './Constants';

const productCollection = firestore().collection('Products');
const reportCollection = firestore().collection('Reports');
const requestCollection = firestore().collection('Request');
const reportDataCollection = firestore().collection('ReportData');

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
    const reportRef = reportCollection.doc('Product');
    const productRef = productCollection.doc(productId);
    // Get post data first
    const reportSnapshot = await transaction.get(reportRef);
    const productSnapshot = await transaction.get(productRef);

    if (!reportSnapshot.exists) {
      throw 'Report snap does not exist!';
    }

    if (!productSnapshot.exists) {
      throw 'Product snap does not exist!';
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
    const reportRef = reportCollection.doc('Product');
    // Get post data first
    const reportSnapshot = await transaction.get(reportRef);

    if (!reportSnapshot.exists) {
      throw 'Product snap does not exist!';
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
const SEND_REPORT_DATA = data => {
  const currentMonthNumber = Number(GET_CURRENT_DATETIME().split('-')[1]) - 1;
  const currentYear = GET_CURRENT_DATETIME().split('-')[0];
  const month = MONTH_LIST(false)[currentMonthNumber];

  return reportDataCollection
    .doc(month.sub)
    .collection('reports')
    .add({...data, yearId: currentYear});
};

const GET_REPORT_DATA = month => {
  return reportDataCollection
    .doc(month)
    .collection('reports')
    .get()
    .then(snapshot => {
      let temp = [];
      if (snapshot.size > 0) {
        snapshot.forEach(doc => {
          temp.push(doc.data());
        });
      }

      console.log('TEMP : ' + JSON.stringify(temp));

      return temp;
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
  SEND_REPORT_DATA,
  GET_REPORT_DATA,
};
