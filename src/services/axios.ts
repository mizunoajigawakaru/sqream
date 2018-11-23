import Axios from 'axios'

export default Axios.create({
  headers: {
    Accept: 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
})
