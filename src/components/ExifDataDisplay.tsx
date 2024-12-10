import React from 'react';
import { FaCamera, FaMapMarkerAlt, FaClock, FaCog, FaImage, FaRuler, FaExternalLinkAlt } from 'react-icons/fa';

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
  exposuretime: '曝光时间',
  fnumber: '光圈值',
  iso: 'ISO感光度',
  datetimeoriginal: '拍摄时间',
  focallength: '焦距',
  lensmodel: '镜头型号',
  gpslatitude: 'GPS 位置',
  width: '图片宽度',
  height: '图片高度',
  software: '处理软件',
  orientation: '方向',
  flash: '闪光灯',
  meteringmode: '测光模式',
  whitebalance: '白平衡',
  imagedescription: '图片描述',
  copyright: '版权信息'
};

const formatExifValue = (key: string, value: any): string => {
  if (value === undefined || value === null) return '';
  
  switch (key) {
    case 'exposuretime':
      const expTime = Number(value);
      if (expTime >= 1) return `${expTime}秒`;
      return `1/${Math.round(1/expTime)}秒`;
    case 'fnumber':
      return `f/${value}`;
    case 'focallength':
      return `${value}mm`;
    case 'iso':
      return `ISO ${value}`;
    case 'datetimeoriginal':
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

const exifGroups = {
  camera: ['make', 'model', 'lensmodel'],
  settings: ['exposuretime', 'fnumber', 'iso', 'focallength', 'flash', 'meteringmode', 'whitebalance'],
  metadata: ['datetimeoriginal', 'software', 'imagedescription', 'copyright'],
  dimensions: ['width', 'height', 'orientation'],
  location: ['gpslatitude']
};

const groupLabels: { [key: string]: string } = {
  camera: '相机信息',
  settings: '拍摄设置',
  metadata: '元数据',
  dimensions: '图片尺寸',
  location: '位置信息'
};

const ExifIcon = ({ type }: { type: string }) => {
  switch (type) {
    case 'make':
    case 'model':
    case 'lensmodel':
      return <FaCamera className="text-gray-500 mr-2" />;
    case 'gpslatitude':
      return <FaMapMarkerAlt className="text-gray-500 mr-2" />;
    case 'datetimeoriginal':
      return <FaClock className="text-gray-500 mr-2" />;
    case 'width':
    case 'height':
      return <FaRuler className="text-gray-500 mr-2" />;
    case 'imagedescription':
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

  // 将 EXIF 数据按组分类
  const groupedData: { [key: string]: { key: string; value: any }[] } = {};
  Object.entries(exifData).forEach(([key, value]) => {
    const lowerKey = key.toLowerCase();
    if (!exifLabels[lowerKey] || value === undefined || value === null) return;

    for (const [group, keys] of Object.entries(exifGroups)) {
      if (keys.includes(lowerKey)) {
        if (!groupedData[group]) groupedData[group] = [];
        groupedData[group].push({ key: lowerKey, value });
        break;
      }
    }
  });

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-semibold mb-6 text-gray-900">图片信息</h2>
      
      <div className="space-y-8">
        {Object.entries(groupedData).map(([group, items]) => (
          items.length > 0 && (
            <div key={group}>
              <h3 className="text-sm font-medium text-gray-500 mb-4 pb-2 border-b">
                {groupLabels[group]}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {items.map(({ key, value }) => {
                  if (key === 'gpslatitude' && exifData.gpsLongitude) {
                    const latitude = value ?? "Default Value";
                    return (
                      <div key="GPS" className="flex items-start space-x-2 p-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors duration-200">
                        <FaMapMarkerAlt className="text-blue-500 mt-1" />
                        <div className="flex-1 min-w-0">
                          <dt className="text-xs font-medium text-gray-600 truncate">
                            {exifLabels[key]}
                          </dt>
                          <dd className="mt-1 text-sm text-gray-900">
                            <a
                              href={`https://www.google.com/maps?q=${latitude},${exifData.gpsLongitude}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-500 hover:text-blue-600 hover:underline flex items-center gap-1"
                            >
                              <span className="truncate">{typeof latitude === 'number' ? latitude.toFixed(6) : 'N/A'}</span>
                              <span className="truncate">{typeof exifData.gpsLongitude === 'number' ? exifData.gpsLongitude.toFixed(6) : 'N/A'}</span>
                              <FaExternalLinkAlt className="text-xs flex-shrink-0" />
                            </a>
                          </dd>
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div key={key} className="flex items-start space-x-2 p-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors duration-200">
                      <ExifIcon type={key} />
                      <div className="flex-1 min-w-0">
                        <dt className="text-xs font-medium text-gray-600 truncate">
                          {exifLabels[key]}
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900 truncate">
                          {formatExifValue(key, value)}
                        </dd>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )
        ))}
      </div>
    </div>
  );
}
