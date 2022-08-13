import * as React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Button, Input} from '../../components';
import BaseModal from '../../components/Modal';
import {Colors} from '../../styles';
import {USER_DETAIL, USER_UPDATE_PIN} from '../../utils/FirebaseUtils';
import {retrieveUserSession} from '../../utils/UserUtils';
import {automateNumber, cencorNumber} from '../../utils/Utils';

const ForgotPinScreen = ({navigation}) => {
  const [user, setUser] = React.useState();
  const [phoneNumber, setPhoneNumber] = React.useState();
  const [email, setEmail] = React.useState('');
  const [pin, setPin] = React.useState();
  const [step, setStep] = React.useState(0);

  const [modalVisible, setModalVisible] = React.useState(false);
  const [modalMessage, setModalMessage] = React.useState('');
  const [modalType, setModalType] = React.useState('loading');

  async function onContinueButtonPressed() {
    setModalType('loading');
    setModalVisible(true);
    if (automateNumber(phoneNumber)) {
      const data = {
        phoneNumber: phoneNumber,
      };

      await USER_DETAIL(data)
        .then(data => {
          if (data) {
            setUser(data);
            setModalVisible(false);
            setStep(step + 1);
          }
        })
        .catch(err => {
          setModalMessage(err);
          setModalType('warning');
        });
    } else {
      setModalMessage('Format nomor telpon harus 628XXX');
      setModalType('warning');
    }
  }

  function onConfirmButtonPressed() {
    if (user?.email == email) {
      setStep(step + 1);
    } else {
      setModalType('warning');
      setModalMessage('Email yang anda masukan tidak sesuai!');
      setModalVisible(true);
    }
  }

  async function onDoneButtonPressed() {
    setModalType('loading');
    setModalVisible(true);

    const data = {
      phoneNumber: phoneNumber,
      pin: pin,
    };

    await USER_UPDATE_PIN(data)
      .then(() => {
        setModalMessage('Ubah PIN sukses!');
        setModalType('success');
      })
      .catch(err => {
        setModalMessage('Ubah PIN gagal!');
        setModalType('warning');
      });
  }

  function renderMain() {
    if (step == 0) {
      return _renderFirstStep();
    } else if (step == 1) {
      return _renderSecondStep();
    } else {
      return _renderThirdStep();
    }
  }

  function _renderFirstStep() {
    return (
      <View style={styles.container}>
        <View style={{alignItems: 'center', marginBottom: 24}}>
          <Text>Masukan nomor telpon</Text>
        </View>
        <Input
          placeholder={'Masukan Nomor Telpon'}
          onChangeText={text => setPhoneNumber(text)}
          maxLength={16}
          value={phoneNumber}
        />
        <View style={{marginTop: 32}}>
          <Button title="Lanjut" onPress={() => onContinueButtonPressed()} />
        </View>
      </View>
    );
  }

  function _renderSecondStep() {
    return (
      <View style={styles.container}>
        <View style={{alignItems: 'center', marginBottom: 24}}>
          <Text>Masukan email untuk melanjutkan</Text>
        </View>
        <Input
          placeholder={'Masukan Email'}
          onChangeText={text => setEmail(text)}
          maxLength={64}
          value={email}
        />
        <View style={{marginTop: 32}}>
          <Button title="Konfirmasi" onPress={() => onConfirmButtonPressed()} />
        </View>
      </View>
    );
  }

  function _renderThirdStep() {
    return (
      <View style={styles.container}>
        <View style={{alignItems: 'center', marginBottom: 24}}>
          <Text>Buat PIN baru</Text>
        </View>
        <Input
          placeholder={'Masukan PIN Baru'}
          onChangeText={text => setPin(text)}
          keyboardType={'phone-pad'}
          maxLength={6}
          value={pin}
        />
        <View style={{marginTop: 32}}>
          <Button title="Selesai" onPress={() => onDoneButtonPressed()} />
        </View>
      </View>
    );
  }

  return (
    <>
      {renderMain()}
      <BaseModal
        visible={modalVisible}
        type={modalType}
        message={modalMessage}
        onButtonPress={() => (
          setModalVisible(false),
          modalType == 'success' ? navigation.goBack() : null
        )}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.COLOR_WHITE,
    padding: 24,
    justifyContent: 'center',
  },

  //text styles
  textNumber: {
    fontSize: 18,
    color: Colors.COLOR_BLACK,
    fontWeight: 'bold',
  },
});

export default ForgotPinScreen;
