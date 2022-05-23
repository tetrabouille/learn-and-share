import { supabase } from '@/libs/supabase';
import { v4 as uuid } from 'uuid';

import type { User } from '@/types/user.type';

const uploadFile = async (blob: Blob, name: string) => {
  const ext = blob.type.split('/')[1];
  const [userDir, fileName] = name.split('/');
  const files = await supabase.storage.from('public').list(userDir);
  const filesToRemove = files.data?.map((file) => file.name).filter((file) => file.includes(fileName));
  if (filesToRemove?.length)
    filesToRemove.forEach((fileName) => {
      void supabase.storage.from('public').remove([`${userDir}/${fileName}`]);
    });
  return supabase.storage.from('public').upload(`${name}-${uuid()}.${ext}`, blob);
};

const getFile = (user: User, fileName: string) => {
  return supabase.storage.from('public').getPublicUrl(`${user.accountId}/${fileName}`);
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

export { uploadFile, onFileSelected, getUserFileName, getFile };
