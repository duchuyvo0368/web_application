export interface UploadConfig {
  chunkSize: number;
  parallelLimit: number;
}

export const getUploadConfig = (fileSize: number): UploadConfig => {
  const MB = 1024 * 1024;
  const GB = 1024 * MB;

  if (fileSize < 1 * MB) {
    return {
      chunkSize: fileSize,
      parallelLimit: 1,
    };
  }

  if (fileSize < 5 * MB) {
    return {
      chunkSize: fileSize,
      parallelLimit: 1,
    };
  }

  if (fileSize < 10 * MB) {
    return {
      chunkSize: 2.5 * MB,
      parallelLimit: 2,
    };
  }

  if (fileSize < 50 * MB) {
    return {
      chunkSize: 5 * MB,
      parallelLimit: 4,
    };
  }

  if (fileSize < 100 * MB) {
    return {
      chunkSize: 8 * MB,
      parallelLimit: 6,
    };
  }

  if (fileSize < 200 * MB) {
    return {
      chunkSize: 10 * MB,
      parallelLimit: 8,
    };
  }

  if (fileSize < 500 * MB) {
    return {
      chunkSize: 15 * MB,
      parallelLimit: 10,
    };
  }

  if (fileSize < 1 * GB) {
    return {
      chunkSize: 20 * MB,
      parallelLimit: 12,
    };
  }

  if (fileSize < 2 * GB) {
    return {
      chunkSize: 30 * MB,
      parallelLimit: 16,
    };
  }

  throw new Error("File size exceeds 2GB.");
};
