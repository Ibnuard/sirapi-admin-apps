import {getFocusedRouteNameFromRoute} from '@react-navigation/native';
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

const genArr = (data = []) => {
  const resultTest = {};
  const result = [];

  data.forEach(item => {
    if (resultTest[item?.yr]) {
      const index = resultTest[item?.yr] - 1;
      const foundItem = result[index];

      const newValue = {
        ...foundItem,
        qt: foundItem.qt + item.qt,
      };

      result[index] = newValue;
    } else {
      resultTest[item.yr] = result.length + 1;
      result.push(item);
    }
  });

  console.log(result);
};

export async function sendNotificationToUser(token, title, message) {
  await fetch('https://fcm.googleapis.com/fcm/send', {
    headers: {
      Authorization:
        'key=AAAAkjprveY:APA91bEjH_FBKF33FlIZOuI8O4j7GLw390wZ0fH3Vqtl1GzNGPn1nlo5Yal3xurPKPhknaluw6Fh3uYNDOT08UYKB8C7WAIKryP5DGphzjUV8apGpT03EM95hKhBJK1qDOlQW7Zs3VwE',
      'Content-Type': 'application/json,',
    },
    body: {
      registration_ids: token,
      notification: {
        title: title,
        body: message,
        image: '',
      },
      data: {},
    },
  })
    .then(response => response.json())
    .then(responseJson => {
      console.log('Sukses : ' + JSON.stringify(responseJson));
    })
    .catch(err => {
      console.log('Gagal : ' + JSON.stringify(err));
    });
}
