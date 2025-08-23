import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import multer from "multer";
import sharp from "sharp";

const s3 = new S3Client({
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com/`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
  region: "auto",
});

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // Limit file size to 5MB
  },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  },
});

const uploadAvatar = async (file: Express.Multer.File, userId: string, currentUrl?: string): Promise<string> => {
  if (!file) {
    throw new Error("No file provided.");
  }

  const processedImage = await sharp(file.buffer)
    .resize(512, 512)
    .jpeg({ quality: 80 }) // Convert to JPEG with 80% quality
    .toBuffer();

  const filePath = `avatars/${userId}/profile.jpeg`;

  const uploadParams = {
    Bucket: process.env.R2_BUCKET_NAME!,
    Key: filePath,
    Body: processedImage,
    ContentType: "image/jpeg",
  };

  await s3.send(new PutObjectCommand(uploadParams));

  let version = 1;
  if (currentUrl) {
    const url = new URL(currentUrl);
    const vParam = url.searchParams.get("v");
    if (vParam) {
      version = parseInt(vParam, 10) + 1;
    }
  }

  return `${process.env.R2_PUBLIC_URL}/${filePath}?v=${version}`;
};

export default {
  upload,
  uploadAvatar,
};