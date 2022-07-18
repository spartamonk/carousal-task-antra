// api url
const moviesUrl = 'http://localhost:4232/movies'

// get element
const getElement = (ele) => {
  const element = document.querySelector(ele)
  if (element) {
    return element
  } else {
    throw new Error(`Element selection ${ele} does not exist`)
  }
}

export { moviesUrl, getElement }
