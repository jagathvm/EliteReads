import cloudinary from "../config/cloudinary.js";

const uploadToCloudinary = async (file, folderName) => {
  try {
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: folderName,
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

const deleteFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    throw new Error(`Error deleting from Cloudinary: ${error.message}`);
  }
};

export { uploadToCloudinary, deleteFromCloudinary };
