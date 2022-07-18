// import Api
import MoviesApi from './src/fetchMovies.js'
// getElement
import {getElement} from './src/utils.js'

//* ~~~~~~~~~~~~~~~~~~~~~ View ~~~~~~~~~~~~~~~~~~~~~

const View = (() => {
  const domstr = {
    moviesContainer: '#movies-container',
  }
  const container = document.querySelector('.container')
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
  const createBtns = () => {
    const prevBtn = document.createElement('button')
    const nextBtn = document.createElement('button')
    prevBtn.innerHTML = `<span>&#60;</span>`
    prevBtn.className = 'btn btn-left'
    nextBtn.innerHTML = `<span>&#62;</span>`
    nextBtn.className = 'btn btn-right'
    container.insertBefore(prevBtn, container.firstChild)
    container.insertBefore(nextBtn, container.lastChild)
    return {
      prevBtn,
      nextBtn,
    }
  }

  return {
    render,
    createTmp,
    domstr,
    createBtns,
  }
})()

//* ~~~~~~~~~~~~~~~~~~~~~ Model ~~~~~~~~~~~~~~~~~~~~~
const Model = ((api, view) => {
  class State {
    #movies = []
    #btns = view.createBtns()
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
    get buttons() {
      return this.#btns
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
  }
})(MoviesApi, View)

//* ~~~~~~~~~~~~~~~~~~~~~ Controller ~~~~~~~~~~~~~~~~~~~~~
const Controller = ((model) => {
  const state = new model.State()

  const slider = getElement('#movies-container')
  const { nextBtn, prevBtn } = state.buttons

  const btnLeft = prevBtn
  const btnRight = nextBtn
  
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

      slider.scrollWidth <= slider.offsetWidth + slider.scrollLeft +1
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
