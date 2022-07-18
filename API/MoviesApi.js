
// // ##### Fetch data
const rootUrl = 'http://localhost:4232/movies'
const Api = (() => {
  const fetchMovies = () => {
    return fetch(rootUrl).then((response) => {
      return response.json()
    })
  }
  return {
    fetchMovies,
  }
})()

export default Api