// // ##### Fetch data
const rootUrl = 'http://localhost:4232/movies'

const Api = (() => {
  const fetchMovies = () => {
    return fetch(rootUrl).then((response) => response.json())
  }

  return {
    fetchMovies,
  }
})()

//* ~~~~~~~~~~~~~~~~~~~~~ View ~~~~~~~~~~~~~~~~~~~~~

const View = (() => {
  const domstr = {
    moviesContainer: '#movies-container',
  }

  const render = (ele, tmp) => {
    ele.innerHTML = tmp
  }

  const createTmp = (arr) => {
    let tmp = ''
    arr.forEach((movie) => {
      tmp += `
        <article class="movie-card">
        <div class="img-container">
         <img src=${movie.imgUrl} alt=${movie.name} class="img movie-img" />
        </div>
        <div class="movie-info-container">
        <p class="movie-info">Movie: ${movie.name}</p>
        <p class="movie-info">Info: ${movie.outlineInfo}</p>
        </div>
          </article>
      `
    })

    return tmp
  }

  return {
    render,
    createTmp,
    domstr,
  }
})()

//* ~~~~~~~~~~~~~~~~~~~~~ Model ~~~~~~~~~~~~~~~~~~~~~
const Model = ((api, view) => {
  class Movie {
    constructor(id, imgUrl, name, outlineInfo) {
      this.id = id
      this.imgUrl = imgUrl
      this.name = name
      this.outlineInfo = outlineInfo
    }
  }

  class State {
    #movies = []

    get movielist() {
      return this.#movies
    }
    set movielist(movies) {
      this.#movies = [...movies]

      const moviesContainer = document.querySelector(
        view.domstr.moviesContainer
      )

      const tmp = view.createTmp(this.#movies)

      view.render(moviesContainer, tmp)
    }
  }

  const { fetchMovies } = api

  return {
    fetchMovies,
    State,
  }
})(Api, View)

//* ~~~~~~~~~~~~~~~~~~~~~ Controller ~~~~~~~~~~~~~~~~~~~~~
const Controller = ((model) => {
  const state = new model.State()
  // slider

  const init = () => {
    model.fetchMovies().then((movies) => {
      state.movielist = [...movies]
    })
    const slider = document.querySelector('#movies-container')
    const btnLeft = document.querySelector('.btn-left')
    const btnRight = document.querySelector('.btn-right')

    btnLeft.addEventListener('click', () => {
      slider.scrollLeft -= 300
    })

    btnRight.addEventListener('click', () => {
      slider.scrollLeft += 300
    })

    slider.addEventListener('scroll', () => {
      if (slider.scrollLeft <= 0) {
        btnLeft.classList.add('btn-hidden')
      } else {
        btnLeft.classList.remove('btn-hidden')
        if (slider.scrollWidth - 1 <= slider.offsetWidth + slider.scrollLeft) {
          btnRight.classList.add('btn-hidden')
        } else {
          btnRight.classList.remove('btn-hidden')
        }
      }
    })
  }
  const bootstrap = () => {
    init()
  }
  return { bootstrap }
})(Model, View)

Controller.bootstrap()
