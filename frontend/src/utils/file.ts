import { supabase } from '@/libs/supabase';

import type { User } from '@/types/user.type';

const uploadFile = (blob: Blob, name: string) => {
  const ext = blob.type.split('/')[1];
  return supabase.storage.from('public').upload(`${name}.${ext}`, blob, {
    cacheControl: '3600',
    upsert: true,
  });
};

const onFileSelected = (e: any, handleFileChange: (fileUrl: string, blob: Blob) => void) => {
  const image: Blob = e.target.files[0];
  if (!image) return;
  const reader = new FileReader();
  reader.readAsDataURL(image);
  reader.onloadend = (e) => {
    handleFileChange(e.target.result as string, image);
  };
  reader.onloadstart = () => {
    handleFileChange('loading', null);
  };
};

const getUserFileName = (user: User, fileName: string) => {
  if (!user?.accountId) return;
  return `${user.accountId}/${fileName}`;
};

export { uploadFile, onFileSelected, getUserFileName };
