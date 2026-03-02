const STORAGE_KEY = "ios_clone_photos";

export const savePhoto = (imageData) => {
  const existing = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  const updated = [imageData, ...existing]; // newest first
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
};

export const getPhotos = () => {
  return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
};

export const deletePhoto = (index) => {
  const existing = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  const updated = existing.filter((_, i) => i !== index);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
};
