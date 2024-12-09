export interface Album {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  images: {
    id: string;
    filename: string;
    title: string | null;
    mimeType: string;
    size: number;
    createdAt: string;
    url: string;
  }[];
  _count?: {
    images: number;
  };
}
