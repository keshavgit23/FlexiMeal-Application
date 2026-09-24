// import React from 'react';
// import { SAMPLE_MESS_PHOTOS } from '../../../mockData';

// export interface PhotoSectionProps {
//    photo: File | null;
//   onChange: (photo: File | null) => void;

// }

// export const PhotoSection: React.FC<PhotoSectionProps> = ({
//   photo,
//   onChange,
// }) => {
//   const toggleSamplePhoto = (url: string) => {
//     if (photos.includes(url)) {
//       onChange(photos.filter((p) => p !== url));
//     } else {
//       onChange([...photos, url]);
//     }
//   };

//   const handleSimulatedUpload = () => {
//     // Pick the first sample photo not already added, or a default
//     const available = SAMPLE_MESS_PHOTOS.find((p) => !photos.includes(p.url));
//     if (available) {
//       onChange([...photos, available.url]);
//     } else {
//       // Toggle all
//       onChange(SAMPLE_MESS_PHOTOS.map((p) => p.url));
//     }
//   };

//   return (
//     <div className="space-y-2.5">
//       <div className="flex items-center justify-between">
//         <div>
//           <label className="text-xs font-bold uppercase tracking-wider text-gray-500 font-heading block">
//             Mess Photos <span className="text-gray-400 font-normal">(Optional)</span>
//           </label>
//           <span className="text-[11px] text-gray-500">
//             Helps students recognize your dining entrance &amp; clean kitchen
//           </span>
//         </div>
//         <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
//           {photos.length} selected
//         </span>
//       </div>

//       {/* Thumbnails + Add Button */}
//       <div className="grid grid-cols-3 gap-2.5">
//         {SAMPLE_MESS_PHOTOS.map((sample) => {
//           const isSelected = photos.includes(sample.url);
//           return (
//             <div
//               key={sample.id}
//               onClick={() => toggleSamplePhoto(sample.url)}
//               role="button"
//               tabIndex={0}
//               onKeyDown={(e) => {
//                 if (e.key === 'Enter' || e.key === ' ') {
//                   e.preventDefault();
//                   toggleSamplePhoto(sample.url);
//                 }
//               }}
//               className={`relative h-24 rounded-xl overflow-hidden border-2 cursor-pointer transition group ${
//                 isSelected
//                   ? 'border-emerald-600 ring-2 ring-emerald-500/20'
//                   : 'border-gray-200 hover:border-gray-300 opacity-70 hover:opacity-100'
//               }`}
//             >
//               <img
//                 src={sample.url}
//                 alt={sample.label}
//                 referrerPolicy="no-referrer"
//                 className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
//               />
//               <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
//               <span className="absolute bottom-1.5 left-1.5 right-1.5 text-[10px] font-bold text-white leading-tight truncate">
//                 {sample.label}
//               </span>

//               {/* Checkmark overlay */}
//               <div
//                 className={`absolute top-1.5 right-1.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
//                   isSelected
//                     ? 'bg-emerald-600 text-white shadow-sm'
//                     : 'bg-black/40 text-white/70'
//                 }`}
//               >
//                 <i
//                   className={
//                     isSelected
//                       ? 'fa-solid fa-check'
//                       : 'fa-solid fa-plus text-[9px]'
//                   }
//                 />
//               </div>
//             </div>
//           );
//         })}
//       </div>

//       <div className="flex items-center justify-between text-[11px] text-gray-500 pt-1">
//         <span>Tap any photo above to add or remove it</span>
//         <button
//           type="button"
//           onClick={handleSimulatedUpload}
//           className="text-emerald-700 font-bold hover:underline inline-flex items-center gap-1"
//         >
//           <i className="fa-solid fa-camera text-[10px]" />
//           <span>Quick Select All</span>
//         </button>
//       </div>
//     </div>
//   );
// };
import React, { useRef } from 'react';

export interface PhotoSectionProps {
  photo: File | null;
  existingPhotoUrl: string | null;
  onChange: (photo: File | null) => void;
}

export const PhotoSection: React.FC<PhotoSectionProps> = ({
  photo,
  onChange,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    onChange(file);
  };

  const handleRemove = () => {
    onChange(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-2.5">
      <div>
        <label className="text-xs font-bold uppercase tracking-wider text-gray-500 font-heading block">
          Mess Photo{' '}
          <span className="text-gray-400 font-normal">
            (Optional)
          </span>
        </label>

        <span className="text-[11px] text-gray-500">
          Helps students recognize your dining entrance &amp; clean kitchen
        </span>
      </div>

      {photo ? (
        <div className="relative h-48 rounded-xl overflow-hidden border-2 border-emerald-600">
          <img
            src={URL.createObjectURL(photo)}
            alt="Selected mess"
            className="w-full h-full object-cover"
          />

          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80"
          >
            <i className="fa-solid fa-xmark text-xs" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="w-full h-32 rounded-xl border-2 border-dashed border-gray-300 hover:border-emerald-500 hover:bg-emerald-50/30 transition flex flex-col items-center justify-center gap-2"
        >
          <i className="fa-solid fa-camera text-xl text-gray-400" />

          <span className="text-xs font-semibold text-gray-600">
            Add Mess Photo
          </span>

          <span className="text-[10px] text-gray-400">
            JPG, PNG or WebP · Max 5 MB
          </span>
        </button>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileChange}
        className="hidden"
      />

      {photo && (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="text-emerald-700 font-bold hover:underline inline-flex items-center gap-1 text-[11px]"
        >
          <i className="fa-solid fa-camera text-[10px]" />
          Change photo
        </button>
      )}
    </div>
  );
};