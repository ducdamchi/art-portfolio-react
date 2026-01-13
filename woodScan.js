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

class Wood {
  constructor(
    id,
    title,
    description,
    year,
    dimensions,
    materials,
    thumbnail,
    numImages,
    imgList,
  ) {
    this.id = id //int, unique id of each wood project, starting from 1
    this.title = title //str
    this.description = description
    this.year = year //str
    this.dimensions = dimensions //str
    this.materials = materials //str
    this.thumbnail = thumbnail
    this.numImages = numImages
    this.imgList = imgList //list of Image objects
  }
}

/* Given a path to a 'Wood' folder, 
read all its subfolders and return a list of Wood objects 
@params: pathname, a string
@return: list of Film objects */
function fetchWood(pathname) {
  let all_wood = []
  let id = 0
  const imgExtentions = ['.jpg', '.png', '.jpeg', '.JPG', '.PNG', '.JPEG']

  /* Read all files and dirs that pathname led to */
  const contents = fs.readdirSync(pathname)

  /* Only pick directories, filter out files */
  const dirs = contents.filter((content) =>
    fs.lstatSync(path.resolve(pathname, content)).isDirectory(),
  )

  function toDashedLowerCase(str) {
    return str
      .trim() // Remove leading/trailing whitespace
      .toLowerCase() // Convert to lowercase
      .replace(/\s+/g, '-') // Replace whitespace with dashes
      .replace(/[^a-z0-9-]/g, '') // Remove special characters (optional)
      .replace(/-+/g, '-') // Replace multiple dashes with single dash
      .replace(/^-|-$/g, '') // Remove leading/trailing dashes
  }

  /* For each Wood folder */
  dirs.forEach((dir) => {
    id += 1
    let images = []
    let img_count = 0

    let wood = new Wood(id)

    /* Read content of each folder */
    const dir_contents = fs.readdirSync(path.resolve(pathname, dir))

    /* For each content in a wood folder */
    dir_contents.forEach((content) => {
      /* If content is the info.json file, extract wood metadata */
      if (content.includes('info.json')) {
        const json_path = path.resolve(pathname, dir, 'info.json')
        // console.log(json_path);
        const data = require(json_path)
        wood.title = data.title
        wood.description = data.description
        wood.year = data.year
        wood.dimensions = data.dimensions
        wood.materials = data.materials
        wood.url = toDashedLowerCase(data.title)
        wood.captions = data.captions
      }

      /* If content is an image file (poster), extract path */
      if (imgExtentions.some((extension) => content.includes(extension))) {
        img_count += 1
        let img_path = path.join(pathname, dir, content)

        let img = new Image(0, img_path, null, '')

        if (img.src.includes('thumb')) {
          img_count-- //exclude thumbnail from image
          img.id = `${wood.id}.0`
          wood.thumbnail = img
        } else {
          img.id = `${wood.id}.${img_count}`
          img.index = img_count - 1
          // img.description = wood.captions[img.index]
          // console.log(`${album.title}: ${img.description}`)
          images.push(img)
        }
      }
    })
    wood.numImages = img_count
    wood.imgList = images
    all_wood.push(wood)
  })
  return all_wood
}

const all_wood = fetchWood('./woodworking')
fs.writeFileSync(
  '/Users/ddam1/Desktop/Duc/CS Projects/personal-web-react/src/Components/Woodworking/wood.json',
  JSON.stringify(all_wood, null, 1),
)
