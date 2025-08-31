/**
 * @fileoverview Utility functions for handling storage paths.
 */

/**
 * Gets the parent path of a given path.
 * @param path The full path of the item.
 * @returns The parent path, or an empty string for the root.
 */
export function getParentPath(path: string): string {
  if (!path) return '';
  const lastSlashIndex = path.lastIndexOf('/');
  return lastSlashIndex >= 0 ? path.substring(0, lastSlashIndex) : '';
}

/**
 * Normalizes a path by removing leading/trailing slashes.
 * @param path The path to normalize.
 */
export function normalizePath(path: string): string {
  return path.replace(/^\/+|\/+$/g, '');
}

/**
 * Builds a full path from a base path and a new name.
 * @param currentPath The current directory path.
 * @param name The name of the new file or folder.
 */
export function buildFullPath(currentPath: string, name: string): string {
  const normalizedPath = normalizePath(currentPath);
  return normalizedPath ? `${normalizedPath}/${name}` : name;
}
