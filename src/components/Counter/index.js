import * as React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import {Colors} from '../../styles';

const Counter = ({maxCount = 100, minCount = 1}) => {
  const [count, setCount] = React.useState(Number(0));

  const _AddButton = () => {
    //count < maxCount ? setCount(count + 1) : null;
    setCount(count + 1);
  };

  const _MinButton = () => {
    //count > minCount ? setCount(count - 1) : null;
  };

  return (
    <View style={styles.counterContainer}>
      <TouchableOpacity
        style={styles.counterButton}
        onPress={() => _MinButton()}>
        <Text style={styles.counterText}>-</Text>
      </TouchableOpacity>
      <TextInput
        style={styles.counterInputContainer}
        onChangeText={text => setCount(text)}
        value={count}
      />
      <TouchableOpacity
        style={styles.counterButton}
        onPress={() => _AddButton()}>
        <Text style={styles.counterText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  counterContainer: {
    flexDirection: 'row',
  },

  counterButton: {
    height: 40,
    width: 40,
    backgroundColor: Colors.COLOR_SECONDARY,
    alignItems: 'center',
    justifyContent: 'center',
  },

  counterInputContainer: {
    color: Colors.COLOR_BLACK,
    fontSize: 16,
    height: 40,
    width: 60,
    textAlign: 'center',
    borderWidth: 0.5,
  },

  counterText: {
    fontSize: 20,
    color: Colors.COLOR_WHITE,
  },
});

export default Counter;
