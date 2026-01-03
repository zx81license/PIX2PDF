
import { jsPDF } from 'jspdf';
import { ImageData, PDFSettings, PageSize, Margin } from '../types';

const PAGE_FORMATS: Record<Exclude<PageSize, 'fit'>, [number, number]> = {
  'a4': [210, 297],
  'a3': [297, 420],
  'letter': [215.9, 279.4],
  'legal': [215.9, 355.6],
};

const MARGIN_VALUES: Record<Margin, number> = {
  'none': 0,
  'small': 5,
  'medium': 15,
  'large': 25,
};

export const generatePDF = async (images: ImageData[], settings: PDFSettings, filename: string = 'Pix2PDF_Export'): Promise<void> => {
  return new Promise((resolve, reject) => {
    try {
      const { pageSize, orientation, margin, imageScale, quality } = settings;
      const docMargin = MARGIN_VALUES[margin];
      
      let doc: any;
      
      images.forEach((imgData, index) => {
        let pageWidth: number;
        let pageHeight: number;

        if (pageSize === 'fit') {
          pageWidth = imgData.width * 0.264583;
          pageHeight = imgData.height * 0.264583;
          
          if (index === 0) {
            doc = new jsPDF({
              orientation: pageWidth > pageHeight ? 'l' : 'p',
              unit: 'mm',
              format: [pageWidth, pageHeight],
            });
          } else {
            doc.addPage([pageWidth, pageHeight], pageWidth > pageHeight ? 'l' : 'p');
          }
        } else {
          const baseFormat = PAGE_FORMATS[pageSize as keyof typeof PAGE_FORMATS];
          pageWidth = orientation === 'portrait' ? baseFormat[0] : baseFormat[1];
          pageHeight = orientation === 'portrait' ? baseFormat[1] : baseFormat[0];
          
          if (index === 0) {
            doc = new jsPDF({
              orientation: orientation === 'portrait' ? 'p' : 'l',
              unit: 'mm',
              format: pageSize,
            });
          } else {
            doc.addPage(pageSize, orientation === 'portrait' ? 'p' : 'l');
          }
        }

        const usableWidth = pageWidth - (docMargin * 2);
        const usableHeight = pageHeight - (docMargin * 2);

        let drawWidth: number;
        let drawHeight: number;
        let x: number;
        let y: number;

        const imgRatio = imgData.width / imgData.height;
        const pageRatio = usableWidth / usableHeight;

        if (pageSize === 'fit') {
            drawWidth = pageWidth;
            drawHeight = pageHeight;
            x = 0;
            y = 0;
        } else if (imageScale === 'fit') {
          if (imgRatio > pageRatio) {
            drawWidth = usableWidth;
            drawHeight = usableWidth / imgRatio;
          } else {
            drawHeight = usableHeight;
            drawWidth = usableHeight * imgRatio;
          }
          x = docMargin + (usableWidth - drawWidth) / 2;
          y = docMargin + (usableHeight - drawHeight) / 2;
        } else if (imageScale === 'fill') {
          if (imgRatio > pageRatio) {
            drawHeight = usableHeight;
            drawWidth = usableHeight * imgRatio;
          } else {
            drawWidth = usableWidth;
            drawHeight = usableWidth / imgRatio;
          }
          x = docMargin + (usableWidth - drawWidth) / 2;
          y = docMargin + (usableHeight - drawHeight) / 2;
        } else {
          drawWidth = imgData.width * 0.264583;
          drawHeight = imgData.height * 0.264583;
          
          if (drawWidth > usableWidth) {
            drawWidth = usableWidth;
            drawHeight = drawWidth / imgRatio;
          }
          if (drawHeight > usableHeight) {
            drawHeight = usableHeight;
            drawWidth = drawHeight * imgRatio;
          }
          x = docMargin + (usableWidth - drawWidth) / 2;
          y = docMargin + (usableHeight - drawHeight) / 2;
        }

        const format = imgData.file.type === 'image/png' ? 'PNG' : 'JPEG';
        doc.addImage(imgData.previewUrl, format, x, y, drawWidth, drawHeight, undefined, 'FAST', 0);
      });

      const finalName = filename.endsWith('.pdf') ? filename : `${filename}.pdf`;
      doc.save(finalName);
      resolve();
    } catch (err) {
      reject(err);
    }
  });
};
