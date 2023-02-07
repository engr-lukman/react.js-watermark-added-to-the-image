import { useEffect, useState } from 'react';

import useWatermarkAddedToTheImage, { IFileProcessing } from 'hooks/useWatermarkAddedToTheImage';
import Spinner from 'components/Spinner';

const Feature = () => {
  const [file, setFile] = useState<IFileProcessing | null>(null);

  // File processing
  const [fileProcessingFn, processedFile, isProcessing] = useWatermarkAddedToTheImage();
  useEffect(() => {
    if (!!processedFile && !isProcessing) {
      setFile(processedFile);
    }
  }, [processedFile, isProcessing]);

  return (
    <div className="relative px-5 py-2">
      <div className="flex justify-center">
        <div className="w-[75vw] h-full">
          <h2 className="flex justify-between items-center font-semibold text-black mb-2">Select an image</h2>
          <div className="flex w-full h-[75vh] justify-center items-start border border-dashed border-black text-white p-4">
            <div className="w-full">
              <input
                type="file"
                accept="image/*"
                onChange={(e: any) => fileProcessingFn(e.target.files[0])}
                className="text-black"
              />

              <div className="flex justify-between space-x-3 mt-4">
                {isProcessing && (
                  <div className="flex justify-start items-center space-x-2 text-black">
                    <Spinner className="w-6 h-6" /> <span>Processing...</span>
                  </div>
                )}

                {!!file && !isProcessing && (
                  <>
                    {!!file?.imgWatermarkFile && (
                      <div className="flex justify-start items-start space-x-4">
                        <img src={URL.createObjectURL(file?.imgWatermarkFile)} alt="watermark" className="w-auto" />
                      </div>
                    )}

                    {!!file?.textWatermarkFile && (
                      <div className="flex justify-start items-start space-x-4">
                        <img src={URL.createObjectURL(file?.textWatermarkFile)} alt="watermark" className="w-auto" />
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Feature;
