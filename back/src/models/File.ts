import { prop, getModelForClass, modelOptions } from "@typegoose/typegoose";

@modelOptions({ schemaOptions: { timestamps: true } })
export class File {
  @prop({ required: true })
  name!: string;

  @prop({ required: true })
  size!: number;

  @prop({ required: true })
  type!: string;

  @prop({ required: true })
  url!: string;
}

export const FileModel = getModelForClass(File);
