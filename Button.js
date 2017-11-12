import React, { PropTypes } from 'react';
import { StyleSheet, TouchableOpacity, View, Text } from 'react-native';

const Button = ({ onPress, style, textStyle, text }) => (
  <TouchableOpacity
    onPress={onPress}
    style={[styles.button, style]}
  >
    <Text style={[styles.text, textStyle]}>{text}</Text>
  </TouchableOpacity>
);

Button.propTypes = {
  underlayColor: PropTypes.string,
  style: View.propTypes.style,
  textStyle: Text.propTypes.style,
  text: PropTypes.string.isRequired,
  onPress: PropTypes.func,
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: 'white',
    fontFamily: 'Avenir',
  },
});

export default Button;
