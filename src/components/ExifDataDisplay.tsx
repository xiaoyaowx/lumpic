import React from 'react';
import { FaCamera, FaMapMarkerAlt, FaClock, FaCog, FaImage, FaRuler } from 'react-icons/fa';

interface ExifData {
  make?: string;
  model?: string;
  exposureTime?: string | number;
  fNumber?: number;
  iso?: number;
  dateTimeOriginal?: string | number;
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
  [key: string]: any;
}

interface ExifDataDisplayProps {
  exifData: ExifData | null;
}

const exifLabels: { [key: string]: string } = {
  make: '相机制造商',
  model: '相机型号',
  exposureTime: '曝光时间',
  fNumber: '光圈值',
  iso: 'ISO感光度',
  dateTimeOriginal: '拍摄时间',
  focalLength: '焦距',
  lensModel: '镜头型号',
  gpsLatitude: 'GPS 位置',
  width: '图片宽度',
  height: '图片高度',
  software: '处理软件',
  orientation: '方向',
  flash: '闪光灯',
  meteringMode: '测光模式',
  whiteBalance: '白平衡',
  imageDescription: '图片描述',
  copyright: '版权信息'
};

const formatExifValue = (key: string, value: any): string => {
  if (value === undefined || value === null) return '';
  
  switch (key) {
    case 'exposureTime':
      const expTime = Number(value);
      if (expTime >= 1) return `${expTime}秒`;
      return `1/${Math.round(1/expTime)}秒`;
    case 'fNumber':
      return `f/${value}`;
    case 'focalLength':
      return `${value}mm`;
    case 'iso':
      return `ISO ${value}`;
    case 'dateTimeOriginal':
      if (typeof value === 'number') {
        return new Date(value * 1000).toLocaleString();
      }
      return new Date(value).toLocaleString();
    case 'width':
    case 'height':
      return `${value}px`;
    case 'flash':
      return value === 0 ? '未使用' : '已使用';
    case 'orientation':
      const orientations = ['正常', '水平翻转', '旋转180°', '垂直翻转', '左转90°', '右转90°'];
      return orientations[value - 1] || `${value}`;
    default:
      return value.toString();
  }
};

const ExifIcon = ({ type }: { type: string }) => {
  switch (type) {
    case 'make':
    case 'model':
    case 'lensModel':
      return <FaCamera className="text-gray-500 mr-2" />;
    case 'gpsLatitude':
      return <FaMapMarkerAlt className="text-gray-500 mr-2" />;
    case 'dateTimeOriginal':
      return <FaClock className="text-gray-500 mr-2" />;
    case 'width':
    case 'height':
      return <FaRuler className="text-gray-500 mr-2" />;
    case 'imageDescription':
    case 'copyright':
      return <FaImage className="text-gray-500 mr-2" />;
    default:
      return <FaCog className="text-gray-500 mr-2" />;
  }
};

export default function ExifDataDisplay({ exifData }: ExifDataDisplayProps) {
  if (!exifData || Object.keys(exifData).length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4">EXIF 信息</h2>
        <p className="text-gray-500">无 EXIF 数据</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-semibold mb-4">EXIF 信息</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {Object.entries(exifData).map(([key, value]) => {
          const lowerKey = key.toLowerCase();
          if (!exifLabels[lowerKey] || !value) return null;

          if (lowerKey === 'gpslatitude' && exifData.gpsLongitude) {
            return (
              <div key="GPS" className="flex items-start space-x-2">
                <FaMapMarkerAlt className="text-gray-500 mt-1" />
                <div className="flex-1">
                  <dt className="text-sm font-medium text-gray-500">
                    {exifLabels['gpsLatitude']}
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    <a
                      href={`https://www.google.com/maps?q=${exifData.gpsLatitude},${exifData.gpsLongitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:text-blue-600"
                    >
                      {exifData.gpsLatitude.toFixed(6)}, {exifData.gpsLongitude.toFixed(6)}
                    </a>
                  </dd>
                </div>
              </div>
            );
          }

          return (
            <div key={key} className="flex items-start space-x-2">
              <ExifIcon type={lowerKey} />
              <div className="flex-1">
                <dt className="text-sm font-medium text-gray-500">
                  {exifLabels[lowerKey]}
                </dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {formatExifValue(lowerKey, value)}
                </dd>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
