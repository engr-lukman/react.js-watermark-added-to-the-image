import { useState } from 'react';
import { toast } from 'react-toastify';

export interface IFileProcessing {
  fileName: string;
  imgWatermarkFile: any;
  textWatermarkFile: any;
  originalFile: any;
}

const useWatermarkAddedToTheImage = () => {
  const [processedFile, setProcessedFile] = useState<IFileProcessing | null>();
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const startFileProcessing = async (imgFile: any) => {
    try {
      if (!imgFile?.name) throw new Error('Please select a valid image file.');

      setIsProcessing(true);

      let item: IFileProcessing = {
        fileName: imgFile?.name,
        imgWatermarkFile: null,
        textWatermarkFile: null,
        originalFile: imgFile,
      };

      const imgWatermarkFile = await imgWatermark(imgFile, '/logo192.png');
      const textWatermarkFile = await textWatermark(imgFile, 'React.js');

      setProcessedFile({ ...item, imgWatermarkFile, textWatermarkFile });
    } catch (error) {
      toast.error(`${error}`);
    } finally {
      setIsProcessing(false);
    }
  };

  return [(imgFile: any) => startFileProcessing(imgFile), processedFile, isProcessing] as const;
};

const imgWatermark = async (imgOriginal: File, watermarkImagePath: any, quality = 0.75) => {
  return new Promise((resolve, reject) => {
    let canvas: any = document.createElement('canvas');
    canvas.imageSmoothingQuality = 'medium'; // [low, medium, high] Reference:https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/imageSmoothingQuality

    let context: any = canvas.getContext('2d');

    let img = document.createElement('img');
    img.src = URL.createObjectURL(imgOriginal);

    img.onload = async () => {
      canvas.width = img.width;
      canvas.height = img.height;

      // initializing the canvas with the original image
      context.drawImage(img, 0, 0, canvas.width, canvas.height);

      // loading the watermark image and transforming it into a pattern
      const result = await fetch(watermarkImagePath);
      const blob = await result.blob();
      const image = await createImageBitmap(blob);
      const pattern = context.createPattern(image, 'no-repeat');

      // translating the watermark text to the top left corner
      context.translate(25, 25);
      context.rect(0, 0, canvas.width, canvas.height);
      context.fillStyle = pattern;

      context.fill();

      return context.canvas.toBlob((blob: any) => resolve(blob), 'image/jpeg', quality);
    };

    img.onerror = () => reject(`${imgOriginal.name} is invalid image format.`);
  });
};

const textWatermark = async (imgOriginal: File, watermarkText: string, quality = 0.75) => {
  return new Promise((resolve, reject) => {
    let canvas: any = document.createElement('canvas');
    canvas.imageSmoothingQuality = 'medium'; // [low, medium, high] Reference:https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/imageSmoothingQuality

    let context: any = canvas.getContext('2d');

    let img = document.createElement('img');
    img.src = URL.createObjectURL(imgOriginal);

    img.onload = async () => {
      canvas.width = img.width;
      canvas.height = img.height;

      // initializing the canvas with the original image
      context.drawImage(img, 0, 0, canvas.width, canvas.height);

      // adding a blue watermark text in the top left corner
      context.fillStyle = 'white';
      context.textBaseline = 'middle';
      context.font = 'bold 100px serif';
      context.fillText(watermarkText, 100, 100);

      return context.canvas.toBlob((blob: any) => resolve(blob), 'image/jpeg', quality);
    };

    img.onerror = () => reject(`${imgOriginal.name} is invalid image format.`);
  });
};

export default useWatermarkAddedToTheImage;
