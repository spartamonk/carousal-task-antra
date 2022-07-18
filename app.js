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
    #loading = true
    #update = true

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

      this.#loading = false
    }
    get loadingstatus() {
      return this.#loading
    }

    set loadingstatus(loading) {
      this.#loading = false
    }

    get updatestatus() {
      return this.#update
    }

    set updatestatus(update) {
      this.#update = update
    }
  }

  const { fetchMovies } = api
  return {
    fetchMovies,
    State,
    Movie,
  }
})(Api, View)

//* ~~~~~~~~~~~~~~~~~~~~~ Controller ~~~~~~~~~~~~~~~~~~~~~
const Controller = ((model) => {
  const state = new model.State()
  const getElement = (ele) => {
    const element = document.querySelector(ele)
    if (element) {
      return element
    } else {
      throw new Error(`Element selection ${ele} does not exist`)
    }
  }
  const slider = getElement('#movies-container')
  const btnLeft = getElement('.btn-left')
  const btnRight = getElement('.btn-right')
  const loader = getElement('.loading')
  // slider
  const init = () => {
    state.loadingstatus = true
    slider.style.visibility = 'none'
    loader.style.display = 'block'
    model.fetchMovies().then((movies) => {
      state.movielist = [...movies]
      state.loadingstatus = false
    })
    btnLeft.classList.add('btn-hidden')
    btnLeft.addEventListener('click', () => {
      slider.scrollLeft -= 300
    })
    btnRight.addEventListener('click', () => {
      slider.scrollLeft += 300
    })

    slider.addEventListener('scroll', () => {
      slider.scrollLeft <= 0
        ? btnLeft.classList.add('btn-hidden')
        : btnLeft.classList.remove('btn-hidden')
      slider.scrollWidth <= slider.offsetWidth + slider.scrollLeft
        ? btnRight.classList.add('btn-hidden')
        : btnRight.classList.remove('btn-hidden')
    })
    // autoplay slider
    
  }
  const disableLoader = () => {
    if (state.loadingstatus) return
    slider.style.display = 'flex'
    loader.style.display = 'none'
    btnLeft.style.display = 'inline'
    btnRight.style.display = 'inline'
    state.updatestatus = false
  }
  const bootstrap = () => {
    init()

    while (state.updatestatus) {
      disableLoader()
    }
  }
  return { bootstrap }
})(Model, View)

Controller.bootstrap()
