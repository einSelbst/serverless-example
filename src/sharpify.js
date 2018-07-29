// @ts-check
import sharp from 'sharp'

const options = { all: [] }

/**
 * @param {Buffer} [image] - S3 Image blob
 * @param {any} [options] - Options
 * @param {Array<{key: string, width: number, height: number}>} [sizes] - The sizes we convert the image to
 */
export default async function sharpify (image, options, sizes) {
  
  const all = options.all;
  if (!image) throw new TypeError('sharpify() expects first parameter to be a valid image input.')

  const sharpedImage = sharp(image)

  /* preOperations are performed on the input image and shared across all the outputs */
  // Specifically we only perform a rotate here, but we keep the option of adding more
  // commands just by chasing the config file.
  all.forEach(([func, ...parameters]) => sharpedImage[func](...parameters))


  /* each output will produce a separate file */
  return Promise.all(
    sizes.map(async (size) => {
      const clone = await sharpedImage.clone()
      clone.resize(size.width, size.height)
        .jpeg({
          quality: 80,
          progressive: true,
          force: true,
        })
      return clone;
    })
  )
}
