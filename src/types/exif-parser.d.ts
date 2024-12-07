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

  interface ExifData {
    [key: string]: any; 
    make?: string;
    model?: string;
    exposureTime?: string;
    fNumber?: string;
    iso?: number;
    dateTimeOriginal?: string;
    focalLength?: string;
    lensModel?: string;
    gpsLatitude?: number;
    gpsLongitude?: number;
    width?: number;
    height?: number;
    software?: string;
    orientation?: number;
    flash?: number;
    meteringMode?: string;
    whiteBalance?: string;
    imageDescription?: string;
    copyright?: string;
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
