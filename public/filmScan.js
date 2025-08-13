import fs from 'fs'
import path from 'path'
import { createRequire } from 'module'
const require = createRequire(import.meta.url)

/*************** CLASSES **************/
class Film {
  constructor(
    id,
    title,
    year,
    director,
    runtime,
    country,
    language,
    synopsis,
    recognition,
    screenings,
    poster,
    thumbnail,
    youtube,
    url,
    logo,
  ) {
    this.id = id //int, unique id of each film, starting from 1
    this.title = title //str, tile of project
    this.year = year //str, year of release
    this.director = director //str, director's name
    this.runtime = runtime //str, runtime in minutes
    this.country = country //str, list of production countries
    this.language = language //str, languages spoken
    this.synopsis = synopsis //str, synopsis
    this.recognition = recognition //str, awards, nominations, etc.
    this.screenings = screenings //str, past screenings
    this.poster = poster //str, src to film poster
    this.thumbnail = thumbnail //str, src to film thumbnail
    this.youtube = youtube //link to a youtube video. right now, either trailer or full film
    this.url = url //url extention, for example: 'example-project-1' in 'abc.com/photo/example-project-1'
    this.logo = logo //str, src to logos from film festivals
  }
}

function toDashedLowerCase(str) {
  return str
    .trim() // Remove leading/trailing whitespace
    .toLowerCase() // Convert to lowercase
    .replace(/\s+/g, '-') // Replace whitespace with dashes
    .replace(/[^a-z0-9-]/g, '') // Remove special characters (optional)
    .replace(/-+/g, '-') // Replace multiple dashes with single dash
    .replace(/^-|-$/g, '') // Remove leading/trailing dashes
}

/* Given a path to a 'Film' folder, 
read all its subfolders and return a list of Film objects 
@params: pathname, a string
@return: list of Film objects */
function fetchFilms(pathname) {
  let all_films = []
  let film_id = 0
  const imgExtentions = ['.jpg', '.png', '.jpeg', '.JPG', '.PNG', '.JPEG']

  /* Read all files and dirs that pathname led to */
  const contents = fs.readdirSync(pathname)

  /* Only pick directories, filter out files */
  const dirs = contents.filter((content) =>
    fs.lstatSync(path.resolve(pathname, content)).isDirectory(),
  )

  /* For each Film folder */
  dirs.forEach((dir) => {
    film_id += 1
    let film = new Film(film_id)

    /* Read content of each folder */
    const dir_contents = fs.readdirSync(path.resolve(pathname, dir))

    /* For each content in a film folder */
    dir_contents.forEach((content) => {
      /* If content is the info.json file, extract film metadata */
      if (content.includes('info.json')) {
        const json_path = path.resolve(pathname, dir, 'info.json')
        const film_data = require(json_path)
        film.title = film_data.title
        film.year = film_data.year
        film.director = film_data.director
        film.runtime = film_data.runtime
        film.duration = film_data.duration
        film.country = film_data.country
        film.language = film_data.language
        film.synopsis = film_data.synopsis
        film.recognition = film_data.recognition
        film.screenings = film_data.screenings
        film.youtube = film_data.youtube
        film.url = toDashedLowerCase(film_data.title) + `-${film_data.year}`
      }

      /* If content is an image file, it can be either the poster or thumbnail. Extract path to each*/
      if (imgExtentions.some((extension) => content.includes(extension))) {
        if (content.includes('poster')) {
          let poster_path = path.join(pathname, dir, content)
          film.poster = poster_path
        } else if (content.includes('thumb')) {
          let thumbnail_path = path.join(pathname, dir, content)
          film.thumbnail = thumbnail_path
        } else if (content.includes('logo')) {
          let logo_path = path.join(pathname, dir, content)
          film.logo = logo_path
        }
      }
    })
    all_films.push(film)
  })
  return all_films
}

const all_films = fetchFilms('film')
fs.writeFileSync(
  '/Users/ddam1/Desktop/Duc/CS Projects/personal-web-react/src/Components/Film/films.json',
  JSON.stringify(all_films, null, 1),
)
