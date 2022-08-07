import {getFocusedRouteNameFromRoute} from '@react-navigation/native';
import _ from 'lodash';
import moment from 'moment';
import 'moment/locale/id';

//get current datetime
export const GET_CURRENT_DATETIME = (format = '') => {
  return moment().locale('id').format(format);
};

//handle tabbar visibility
export const getIsTabBarVisible = route => {
  const routeName = getFocusedRouteNameFromRoute(route) ?? 'HomeInit';

  console.log(routeName);

  switch (routeName) {
    case 'HomeInit':
      return true;
    case 'ProductInit':
      return true;
    default:
      return false;
  }
};

export const randomNumber = (min = 0, max = 50) => {
  let num = Math.random() * (max - min) + min;

  return Math.round(num);
};

export const generateProductId = () => {
  const randNumber = randomNumber(1000, 9999);

  return `SRP${randNumber}`;
};

export const automateNumber = (number = '') => {
  //expecting number: '08XX' , '857', '628'

  const getIndexCode = number.slice(0, 3);

  if (getIndexCode == '628') {
    return true;
  } else {
    return false;
  }
};

export function validateEmail(email) {
  const res =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return res.test(String(email).toLowerCase());
}

export const validatePIN = (pin = '') => {
  const isnum = /^\d+$/.test(pin);

  return isnum;
};
