import * as React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {Button, Input} from '../../components';
import BaseModal from '../../components/Modal';
import {Colors} from '../../styles';
import Icon from 'react-native-vector-icons/Entypo';
import {getImageFromCamera, getImageFromGallery} from '../../utils/MediaUtils';
import {
  ADMIN_ADD_PRODUCT,
  ADMIN_DELETE_PRODUCT,
  ADMIN_ON_DATA_UPDATED,
  ADMIN_UPDATE_PRODUCT,
  USER_CREATE_REQUEST,
} from '../../utils/FirebaseUtils';
import {randomNumber} from '../../utils/Utils';

const EditDeleteProductScreen = ({navigation, route}) => {
  const [modalVisible, setModalVisible] = React.useState(false);
  const [modalMessage, setModalMessage] = React.useState('');
  const [modalType, setModalType] = React.useState('loading');

  //EXISTING DATA
  const data = route?.params?.data;

  const [selectedImage, setSelectedImage] = React.useState(data?.productPic);

  //input state
  const [inputName, setInputName] = React.useState(data?.productName);
  const [inputDescription, setInputDescription] = React.useState(
    data?.productDescription,
  );
  const [inputCode, setInputCode] = React.useState(data?.productCode);
  const [inputQty, setInputQty] = React.useState(String(data?.productQuantity));

  function onMediaUploadButtonPress() {
    setModalType('mediaupload');
    setModalVisible(true);
  }

  async function onMediaGalleryPressed() {
    setModalVisible(false);
    const image = await getImageFromGallery();

    if (image) {
      setSelectedImage(image.assets[0].base64);
    }
  }

  async function onMediaCameraPressed() {
    setModalVisible(false);
    const image = await getImageFromCamera();

    if (image) {
      setSelectedImage(image.assets[0].base64);
    }
  }

  function onDeleteButtonPress() {
    setModalMessage('Apakah Anda yakin untuk menghapus barang?');
    setModalType('alert');
    setModalVisible(true);
  }

  function deleteProduct() {
    setModalType('loading');
    ADMIN_DELETE_PRODUCT(data?.productQuantity, data?.productId)
      .then(() => {
        setModalType('success');
        setModalMessage('Data berhasil dihapus!');
      })
      .catch(err => {
        setModalType('warning');
        setModalMessage('Data gagal dihapus!');
      });
  }

  function updateProduct() {
    setModalType('loading');
    setModalVisible(true);

    const updated_data = {
      productName: inputName,
      productDescription: inputDescription,
      productCode: inputCode,
      productQuantity: Number(inputQty),
      productPic: selectedImage,
    };

    ADMIN_UPDATE_PRODUCT(data?.productId, updated_data)
      .then(() => {
        // setModalType('success');
        // setModalMessage('Perubahan berhasil disimpan!');
        // console.log('Write Success');
        doReport();
      })
      .catch(e => {
        setModalType('warning');
        setModalMessage('Perubahan gagal disimpan!');
      });
  }

  function doReport() {
    function getDiff() {
      if (data?.productQuantity > inputQty) {
        const dif = Number(data?.productQuantity) - Number(inputQty);
        return {dif: dif, type: 'dec'};
      } else if (data?.productQuantity < inputQty) {
        const dif = Number(inputQty) - Number(data?.productQuantity);
        return {dif: dif, type: 'inc'};
      } else {
        return {dif: 0, type: 'inc'};
      }
    }

    const diff = getDiff().dif;
    const type = getDiff().type;

    ADMIN_ON_DATA_UPDATED(diff, type)
      .then(() => {
        console.log('Report updated');
        setModalType('success');
        setModalMessage('Perubahan berhasil disimpan!');
      })
      .catch(e => {
        setModalType('warning');
        setModalMessage('Perubahan gagal disimpan!');
      });
  }

  function createRequest() {
    const requestData = {
      requestName: 'Bapak Abdul',
      requestQty: randomNumber(1, Number(data?.productQuantity)),
    };
    USER_CREATE_REQUEST(data, requestData).then(() => {
      'request diterima';
    });
  }

  function handleModalButtonPress() {
    if (modalType == 'success') {
      setModalVisible(false);
      navigation.goBack();
    } else if (modalType == 'alert') {
      deleteProduct();
    } else {
      setModalVisible(false);
      console.log('...');
    }
  }

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <>
          <View style={styles.inputContainer}>
            <Text style={styles.textInputTitle}>Nama Barang</Text>
            <Input
              placeholder={'Masukan nama barang'}
              onChangeText={text => setInputName(text)}
              value={inputName}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.textInputTitle}>Deskripsi Barang</Text>
            <Input
              placeholder={'Masukan deskripsi barang'}
              onChangeText={text => setInputDescription(text)}
              value={inputDescription}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.textInputTitle}>Kode Barang</Text>
            <Input
              placeholder={'Masukan kode barang'}
              onChangeText={text => setInputCode(text)}
              value={inputCode}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.textInputTitle}>Jumlah Barang</Text>
            <Input
              placeholder={'Masukan jumlah barang'}
              keyboardType={'numeric'}
              onChangeText={text => setInputQty(text)}
              value={inputQty}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.textInputTitle}>
              Foto Barang ( tekan kembali untuk mengganti )
            </Text>
            <TouchableOpacity
              style={styles.mediaUplaodButton}
              activeOpacity={0.6}
              onPress={() => onMediaUploadButtonPress()}>
              {selectedImage.length ? (
                <Image
                  source={{uri: `data:image/png;base64,${selectedImage}`}}
                  style={styles.mediaUplaodButton}
                />
              ) : (
                <Icon name="camera" size={30} color={Colors.COLOR_WHITE} />
              )}
            </TouchableOpacity>
          </View>
        </>
      </ScrollView>

      <View style={styles.bottomContainer}>
        {/* <Button
          containerStyle={{marginBottom: 14}}
          buttonStyle={{backgroundColor: Colors.COLOR_SECONDARY}}
          title="Testing only buat permintaan"
          onPress={() => createRequest()}
        /> */}
        <Button
          containerStyle={{marginBottom: 14}}
          buttonStyle={{backgroundColor: Colors.COLOR_SECONDARY}}
          title="Hapus"
          onPress={() => onDeleteButtonPress()}
        />
        <Button
          disabled={
            !inputName?.length ||
            !inputDescription?.length ||
            !inputCode?.length ||
            !inputQty?.length
          }
          title="Simpan"
          onPress={() => updateProduct()}
        />
      </View>
      <BaseModal
        visible={modalVisible}
        type={modalType}
        message={modalMessage}
        onCameraButtonPress={() => onMediaCameraPressed()}
        onGalleryButtonPress={() => onMediaGalleryPressed()}
        onCancelButtonPress={() => setModalVisible(false)}
        onButtonPress={() => handleModalButtonPress()}
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

  inputContainer: {
    marginBottom: 16,
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

  //text styles

  textInputTitle: {
    color: Colors.COLOR_GRAY,
    fontSize: 14,
    fontWeight: 'normal',
    marginBottom: 8,
  },
});

export default EditDeleteProductScreen;
