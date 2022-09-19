import * as React from 'react';
import {View, Text, StyleSheet, Image, ScrollView} from 'react-native';
import {Button} from '../../components';
import BaseModal from '../../components/Modal';
import {Colors} from '../../styles';
import {
  ADMIN_APPROVE_REQUEST,
  ADMIN_GET_PRODUCT_DETAIL,
  ADMIN_REJECT_REQUEST,
  ADMIN_SAVE_PRODUCT_IN,
  ADMIN_SAVE_PRODUCT_OUT,
} from '../../utils/FirebaseUtils';
import {sendNotificationToUser} from '../../utils/Utils';

const DetailProductScreen = ({navigation, route}) => {
  const [modalVisible, setModalVisible] = React.useState(false);
  const [modalMessage, setModalMessage] = React.useState('');
  const [modalType, setModalType] = React.useState('loading');

  const data = route?.params?.data;

  const productData = data?.product;
  const requestData = data?.requester;

  const [productDetail, setProductDetail] = React.useState({
    productName: productData?.productName,
    productDescription: productData?.productDescription,
    productQuantity: productData?.productQuantity,
    productCode: productData?.productCode,
    productPic: productData?.productPic,
  });

  React.useEffect(() => {
    updateData();

    return null;
  }, []);

  function updateData() {
    ADMIN_GET_PRODUCT_DETAIL(productData?.productId).then(snapshot => {
      if (snapshot.data()) {
        const sd = snapshot?.data();
        setProductDetail({
          productName: sd.productName,
          productDescription: sd.productDescription,
          productCode: sd?.productCode,
          productPic: sd?.productPic,
          productQuantity: sd?.productQuantity,
        });
      }
    });
  }

  //REJECT

  function onRejectButtonPressed() {
    setModalType('alert');
    setModalMessage('Apakah Anda yakin ingin menolak permintaan ini?');
    setModalVisible(true);
  }

  function onRejectConfirmed() {
    setModalType('loading');
    ADMIN_REJECT_REQUEST(data?.requestId)
      .then(() => {
        console.log('Reject Success');
        sendNotif();
        setModalType('success');
        setModalMessage('Permintaan berhasil ditolak!');
      })
      .catch(e => {
        setModalType('warning');
        setModalMessage('Permintaan gagal ditolak, mohon coba lagi!');
      });
  }

  //APPROVE
  function onApproveButtonPressed() {
    setModalType('loading');
    setModalVisible(true);
    ADMIN_APPROVE_REQUEST(
      data?.requestId,
      productData?.productId,
      requestData?.requestQty,
    )
      .then(() => {
        // sendSuccessNotif();
        // setModalMessage('Permintaan berhasil disetujui!');
        // setModalType('success');
        saveProductDetailReport();
      })
      .catch(e => {
        console.log(e);
        setModalMessage('Kesalahan tidak diketahui, mohon coba lagi!');
        setModalType('warning');
      });
  }

  function saveProductDetailReport() {
    console.log('Save product report');
    ADMIN_SAVE_PRODUCT_OUT(
      productData?.productCode,
      requestData?.requestQty,
      productData?.productName,
    )
      .then(() => {
        sendSuccessNotif();
        setModalMessage('Permintaan berhasil disetujui!');
        setModalType('success');
      })
      .catch(e => {
        console.log(e);
        setModalMessage('Kesalahan tidak diketahui, mohon coba lagi!');
        setModalType('warning');
      });
  }

  async function sendSuccessNotif() {
    await sendNotificationToUser(
      requesToken,
      `Status permintaan penarikan barang`,
      `Permintaan penarikan ${productData?.productName} telah disetujui.`,
    );
  }

  async function sendNotif() {
    await sendNotificationToUser(
      requestData?.requestToken,
      'Status permintaan penarikan barang',
      `Permintaan penarikan ${productData?.productName} ditolak!`,
    );
  }

  function handleOnButtonPressed() {
    if (modalType == 'alert') {
      onRejectConfirmed();
    } else if (modalType == 'success') {
      setModalVisible(false);
      navigation.goBack();
    } else {
      setModalVisible(false);
    }
  }

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: 100}}>
        <>
          <View style={styles.infoContainer}>
            <Text style={{marginBottom: 8}}>Foto Barang</Text>
            <Image
              source={{
                uri: `data:image/png;base64,${productDetail?.productPic}`,
              }}
              style={styles.mediaUplaodButton}
            />
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.textCaption}>Nama Barang</Text>
            <Text style={styles.textValue}>{productDetail?.productName}</Text>
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.textCaption}>Deskripsi Barang</Text>
            <Text style={styles.textValue}>
              {productDetail?.productDescription}
            </Text>
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.textCaption}>Persediaan Barang</Text>
            <Text style={styles.textValue}>
              {productDetail?.productQuantity}
            </Text>
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.textCaption}>Kode Barang</Text>
            <Text style={styles.textValue}>{productDetail?.productCode}</Text>
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.textCaption}>Permintaan oleh</Text>
            <Text style={styles.textValue}>{requestData?.requestName}</Text>
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.textCaption}>Jumlah permintaan</Text>
            <Text style={styles.textValue}>{requestData?.requestQty}</Text>
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.textCaption}>Waktu dan tanggal</Text>
            <Text style={styles.textValue}>{data?.timestamp}</Text>
          </View>
        </>
      </ScrollView>
      <View style={styles.bottomContainer}>
        {data?.status == 'reject' ? (
          <Button disabled title="Ditolak" />
        ) : data?.status == 'success' ? (
          <Button disabled title="Telah disetujui" />
        ) : (
          <>
            <Button
              buttonStyle={{backgroundColor: 'red'}}
              containerStyle={{marginBottom: 8}}
              title="Tolak Permintaan"
              onPress={() => onRejectButtonPressed()}
            />
            <Button
              title="Setujui Permintaan"
              onPress={() => onApproveButtonPressed()}
            />
          </>
        )}
      </View>
      <BaseModal
        visible={modalVisible}
        type={modalType}
        message={modalMessage}
        onCancelButtonPress={() => setModalVisible(false)}
        onButtonPress={() => handleOnButtonPressed()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.COLOR_WHITE,
    padding: 24,
  },

  infoContainer: {
    marginVertical: 8,
  },

  bottomContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },

  mediaUplaodButton: {
    backgroundColor: Colors.COLOR_PRIMARY,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    width: 72,
    height: 96,
  },

  //TEXT STYLES

  textCaption: {
    fontSize: 14,
    color: Colors.COLOR_GRAY,
  },

  textValue: {
    fontSize: 16,
    color: Colors.COLOR_BLACK,
  },
});

export default DetailProductScreen;
