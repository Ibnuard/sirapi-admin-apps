import * as React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {Button, Input} from '../../components';
import BaseModal from '../../components/Modal';
import {Colors} from '../../styles';
import {USER_REGISTER} from '../../utils/FirebaseUtils';
import {automateNumber, validateEmail} from '../../utils/Utils';

const UserSignupScreen = ({route, navigation}) => {
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [jabatan, setJabatan] = React.useState('');
  const [departemen, setDepartemen] = React.useState('');
  const [phoneNumber, setPhoneNumber] = React.useState('');
  const [password, setPassword] = React.useState('');

  const [modalVisible, setModalVisible] = React.useState(false);
  const [modalMessage, setModalMessage] = React.useState('');
  const [modalType, setModalType] = React.useState('loading');

  const onSignUpButtonPressed = async () => {
    setModalType('loading');
    setModalVisible(true);
    if (validateEmail(email)) {
      console.log('True');
      if (automateNumber(phoneNumber)) {
        const data = {
          fullname: name,
          email: email,
          jabatan: jabatan,
          departemen: departemen,
          phoneNumber: phoneNumber,
          password: password,
        };

        await USER_REGISTER(data)
          .then(() => {
            setModalMessage('Pendaftaran Berhasil!');
            setModalType('success');
          })
          .catch(err => {
            if (err == 'User Already Exist') {
              setModalMessage('Pengguna sudah terdaftar!');
              setModalType('warning');
            } else {
              setModalMessage('Pendafataran Gagal!');
              setModalType('warning');
            }
          });
      } else {
        setModalMessage('Format nomor telpon harus 628XX');
        setModalType('warning');
      }
    } else {
      setModalMessage('Format email salah!');
      setModalType('warning');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.textHello}>Daftar</Text>
      <View style={styles.input}>
        <Input
          placeholder={'Masukan Nama'}
          onChangeText={text => setName(text)}
          maxLength={128}
          value={name}
        />
      </View>
      <View style={styles.input}>
        <Input
          placeholder={'Masukan Email'}
          onChangeText={text => setEmail(text)}
          maxLength={128}
          value={email}
        />
      </View>
      <View style={styles.input}>
        <Input
          placeholder={'Masukan Nomor Telpon'}
          onChangeText={text => setPhoneNumber(text)}
          keyboardType={'phone-pad'}
          maxLength={16}
          value={phoneNumber}
        />
      </View>
      <View style={styles.input}>
        <Input
          placeholder={'Masukan Jabatan'}
          maxLength={64}
          onChangeText={text => setJabatan(text)}
          value={jabatan}
        />
      </View>
      <View style={styles.input}>
        <Input
          placeholder={'Departemen'}
          maxLength={64}
          onChangeText={text => setDepartemen(text)}
          value={departemen}
        />
      </View>
      <View style={styles.input}>
        <Input
          placeholder={'Masukan 6 Pin'}
          maxLength={6}
          securedTextEntry={true}
          keyboardType={'phone-pad'}
          onChangeText={text => setPassword(text)}
          value={password}
        />
      </View>
      <Button
        containerStyle={{marginTop: 24}}
        title={'Daftar'}
        onPress={() => onSignUpButtonPressed()}
      />
      <View style={styles.bottomContainer}>
        <Text>Sudah mempunyai akun?</Text>
        <TouchableOpacity
          activeOpacity={0.6}
          onPress={() => navigation.navigate('Auth')}>
          <Text style={styles.textDaftar}>Masuk</Text>
        </TouchableOpacity>
      </View>
      <BaseModal
        visible={modalVisible}
        type={modalType}
        message={modalMessage}
        onButtonPress={() => (
          setModalVisible(false),
          modalType == 'success' ? navigation.navigate('Auth') : null
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },

  input: {
    marginVertical: 8,
  },

  bottomContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginTop: 24,
  },

  //text style
  textHello: {
    fontSize: 24,
    fontWeight: 'bold',
  },

  textDaftar: {
    paddingHorizontal: 4,
    color: Colors.COLOR_SECONDARY,
    fontWeight: 'bold',
  },
});

export default UserSignupScreen;
