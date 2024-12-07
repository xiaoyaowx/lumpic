declare module 'exif-parser' {
  interface ExifTags {
    [key: string]: any;
    Make?: string;
    Model?: string;
    ExposureTime?: number;
    FNumber?: number;
    ISO?: number;
    DateTimeOriginal?: number;
    FocalLength?: number;
    LensModel?: string;
    GPSLatitude?: number;
    GPSLongitude?: number;
  }

  interface ExifResult {
    tags: ExifTags;
    imageSize: {
      width: number;
      height: number;
    };
    thumbnailOffset?: number;
    thumbnailLength?: number;
    thumbnailType?: number;
    app1Offset?: number;
  }

  interface Parser {
    parse(): ExifResult;
  }

  interface ExifParser {
    create(buffer: Buffer): Parser;
  }

  const parser: ExifParser;
  export default parser;
}
