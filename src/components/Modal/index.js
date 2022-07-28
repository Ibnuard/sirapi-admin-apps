import * as React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import Modal from 'react-native-modal';
import {ActivityIndicator} from 'react-native-paper';
import Button from '../Button/component';
import Icon from 'react-native-vector-icons/Entypo';
import {COLOR_WHITE} from '../../styles/Colors';
import {Colors} from '../../styles';

const BaseModal = ({
  visible,
  message,
  type = 'loading',
  onButtonPress,
  onGalleryButtonPress,
  onCameraButtonPress,
  onCancelButtonPress,
}) => {
  function _renderLoadingModal() {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator />
      </View>
    );
  }

  function _renderWarningModal() {
    return (
      <View style={styles.warningContainer}>
        <Icon name="warning" size={36} />
        <Text style={styles.textWarning}>{message ?? 'Ini pesan warning'}</Text>
        <Button title="Ok" onPress={onButtonPress} />
      </View>
    );
  }

  function _renderWarningDecisionModal() {
    return (
      <View style={styles.warningContainer}>
        <Icon name="warning" size={36} />
        <Text style={styles.textWarning}>{message ?? 'Ini pesan warning'}</Text>
        <Button title="Ok" onPress={onButtonPress} />
        <TouchableOpacity
          style={styles.cancelButton}
          activeOpacity={0.6}
          onPress={onCancelButtonPress}>
          <Text style={styles.textCancel}>Batal</Text>
        </TouchableOpacity>
      </View>
    );
  }

  function _renderSuccessModal() {
    return (
      <View style={styles.warningContainer}>
        <Icon name="direction" size={36} />
        <Text style={styles.textWarning}>{message ?? 'Ini pesan warning'}</Text>
        <Button title="Ok" onPress={onButtonPress} />
      </View>
    );
  }

  function _renderMediaUploadModal() {
    return (
      <View style={styles.mediaUploadContainer}>
        <Button
          containerStyle={styles.buttonStyle}
          title={'Pilih dari geleri'}
          onPress={onGalleryButtonPress}
        />
        <Button
          containerStyle={styles.buttonStyle}
          buttonStyle={styles.secondaryButtonStyle}
          title={'Ambil dari kamera'}
          onPress={onCameraButtonPress}
        />
        <TouchableOpacity
          style={styles.cancelButton}
          activeOpacity={0.6}
          onPress={onButtonPress}>
          <Text style={styles.textCancel}>Batal</Text>
        </TouchableOpacity>
      </View>
    );
  }

  function selector() {
    switch (type) {
      case 'loading':
        return _renderLoadingModal();
        break;
      case 'warning':
        return _renderWarningModal();
        break;
      case 'success':
        return _renderSuccessModal();
        break;
      case 'mediaupload':
        return _renderMediaUploadModal();
        break;
      case 'alert':
        return _renderWarningDecisionModal();
        break;
      default:
        break;
    }
  }

  return (
    <Modal isVisible={visible}>
      <View style={styles.container}>{selector()}</View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  buttonStyle: {
    marginVertical: 8,
  },

  secondaryButtonStyle: {
    backgroundColor: Colors.COLOR_SECONDARY,
  },

  mediaUploadContainer: {
    width: '100%',
    backgroundColor: Colors.COLOR_WHITE,
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
  },

  cancelButton: {
    marginTop: 16,
  },

  warningContainer: {
    width: '100%',
    backgroundColor: COLOR_WHITE,
    alignItems: 'center',
    padding: 24,
    borderRadius: 12,
  },

  //textStyle

  textWarning: {
    fontSize: 14,
    marginTop: 8,
    marginBottom: 16,
  },

  textCancel: {
    color: Colors.COLOR_RED,
  },

  textAlertCancel: {
    color: Colors.COLOR_RED,
    marginTop: 18,
  },
});

export default BaseModal;
