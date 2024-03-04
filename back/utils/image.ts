import sharp from 'sharp';
import fs from 'fs';

export const uploadImage = async (file: any) => {
  const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
  const fileName = `image-${uniqueSuffix}`;

  const imageBuffer = await sharp(file)
    .resize({ width: 300, height: 300 }) // Resize the image (adjust dimensions as needed)
    .webp({})
    .toBuffer();

  const processedImageUrl = `/uploads/${fileName}.webp`;
  fs.writeFileSync('public' + processedImageUrl, imageBuffer);

  return processedImageUrl;
};
