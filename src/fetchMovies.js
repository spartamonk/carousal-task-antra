// // ##### Fetch data
import { moviesUrl } from './utils.js'

const Api = (() => {
  const fetchMovies = () => {
    return fetch(moviesUrl).then((response) => {
      return response.json()
    })
  }
  return {
    fetchMovies,
  }
})()

export default Api
