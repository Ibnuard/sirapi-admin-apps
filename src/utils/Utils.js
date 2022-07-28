import moment from 'moment';

//get current datetime
export const GET_CURRENT_DATETIME = (format = '') => {
  return moment().format(format);
};

//handle tabbar visibility
export const getIsTabBarVisible = route => {
  const routeName = route.state
    ? // Get the currently active route name in the tab navigator
      route.state.routes[route.state.index].name
    : // If state doesn't exist, we need to default to `screen` param if available, or the initial screen
      // In our case, it's "Feed" as that's the first screen inside the navigator
      route.params?.screen || 'HomeInit';

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
