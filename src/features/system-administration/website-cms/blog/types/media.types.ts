/**
 * @fileoverview Blog Media Type Definitions
 * @description Defines TypeScript types related to media handling for the blog.
 */

export interface MediaUploadResult {
  url: string;
  path: string;
  size: number;
  contentType: string;
}
