
export type PageSize = 'a4' | 'letter' | 'legal' | 'a3' | 'fit';
export type Orientation = 'portrait' | 'landscape';
export type Margin = 'none' | 'small' | 'medium' | 'large';
export type ImageScale = 'fit' | 'fill' | 'original';

export interface ImageData {
  id: string;
  file: File;
  previewUrl: string;
  width: number;
  height: number;
  name: string;
}

export interface PDFSettings {
  pageSize: PageSize;
  orientation: Orientation;
  margin: Margin;
  imageScale: ImageScale;
  quality: number;
}
