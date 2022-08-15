import * as React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {Colors} from '../../styles';

import QRCodeScanner from 'react-native-qrcode-scanner';
import {RNCamera} from 'react-native-camera';
import BaseModal from '../../components/Modal';
import {ADMIN_APPROVE_REQUEST} from '../../utils/FirebaseUtils';
import {sendNotificationToUser} from '../../utils/Utils';

const ScanProductScreen = ({route, navigation}) => {
  const requestId = route?.params?.requestId;
  const productId = route?.params?.productId;
  const productCode = route?.params?.productCode;
  const requestQty = route?.params?.requestAmount;
  const productName = route?.params?.productName;
  const requesToken = route?.params?.requestToken;

  const [modalVisible, setModalVisible] = React.useState(false);
  const [modalMessage, setModalMessage] = React.useState('');
  const [modalType, setModalType] = React.useState('loading');

  function onSuccess(res) {
    setModalType('loading');
    setModalVisible(true);
    console.log('res : ' + res?.data);
    const data = res?.data;
    if (data?.includes(productCode)) {
      //   setModalMessage('Permintaan berhasil disetujui!');
      //   setModalType('success');
      onProductScanned();
    } else {
      setModalMessage('Kode tidak sesuai!');
      setModalType('warning');
    }
  }

  function onProductScanned() {
    ADMIN_APPROVE_REQUEST(requestId, productId, requestQty)
      .then(() => {
        sendNotif();
        setModalMessage('Permintaan berhasil disetujui!');
        setModalType('success');
      })
      .catch(e => {
        console.log(e);
        setModalMessage('Kesalahan tidak diketahui, mohon coba lagi!');
        setModalType('warning');
      });
  }

  async function sendNotif() {
    await sendNotificationToUser(
      requesToken,
      `Status permintaan penarikan barang`,
      `Permintaan penarikan ${productName} telah disetujui.`,
    );
  }

  return (
    <>
      <QRCodeScanner
        onRead={e => onSuccess(e)}
        flashMode={RNCamera.Constants.FlashMode.off}
        topContent={
          <Text style={styles.centerText}>
            Scan kode QR dengan kode barang{' '}
            <Text style={styles.textBold}>{productCode}</Text> untuk menyetujui
            permintaan.
          </Text>
        }
      />

      <BaseModal
        visible={modalVisible}
        type={modalType}
        message={modalMessage}
        onCancelButtonPress={() => setModalVisible(false)}
        onButtonPress={() => (
          setModalVisible(false),
          modalType == 'success' ? navigation.popToTop() : navigation.goBack()
        )}
      />
    </>
  );
};

const styles = StyleSheet.create({
  centerText: {
    flex: 1,
    fontSize: 18,
    padding: 32,
    textAlign: 'center',
    color: '#777',
  },
  textBold: {
    fontWeight: '500',
    color: '#000',
  },
  buttonText: {
    fontSize: 21,
    color: 'rgb(0,122,255)',
  },
  buttonTouchable: {
    padding: 16,
  },
});

export default ScanProductScreen;
