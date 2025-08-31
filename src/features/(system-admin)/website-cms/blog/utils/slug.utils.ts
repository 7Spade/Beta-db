/**
 * @fileoverview Slug Utility Functions
 * @description Provides helper functions for creating and validating URL-friendly slugs.
 */

/**
 * Converts a string into a URL-friendly slug.
 * @param {string} text - The input string to slugify.
 * @returns {string} The URL-friendly slug.
 */
export function slugify(text: string): string {
  if (!text) return '';
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w-]+/g, '')        // Remove all non-word chars except -
    .replace(/--+/g, '-')           // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '');            // Trim - from end of text
}
