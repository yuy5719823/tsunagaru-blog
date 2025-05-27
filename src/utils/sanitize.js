/**
 * HTML特殊文字をエスケープする
 * @param {string} str - エスケープする文字列
 * @returns {string} エスケープされた文字列
 */
export const escapeHtml = (str) => {
  if (typeof str !== "string") return "";

  const htmlEntities = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
    "`": "&#96;",
  };

  return str.replace(/[&<>"'`]/g, (char) => htmlEntities[char]);
};

/**
 * ユーザー入力のサニタイズ
 * @param {string} input - サニタイズする文字列
 * @returns {string} サニタイズされた文字列
 */
export const sanitizeInput = (input) => {
  if (typeof input !== "string") return "";

  // 前後の空白を削除
  let sanitized = input.trim();

  // 連続する空白を1つに
  sanitized = sanitized.replace(/\s+/g, " ");

  // HTML特殊文字をエスケープ
  sanitized = escapeHtml(sanitized);

  return sanitized;
};

/**
 * 投稿データのサニタイズ
 * @param {Object} post - サニタイズする投稿データ
 * @returns {Object} サニタイズされた投稿データ
 */
export const sanitizePost = (post) => {
  if (!post) return null;

  return {
    ...post,
    title: sanitizeInput(post.title),
    postText: sanitizeInput(post.postText),
    author: {
      ...post.author,
      username: sanitizeInput(post.author?.username),
    },
  };
};

/**
 * コメントデータのサニタイズ
 * @param {Object} comment - サニタイズするコメントデータ
 * @returns {Object} サニタイズされたコメントデータ
 */
export const sanitizeComment = (comment) => {
  if (!comment) return null;

  return {
    ...comment,
    text: sanitizeInput(comment.text),
    author: {
      ...comment.author,
      username: sanitizeInput(comment.author?.username),
    },
  };
};
