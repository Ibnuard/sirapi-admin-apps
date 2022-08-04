import {GET_CURRENT_DATETIME} from './Utils';

export const MONTH_LIST = sortByCurrentMonth => {
  const ml = [
    {
      id: 0,
      name: 'Januari',
      sub: 'Jan',
    },
    {
      id: 1,
      name: 'Februari',
      sub: 'Feb',
    },
    {
      id: 2,
      name: 'Maret',
      sub: 'Mar',
    },
    {
      id: 3,
      name: 'April',
      sub: 'Apr',
    },
    {
      id: 4,
      name: 'Mei',
      sub: 'Mei',
    },
    {
      id: 5,
      name: 'Juni',
      sub: 'Jun',
    },
    {
      id: 6,
      name: 'Juli',
      sub: 'Jul',
    },
    {
      id: 7,
      name: 'Agustus',
      sub: 'Agu',
    },
    {
      id: 8,
      name: 'September',
      sub: 'Sep',
    },
    {
      id: 9,
      name: 'Oktober',
      sub: 'Okt',
    },
    {
      id: 10,
      name: 'November',
      sub: 'Nov',
    },
    {
      id: 11,
      name: 'Desember',
      sub: 'Des',
    },
  ];

  const currentMonth = Number(GET_CURRENT_DATETIME().split('-')[1]) - 1;

  let temp = [];
  if (sortByCurrentMonth) {
    for (let i = currentMonth; i < ml.length; i++) {
      temp.push(ml[i]);
    }

    if (temp.length) {
      for (let i = 0; i < currentMonth; i++) {
        temp.push(ml[i]);
      }
    }
  } else {
    for (let i = 0; i < ml.length; i++) {
      temp.push(ml[i]);
    }
  }

  return temp;
};
