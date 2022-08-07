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
import {USER_CREATE_REQUEST} from '../../utils/FirebaseUtils';
import {randomNumber} from '../../utils/Utils';
import {retrieveUserSession} from '../../utils/UserUtils';

const RequestProductScreen = ({navigation, route}) => {
  const [modalVisible, setModalVisible] = React.useState(false);
  const [modalMessage, setModalMessage] = React.useState('');
  const [modalType, setModalType] = React.useState('loading');

  const [quantity, setQuantity] = React.useState();

  //EXISTING DATA
  const data = route?.params?.data;

  async function createRequest() {
    setModalType('loading');
    setModalVisible(true);

    const userSession = await retrieveUserSession();
    const parseJSON = JSON.parse(userSession);

    const requestData = {
      requestName: parseJSON?.fullname,
      requestEmail: parseJSON?.email,
      requestPhoneNumber: parseJSON?.phoneNumber,
      requestDepartemen: parseJSON?.departemen,
      requestJabatan: parseJSON?.jabatan,
      requestQty: Number(quantity),
    };

    if (Number(quantity) > data?.productQuantity) {
      setModalMessage(
        'Jumlah permintaan tidak boleh lebih dari ketersedian barang!',
      );
      setModalType('warning');
    } else {
      USER_CREATE_REQUEST(data, requestData)
        .then(() => {
          setModalMessage('Permintaan penarikan berhasil dikirim!');
          setModalType('success');
        })
        .catch(err => {
          setModalMessage('Permintaab penarikan gagal!');
          setModalType('warning');
        });
    }
  }

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <>
          <View style={{marginBottom: 18}}>
            <Text style={styles.textTitle}>Jumlah Permintaan Penarikan</Text>
            <Input
              placeholder={'Masukan jumlah permintaan'}
              keyboardType={'phone-pad'}
              onChangeText={text => setQuantity(text)}
              value={quantity}
            />
          </View>

          <Text style={styles.textTitle}>Detail Barang</Text>
          <View style={styles.inputContainer}>
            <Text style={styles.textInputTitle}>Nama Barang</Text>
            <Text style={styles.textInputValue}>{data?.productName}</Text>
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.textInputTitle}>Deskripsi Barang</Text>
            <Text style={styles.textInputValue}>
              {data?.productDescription}
            </Text>
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.textInputTitle}>Kode Barang</Text>
            <Text style={styles.textInputValue}>{data?.productCode}</Text>
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.textInputTitle}>Jumlah Barang Tersedia</Text>
            <Text style={styles.textInputValue}>{data?.productQuantity}</Text>
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.textInputTitle}>Foto Barang</Text>
            <View style={styles.mediaUplaodButton}>
              {data?.productPic?.length ? (
                <Image
                  source={{uri: `data:image/png;base64,${data?.productPic}`}}
                  style={styles.mediaUplaodButton}
                />
              ) : (
                <Icon name="box" size={30} color={Colors.COLOR_WHITE} />
              )}
            </View>
          </View>
        </>
      </ScrollView>

      <View style={styles.bottomContainer}>
        <Button
          disabled={!quantity}
          title="Buat permintaan"
          onPress={() => createRequest()}
        />
      </View>
      <BaseModal
        visible={modalVisible}
        type={modalType}
        message={modalMessage}
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
    marginTop: 4,
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
    fontSize: 12,
    fontWeight: 'normal',
    marginBottom: 4,
  },

  textTitle: {
    color: Colors.COLOR_BLACK,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },

  textInputValue: {
    color: Colors.COLOR_BLACK,
    fontSize: 14,
    fontWeight: 'normal',
    marginBottom: 8,
  },
});

export default RequestProductScreen;
