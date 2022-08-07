import EncryptedStorage from 'react-native-encrypted-storage';

export async function storeUserSession(data) {
  try {
    await EncryptedStorage.setItem('user_session', JSON.stringify(data));
  } catch (error) {
    // There was an error on the native side
    console.log('error: ' + error);
  }
}

export async function retrieveUserSession() {
  try {
    const session = await EncryptedStorage.getItem('user_session');

    if (session !== undefined) {
      return session;
    }
  } catch (error) {
    // There was an error on the native side
    console.log('error: ' + error);
  }
}

export async function removeUserSession() {
  try {
    await EncryptedStorage.removeItem('user_session');
    // Congrats! You've just removed your first value!
  } catch (error) {
    // There was an error on the native side
  }
}
