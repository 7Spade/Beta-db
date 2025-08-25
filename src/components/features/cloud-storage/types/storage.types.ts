
export interface StorageFile {
  name: string;
  url: string;
  fullPath: string;
  size: number;
  contentType: string;
  createdAt: string;
}

export interface StorageFolder {
    name: string;
    fullPath: string;
}
