import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from "../services/cloudinaryServices.js";

// Upload images to Cloudinary and return uploaded image URLs
const uploadImagesToCloudinary = async (images, folder) => {
  try {
    const cloudinaryResults = await Promise.all(
      images.map((file) => uploadToCloudinary(file, folder))
    );
    return cloudinaryResults.map((result) => result.secure_url);
  } catch (error) {
    console.log(`Failed to upload images: ${error.message}`);
    throw new Error(`Failed to upload images: ${error.message}`);
  }
};

// Delete images from Cloudinary
const deleteImagesFromCloudinary = async (imageUrls, folder) => {
  await Promise.all(
    imageUrls.map(async (url) => {
      const publicId = url.split("/").slice(-1)[0].split(".")[0];
      try {
        await deleteFromCloudinary(`${folder}/${publicId}`);
      } catch (error) {
        console.error(
          `Failed to delete image with public ID ${publicId}: ${error}`
        );
      }
    })
  );
};

export { uploadImagesToCloudinary, deleteImagesFromCloudinary };
