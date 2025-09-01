/**
 * @fileoverview Content Utility Functions
 * @description Provides helper functions for processing blog content.
 */

/**
 * Generates a short excerpt from the main content.
 * @param {string} content - The full content of the blog post.
 * @param {number} maxLength - The maximum length of the excerpt.
 * @returns {string} The generated excerpt.
 */
export function generateExcerpt(content: string, maxLength: number = 150): string {
  // Remove Markdown syntax for a cleaner excerpt
  const plainText = content.replace(/(\*|_|`|#|!\[.*\]\(.*\))/g, '');
  if (plainText.length <= maxLength) {
    return plainText;
  }
  return plainText.substring(0, maxLength).trim() + '...';
}

/**
 * Estimates the reading time of a post.
 * @param {string} content - The content of the blog post.
 * @param {number} wpm - Words per minute, defaults to 200.
 * @returns {number} The estimated reading time in minutes.
 */
export function calculateReadingTime(content: string, wpm: number = 200): number {
  const words = content.trim().split(/\s+/).length;
  return Math.ceil(words / wpm);
}
