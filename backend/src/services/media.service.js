import cloudinary from '../config/cloudinary.js';

export async function uploadBufferToCloudinary(fileBuffer, folder, resourceType = 'image') {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: resourceType },
      (error, result) => (error ? reject(error) : resolve(result))
    );
    stream.end(fileBuffer);
  });
}
