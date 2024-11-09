import { upload, remove } from "../config/cloudinary.js";

// Upload images to Cloudinary and return uploaded image URLs
const uploadToCloudinary = async (images, folder) => {
  try {
    const cloudinaryResults = await Promise.all(
      images.map((file) => upload(file, folder))
    );
    return cloudinaryResults.map((result) => result.secure_url);
  } catch (error) {
    console.log(`Failed to upload images: ${error.message}`);
    throw new Error(`Failed to upload images: ${error.message}`);
  }
};

// Delete images from Cloudinary
const deleteFromCloudinary = async (imageUrls, folder) => {
  const deletePromises = await Promise.all(
    imageUrls.map(async (url) => {
      const publicId = url.split("/").slice(-1)[0].split(".")[0];
      try {
        await remove(`${folder}/${publicId}`);
      } catch (error) {
        console.error(
          `Failed to delete image with public ID ${publicId}: ${error}`
        );
      }
    })
  );

  return deletePromises;
};

export { uploadToCloudinary, deleteFromCloudinary };
