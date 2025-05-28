# React + Firebase 投稿アプリケーション

React と Firebase を使用した投稿アプリケーション。リアルタイム更新、認証機能、インタラクティブな機能を備えています。

## 主な機能

- 🔐 ユーザー認証

  - サインアップ・ログイン機能
  - Firebase Authentication による安全なユーザー管理

- 📝 投稿投稿

  - 投稿の作成・削除
  - リッチテキスト対応
  - 長文の開閉機能
  - レスポンシブデザイン

- 💬 インタラクティブ機能

  - いいね機能
  - コメントシステム
  - リアルタイム更新
  - 返信機能

- 🎨 モダンな UI/UX
  - クリーンで直感的なインターフェース
  - レスポンシブデザイン
  - スムーズなアニメーション
  - ユーザーフレンドリーなエラー表示

## 技術スタック

- **フロントエンド**

  - React
  - CSS3
  - FontAwesome Icons

- **バックエンド**
  - Firebase Authentication
  - Firebase Firestore
  - Firebase Hosting

## 必要条件

- Node.js (v14 以上)
- npm または yarn
- Firebase アカウント

## セットアップ

1. リポジトリのクローン

```bash
git clone https://github.com/yourusername/blog-with-react-and-firebase.git
cd blog-with-react-and-firebase
```

2. 依存関係のインストール

```bash
npm install
# または
yarn install
```

3. Firebase プロジェクトの作成

   - [Firebase Console](https://console.firebase.google.com/) にアクセス
   - 新しいプロジェクトを作成
   - Authentication と Firestore を有効化
   - Firebase 設定情報を取得

4. ルートディレクトリに `.env` ファイルを作成

```env
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
```

5. 開発サーバーの起動

```bash
npm start
# または
yarn start
```

## デプロイ

アプリケーションは Vercel または Firebase Hosting にデプロイできます。

### Vercel へのデプロイ

1. コードを GitHub にプッシュ
2. リポジトリを Vercel に接続
3. 環境変数の設定
4. デプロイ

### Firebase へのデプロイ

1. Firebase CLI のインストール

```bash
npm install -g firebase-tools
```

2. Firebase へのログイン

```bash
firebase login
```

3. Firebase の初期化

```bash
firebase init
```

4. デプロイ

```bash
firebase deploy
```

## プロジェクト構造

```
src/
  ├── components/        # React コンポーネント
  │   ├── Post/         # 投稿コンポーネントとスタイル
  │   └── Comment/      # コメントコンポーネントとスタイル
  ├── firebase/         # Firebase 設定
  ├── App.js           # メインアプリケーションコンポーネント
  └── index.js         # アプリケーションのエントリーポイント
```

## 開発への参加

1. リポジトリをフォーク
2. 機能ブランチの作成 (`git checkout -b feature/AmazingFeature`)
3. 変更のコミット (`git commit -m 'Add some AmazingFeature'`)
4. ブランチへのプッシュ (`git push origin feature/AmazingFeature`)
5. プルリクエストの作成

## ライセンス

このプロジェクトは MIT ライセンスの下で公開されています - 詳細は [LICENSE](LICENSE) ファイルを参照してください。

## 謝辞

- [React](https://reactjs.org/)
- [Firebase](https://firebase.google.com/)
- [FontAwesome](https://fontawesome.com/)
