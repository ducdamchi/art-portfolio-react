import fs from 'fs'
import path from 'path'
import { createRequire } from 'module'
const require = createRequire(import.meta.url)

/*************** CLASSES **************/
class Image {
  constructor(id, src, index, description) {
    this.id = id //str, unique id of the image within an album. Ex: 2.4 = album 2, image 4. exclude thumbnail.
    this.src = src //str, source of image
    this.index = index //int, for indexing purposes within an album
    this.description = description //str, description of the image
  }
}

class Album {
  constructor(
    id,
    title,
    year,
    description,
    captions,
    numImages,
    viewTime,
    isHighlight,
    thumbnail,
    url,
    imgList,
  ) {
    this.id = id //int, unique id of the album among all albums, starting from x.1
    this.title = title //string, tile of project
    this.year = year //string, year of project ('2018-2020', '2013-current', etc.)
    this.description = description //string, album description
    this.captions = captions // list of string, captions for each img
    this.numImages = numImages //int, number of images in the album, excluding the thumbnail
    this.viewTime = viewTime //int, minutes it takes to look through the album
    this.isHighlight = isHighlight //boolean, is the album put in the Highlights folder?
    this.thumbnail = thumbnail //Image object, store info about thumbnail. Has ID x.0
    this.url = url //url extention, for example: 'example-project-1' in 'abc.com/photo/example-project-1'
    this.imgList = imgList //list of Image objects
  }
}

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
    pressGallery,
    availability,
    previewLanding,
    previewThumbnail,
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
    this.pressGallery = pressGallery
    this.availability = availability
    this.previewLanding = previewLanding
    this.previewThumbnail = previewThumbnail
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

function fetchPressGallery(pathname, dir, subdir) {
  const imgExtentions = ['.jpg', '.png', '.jpeg', '.JPG', '.PNG', '.JPEG']
  // const subDirAlbums = []
  // let album_id = 0
  let album_data

  // For each Album folder
  // album_id += 1
  const subdir_contents = fs.readdirSync(path.resolve(pathname, dir, subdir))
  let album = new Album()
  let album_imgs = []
  let img_count = 0

  // Locate info.json in content of each folder
  const json_file = subdir_contents.find((file) => file === 'info.json')
  if (json_file) {
    let json_path = path.resolve(pathname, dir, subdir, json_file)
    album_data = require(json_path)
    album.title = album_data.title
    // album.year = album_data.year
    // album.description = album_data.description
    album.captions = album_data.captions
    // album.url = toDashedLowerCase(album_data.title)
  } else {
    console.log(`Warning: info.json not found for ${subdir}`)
  }

  // For each Image in the Album folder
  subdir_contents.forEach((content) => {
    // Check if content of dir has valid image extensions.
    if (
      json_file &&
      imgExtentions.some((extension) => content.includes(extension))
    ) {
      img_count += 1

      /* 
        The browser reads from project folder, so use path.join to create relative path 
        Ex: src="http://localhost:51xx/photography/Highlights/..."
        (instead of path.resolve, which will return absolute path)
         */
      let img_path = path.join(pathname, dir, subdir, content)
      // console.log(img_path)

      /* pathname/dir/subdir/content = ./photography/Highlights/ex2/DCD345.JPG */
      let img = new Image(0, img_path, null, '')

      // Set album isHighlight
      // if (isHighlight) {
      //   album.isHighlight = true
      // } else {
      //   album.isHighlight = false
      // }

      img.id = `${img_count}`
      img.index = img_count - 1
      img.description = album.captions[img.index]
      // console.log(`${album.title}: ${img.description}`)
      album_imgs.push(img)
    }
  })

  // Set album numImages and imgList
  album.numImages = img_count
  // For subdirs with a json file, check if number of imgs matches number of captions
  if (json_file) {
    if (album.numImages != album.captions.length) {
      console.log(
        `Warning: num imgs and captions mismatched for ${album.title}`,
      )
    }
  }
  // album.viewTime = Math.round((img_count * 30) / 60 + 1) // 20 secs for each image + 1 min reading introduction
  album.imgList = album_imgs
  // subDirAlbums.push(album)

  return album
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
        film.availability = film_data.availability
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

      if (content.includes('preview-landing')) {
        let preview_path_1 = path.join(pathname, dir, content)
        film.previewLanding = preview_path_1
      }

      if (content.includes('preview-thumbnail')) {
        let preview_path_2 = path.join(pathname, dir, content)
        film.previewThumbnail = preview_path_2
      }

      /* If found 'press_gallery' folder */
      if (content.includes('press_gallery')) {
        const gallery = fetchPressGallery(pathname, dir, content)
        film.pressGallery = gallery
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
