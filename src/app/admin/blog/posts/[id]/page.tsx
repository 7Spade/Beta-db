/**
 * @fileoverview 文章編輯與新增頁面
 * @description 此頁面負責渲染文章表單，用於建立或更新部落格文章。
 */

import { PostFormView } from '@/components/features/blog/views/post-form-view';

interface PostFormPageProps {
  params: {
    id: string;
  };
}

export default function PostFormPage({ params }: PostFormPageProps) {
  const postId = typeof params.id === 'string' && params.id !== 'create' ? params.id : null;
  return <PostFormView postId={postId} />;
}
