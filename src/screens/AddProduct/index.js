import * as React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Image,
  TouchableOpacity,
} from 'react-native';
import {Button, Input} from '../../components';
import BaseModal from '../../components/Modal';
import {Colors} from '../../styles';
import Icon from 'react-native-vector-icons/Entypo';
import {getImageFromCamera, getImageFromGallery} from '../../utils/MediaUtils';
import {ADMIN_ADD_PRODUCT} from '../../utils/FirebaseUtils';

const AddProductScreen = ({navigation}) => {
  const [modalVisible, setModalVisible] = React.useState(false);
  const [modalMessage, setModalMessage] = React.useState('');
  const [modalType, setModalType] = React.useState('loading');

  const [selectedImage, setSelectedImage] = React.useState('');

  //input state
  const [inputName, setInputName] = React.useState('');
  const [inputDescription, setInputDescription] = React.useState('');
  const [inputCode, setInputCode] = React.useState('');
  const [inputQty, setInputQty] = React.useState(0);

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

  const addProduct = () => {
    setModalType('loading');
    setModalVisible(true);
    const data = {
      productName: inputName,
      productDescription: inputDescription,
      productCode: inputCode,
      productQuantity: inputQty,
      productPic: selectedImage,
    };
    ADMIN_ADD_PRODUCT(data)
      .then(() => {
        setModalType('success');
        setModalMessage('Barang berhasil ditambahkan.');
        console.log('Write Success');
      })
      .catch(e => {
        setModalType('warning');
        setModalMessage(e?.message);
        console.log('Write Failed : ' + e.message);
      });
  };

  return (
    <View style={styles.container}>
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
      <View style={styles.bottomContainer}>
        <Button title="Tambah" onPress={() => addProduct()} />
      </View>
      <BaseModal
        visible={modalVisible}
        type={modalType}
        message={modalMessage}
        onCameraButtonPress={() => onMediaCameraPressed()}
        onGalleryButtonPress={() => onMediaGalleryPressed()}
        onButtonPress={() => (
          setModalVisible(false),
          modalType == 'success' ? navigation.goBack() : null
        )}
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

export default AddProductScreen;
