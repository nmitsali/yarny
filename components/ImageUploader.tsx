
import React, { useRef } from 'react';

interface ImageUploaderProps {
  onImageUpload: (file: File) => void;
  yarnImage: string | null;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload, yarnImage }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImageUpload(file);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full bg-white border-2 border-dashed border-amber-300 rounded-xl p-6 text-center cursor-pointer hover:border-amber-400 transition-colors" onClick={handleUploadClick}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/*"
      />
      {yarnImage ? (
        <img src={yarnImage} alt="Uploaded yarn" className="max-h-80 w-auto mx-auto rounded-lg shadow-md" />
      ) : (
        <div className="flex flex-col items-center justify-center text-stone-500">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="font-semibold text-lg">Click to upload a photo of your yarn</p>
          <p className="text-sm">Let's see what you're working with!</p>
        </div>
      )}
    </div>
  );
};
