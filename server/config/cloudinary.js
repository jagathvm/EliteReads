import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
  secure: true,
});

const upload = async (file, folder) => {
  try {
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder,
          transformation: [
            {
              aspect_ratio: "1.0",
              width: 250,
              height: 400,
              crop: "fill",
              quality: "auto",
            },
          ],
        },
        (error, result) => {
          if (result) {
            resolve(result);
          } else {
            reject(error);
          }
        }
      );
      stream.end(file.buffer);
    });
    return result;
  } catch (error) {
    throw new Error(`Error uploading to cloudinary: ${error.message}`);
  }
};

const remove = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    throw new Error(`Error deleting from Cloudinary: ${error.message}`);
  }
};

export { upload, remove };
