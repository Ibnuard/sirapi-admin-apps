import * as React from 'react';
import {View, Text, StyleSheet, Image, ScrollView} from 'react-native';
import {Button} from '../../components';
import BaseModal from '../../components/Modal';
import {Colors} from '../../styles';
import {
  ADMIN_GET_PRODUCT_DETAIL,
  ADMIN_REJECT_REQUEST,
} from '../../utils/FirebaseUtils';

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
        setModalType('success');
        setModalMessage('Permintaan berhasil ditolak!');
      })
      .catch(e => {
        setModalType('warning');
        setModalMessage('Permintaan gagal ditolak, mohon coba lagi!');
      });
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
        ) : (
          <>
            <Button
              buttonStyle={{backgroundColor: 'red'}}
              containerStyle={{marginBottom: 8}}
              title="Tolak Permintaan"
              onPress={() => onRejectButtonPressed()}
            />
            <Button title="Scan untuk menyetujui" />
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
