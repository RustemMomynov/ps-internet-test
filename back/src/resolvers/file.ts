import { FileModel } from "../models/File";
import { uploadToS3 } from "../utils/s3";

export const fileResolvers = {
  Query: {
    getFiles: async () => {
      return await FileModel.find().sort({ createdAt: -1 }).lean();
    },
  },
  Mutation: {
    uploadFile: async (_: any, { input, file }: any) => {
      const { name, size, type } = input;

      // file = Promise<FileUpload>
      const { createReadStream, filename, mimetype } = await file;

      const stream = createReadStream();

      const chunks: Uint8Array[] = [];
      for await (const chunk of stream) {
        chunks.push(chunk);
      }

      const buffer = Buffer.concat(chunks);

      const s3Url = await uploadToS3(buffer, filename, mimetype);

      const saved = await FileModel.create({
        name,
        size,
        type,
        url: s3Url,
      });

      return saved.toObject();
    },
  },
};
