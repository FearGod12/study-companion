import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY,
});

interface CloudinaryUploadResult {
  public_id: string;
  url: string;
}

export async function uploadBase64Image(
  base64String: string,
  folder: string = 'Study Companion',
): Promise<CloudinaryUploadResult> {
  try {
    const result = await cloudinary.uploader.upload(base64String, {
      folder: folder,
      resource_type: 'auto',
    });
    return result;
  } catch (error) {
    console.error('Error uploading base64 image:', error);
    throw error;
  }
}

export async function deleteImage(publicId: string): Promise<void> {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error('Error deleting image:', error);
    throw error;
  }
}

export function getOptimizedUrl(
  publicId: string,
  options: object = {},
): string {
  return cloudinary.url(publicId, {
    fetch_format: 'auto',
    quality: 'auto',
    ...options,
  });
}

export function getTransformedUrl(
  publicId: string,
  options: object = {},
): string {
  return cloudinary.url(publicId, options);
}

// Example usage (can be removed in production)
async function exampleUsage() {
  try {
    // Example base64 string (this is a very small red dot, for demonstration purposes)
    const base64Image =
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAACklEQVR4nGMAAQAABQABDQottAAAAABJRU5ErkJggg==';

    // Upload a base64 image
    const uploadResult = await uploadBase64Image(base64Image);
    console.log('Upload result:', uploadResult);

    // Get optimized URL
    const optimizedUrl = getOptimizedUrl(uploadResult.public_id);
    console.log('Optimized URL:', optimizedUrl);

    // Get transformed URL (auto-crop to square)
    const autoCropUrl = getTransformedUrl(uploadResult.public_id, {
      crop: 'auto',
      gravity: 'auto',
      width: 500,
      height: 500,
    });
    console.log('Auto-cropped URL:', autoCropUrl);

    // Delete the uploaded image
    await deleteImage(uploadResult.public_id);
    console.log('Image deleted successfully');
  } catch (error) {
    console.error('Error in example usage:', error);
  }
}

// Uncomment the following line to run the example usage
// exampleUsage();
