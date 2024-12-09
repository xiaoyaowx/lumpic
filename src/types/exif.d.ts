import { Prisma } from '@prisma/client';

export interface ExifData extends Prisma.JsonObject {
  make?: string;
  model?: string;
  exposureTime?: number;
  fNumber?: number;
  iso?: number;
  dateTimeOriginal?: number;
  focalLength?: number;
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
  [key: string]: string | number | undefined;
}
