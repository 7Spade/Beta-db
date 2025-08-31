/**
 * @fileoverview 文章管理主頁面
 * @description 此頁面負責渲染文章管理的主視圖，包含文章列表和操作按鈕。
 */
'use client';

import { PostsListView } from '@root/src/features/(system-admin)/website-cms/blog/views/posts-list-view';

export default function AdminBlogPostsPage() {
  return <PostsListView />;
}
