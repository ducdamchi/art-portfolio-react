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
    preview,
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
    this.preview = preview //string, src to preview video
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

function fetchSubDirAlbums(pathname, dir, subDirs, isHighlight) {
  const imgExtentions = ['.jpg', '.png', '.jpeg', '.JPG', '.PNG', '.JPEG']
  const subDirAlbums = []
  let album_id = 0
  let album_data

  // For each Album folder
  subDirs.forEach((subdir) => {
    album_id += 1
    const subdir_contents = fs.readdirSync(path.resolve(pathname, dir, subdir))
    let album = new Album(album_id)
    let album_imgs = []
    let img_count = 0

    //Locate info.json in content of each folder
    const json_file = subdir_contents.find((file) => file === 'info.json')
    if (json_file) {
      let json_path = path.resolve(pathname, dir, subdir, json_file)
      album_data = require(json_path)
      album.title = album_data.title
      album.year = album_data.year
      album.description = album_data.description
      album.captions = album_data.captions
      album.url = toDashedLowerCase(album_data.title)
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
        if (isHighlight) {
          album.isHighlight = true
        } else {
          album.isHighlight = false
        }

        // If img is thumbnail
        if (img.src.includes('thumb')) {
          img_count-- //exclude thumbnail from image
          img.id = `${album.id}.0`
          album.thumbnail = img
          // If img is part of series
        } else {
          img.id = `${album.id}.${img_count}`
          img.index = img_count - 1
          img.description = album.captions[img.index]
          // console.log(`${album.title}: ${img.description}`)
          album_imgs.push(img)
        }
      }

      if (content.includes('preview')) {
        let preview_path = path.join(pathname, dir, subdir, content)
        album.preview = preview_path
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
    album.viewTime = Math.round((img_count * 30) / 60 + 1) // 20 secs for each image + 1 min reading introduction
    album.imgList = album_imgs
    subDirAlbums.push(album)
  })
  return subDirAlbums
}

/* Given a path to a 'Photography' folder, 
read all its subfolders and return a list of Album objects 
@params: pathname, a string
@return: list of Album objects */
function fetchAlbums(pathname) {
  // Read all files and dirs that pathname led to
  const contents = fs.readdirSync(pathname)

  // Only pick directories, filter out files
  const dirs = contents.filter((content) =>
    fs.lstatSync(path.resolve(pathname, content)).isDirectory(),
  )
  let all_albums = []

  // For Highlight or Other folder
  dirs.forEach((dir) => {
    // Read all content of each folder
    const subdirs = fs.readdirSync(path.resolve(pathname, dir))

    // Only pick directories, filter out files
    const subdirs_filtered = subdirs.filter((subdir) =>
      fs.lstatSync(path.resolve(pathname, dir, subdir)).isDirectory(),
    )

    // Collect all albums in Highlights folder
    if (dir.includes('Highlights')) {
      const albums = fetchSubDirAlbums(pathname, dir, subdirs_filtered, true)
      all_albums = all_albums.concat(albums)

      // Collect all albums in Others folder
    } else {
      const albums = fetchSubDirAlbums(pathname, dir, subdirs_filtered, false)
      all_albums = all_albums.concat(albums)
    }
  })
  return all_albums
}

const all_albums = fetchAlbums('photography')
fs.writeFileSync(
  '/Users/ddam1/Desktop/Duc/CS Projects/personal-web-react/src/Components/Photography/albums.json',
  JSON.stringify(all_albums, null, 1),
)
