/**
 * エラーメッセージの定義
 */
export const ErrorMessages = {
  // 認証関連
  AUTH: {
    NOT_LOGGED_IN: "ログインが必要です",
    LOGIN_FAILED: "ログインに失敗しました",
    LOGOUT_FAILED: "ログアウトに失敗しました",
    SESSION_EXPIRED: "セッションが切れました。再度ログインしてください",
  },

  // 投稿関連
  POST: {
    CREATE_FAILED: "投稿の作成に失敗しました",
    UPDATE_FAILED: "投稿の更新に失敗しました",
    DELETE_FAILED: "投稿の削除に失敗しました",
    FETCH_FAILED: "投稿の取得に失敗しました",
    INVALID_TITLE: "タイトルを入力してください",
    INVALID_CONTENT: "投稿内容を入力してください",
    TITLE_TOO_LONG: "タイトルは100文字以内で入力してください",
    CONTENT_TOO_LONG: "投稿内容は10000文字以内で入力してください",
  },

  // コメント関連
  COMMENT: {
    CREATE_FAILED: "コメントの投稿に失敗しました",
    UPDATE_FAILED: "コメントの更新に失敗しました",
    DELETE_FAILED: "コメントの削除に失敗しました",
    FETCH_FAILED: "コメントの取得に失敗しました",
    INVALID_CONTENT: "コメントを入力してください",
    CONTENT_TOO_LONG: "コメントは1000文字以内で入力してください",
  },

  // 返信関連
  REPLY: {
    CREATE_FAILED: "返信の投稿に失敗しました",
    UPDATE_FAILED: "返信の更新に失敗しました",
    DELETE_FAILED: "返信の削除に失敗しました",
    FETCH_FAILED: "返信の取得に失敗しました",
    INVALID_CONTENT: "返信を入力してください",
    CONTENT_TOO_LONG: "返信は1000文字以内で入力してください",
  },

  // ネットワーク関連
  NETWORK: {
    OFFLINE: "インターネット接続を確認してください",
    TIMEOUT: "通信がタイムアウトしました",
    SERVER_ERROR: "サーバーエラーが発生しました",
  },

  // その他
  GENERAL: {
    UNKNOWN_ERROR: "予期せぬエラーが発生しました",
    RETRY_LATER: "しばらく経ってから再度お試しください",
  },
};

/**
 * エラーメッセージを取得する
 * @param {string} category - エラーのカテゴリ
 * @param {string} type - エラーの種類
 * @returns {string} エラーメッセージ
 */
export const getErrorMessage = (category, type) => {
  return ErrorMessages[category]?.[type] || ErrorMessages.GENERAL.UNKNOWN_ERROR;
};

/**
 * Firebaseのエラーコードを日本語メッセージに変換する
 * @param {Error} error - Firebaseのエラーオブジェクト
 * @returns {string} エラーメッセージ
 */
export const getFirebaseErrorMessage = (error) => {
  const errorCode = error.code;

  const errorMap = {
    "permission-denied": "アクセスが拒否されました",
    "not-found": "データが見つかりません",
    "already-exists": "既に存在するデータです",
    "resource-exhausted": "リソースの制限に達しました",
    "failed-precondition": "操作の前提条件が満たされていません",
    aborted: "操作が中止されました",
    "out-of-range": "範囲外の操作です",
    unimplemented: "未実装の操作です",
    internal: "内部エラーが発生しました",
    unavailable: "サービスが利用できません",
    "data-loss": "データが失われました",
    unauthenticated: "認証が必要です",
  };

  return errorMap[errorCode] || ErrorMessages.GENERAL.UNKNOWN_ERROR;
};
