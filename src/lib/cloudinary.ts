import { UploadApiResponse, v2 as cloudinary } from "cloudinary"

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_NAME_API_KEY,
  api_secret: process.env.CLOUDINARY_NAME_API_SECRET,
})

export const uploadImageBuffer = async ({
  buffer,
  folder,
}: {
  buffer: Buffer
  folder: string
}): Promise<UploadApiResponse | undefined> => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream({ folder }, (err, result) => {
        if (err) {
          reject(err)
          return
        }
        resolve(result)
      })
      .end(buffer)
  })
}

export const uploadImage = async ({
  filePath,
  folder,
}: {
  filePath: string
  folder: string
}) => {
  return await cloudinary.uploader.upload(filePath, {
    folder,
  })
}

export const deleteImage = async (publicId: string) => {
  return await cloudinary.uploader.destroy(publicId)
}
