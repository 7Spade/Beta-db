/**
 * @fileoverview 文章編輯與新增頁面
 * @description 此頁面負責渲染文章表單，用於建立或更新部落格文章。
 */

import { PostFormView } from '@/features/blog/views/post-form-view';

export default async function PostFormPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const postId = typeof id === 'string' && id !== 'create' ? id : null;
  return <PostFormView postId={postId} />;
}
