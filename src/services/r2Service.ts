import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import sharp from 'sharp';
import dotenv from 'dotenv';

dotenv.config();

const accountId = process.env.R2_ACCOUNT_ID || '4628a8ac5700bdd4518fb941c0d74bb1';
const accessKeyId = process.env.R2_ACCESS_KEY_ID || '26e4927b10df2cac1a3f304464b7c33f';
const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY || '67c9895f6cb1723533a34752daf35656a7a0de2145054f526d34ff111df0ab77';
const bucketName = process.env.R2_BUCKET_NAME || 'imagesmelissa';
const endpoint = process.env.R2_ENDPOINT || `https://${accountId}.r2.cloudflarestorage.com`;

export const r2Client = new S3Client({
  region: 'auto',
  endpoint,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

/**
 * Optimizes an image buffer (compress to WebP/JPEG max 1600px width/height, 82% quality)
 */
export async function optimizeImage(buffer: Buffer): Promise<{ data: Buffer; contentType: string; ext: string }> {
  try {
    const optimized = await sharp(buffer)
      .rotate() // auto-orient based on EXIF
      .resize({
        width: 1600,
        height: 1600,
        fit: 'inside',
        withoutEnlargement: true,
      })
      .webp({ quality: 82, effort: 4 })
      .toBuffer();

    return {
      data: optimized,
      contentType: 'image/webp',
      ext: 'webp',
    };
  } catch (err) {
    console.warn('Sharp compression fallback to original buffer:', err);
    return {
      data: buffer,
      contentType: 'image/jpeg',
      ext: 'jpg',
    };
  }
}

/**
 * Uploads an image to Cloudflare R2 after automatic compression
 */
export async function uploadImageToR2(
  buffer: Buffer,
  folder: 'products' | 'events' | 'cafeteria' | 'general' = 'general',
  customFileName?: string
): Promise<{ key: string; url: string; originalSize: number; optimizedSize: number }> {
  const originalSize = buffer.length;
  const { data, contentType, ext } = await optimizeImage(buffer);
  const optimizedSize = data.length;

  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  const key = `${folder}/${timestamp}-${random}.${ext}`;

  await r2Client.send(
    new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      Body: data,
      ContentType: contentType,
      CacheControl: 'public, max-age=31536000, immutable',
    })
  );

  // Serve through local proxy route /r2/:key for instant high-speed zero-CORS serving
  const url = `/r2/${key}`;

  return {
    key,
    url,
    originalSize,
    optimizedSize,
  };
}

/**
 * Deletes an image from Cloudflare R2 given a key or full/relative URL
 */
export async function deleteImageFromR2(imageUrlOrKey: string): Promise<boolean> {
  if (!imageUrlOrKey) return false;

  let key = imageUrlOrKey;
  if (key.includes('/r2/')) {
    key = key.split('/r2/')[1];
  } else if (key.startsWith('http')) {
    try {
      const parsed = new URL(key);
      key = parsed.pathname.replace(/^\/+/, '');
      if (key.startsWith('r2/')) {
        key = key.substring(3);
      }
    } catch {
      // Keep key as is
    }
  }

  // Only delete if it belongs to our managed R2 folder structure
  if (!key || (!key.startsWith('products/') && !key.startsWith('events/') && !key.startsWith('cafeteria/') && !key.startsWith('general/'))) {
    return false;
  }

  try {
    await r2Client.send(
      new DeleteObjectCommand({
        Bucket: bucketName,
        Key: key,
      })
    );
    console.log(`🗑️ Successfully deleted from Cloudflare R2: ${key}`);
    return true;
  } catch (err: any) {
    console.warn(`Failed to delete ${key} from Cloudflare R2:`, err.message);
    return false;
  }
}

/**
 * Fetches an image stream from Cloudflare R2
 */
export async function getImageFromR2(key: string) {
  return await r2Client.send(
    new GetObjectCommand({
      Bucket: bucketName,
      Key: key,
    })
  );
}

