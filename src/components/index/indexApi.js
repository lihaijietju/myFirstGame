import axios from 'axios';

export default {
  getNotice: getNotice
};

function getNotice() {
  return axios.get('/getNoticeList');
}
