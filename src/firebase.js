// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// 環境変数のチェック
const requiredEnvVars = {
  REACT_APP_FIREBASE_API_KEY: "Firebase API Key",
  REACT_APP_FIREBASE_AUTH_DOMAIN: "Firebase Auth Domain",
  REACT_APP_FIREBASE_PROJECT_ID: "Firebase Project ID",
  REACT_APP_FIREBASE_STORAGE_BUCKET: "Firebase Storage Bucket",
  REACT_APP_FIREBASE_MESSAGING_SENDER_ID: "Firebase Messaging Sender ID",
  REACT_APP_FIREBASE_APP_ID: "Firebase App ID",
  REACT_APP_FIREBASE_MEASUREMENT_ID: "Firebase Measurement ID",
};

// 環境変数が設定されているかチェック
const missingEnvVars = Object.entries(requiredEnvVars)
  .filter(([key]) => !process.env[key])
  .map(([_, name]) => name);

if (missingEnvVars.length > 0) {
  throw new Error(
    `以下の環境変数が設定されていません：\n${missingEnvVars.join("\n")}\n\n` +
      "開発環境の場合：.envファイルが正しく設定されているか確認してください。\n" +
      "本番環境の場合：ホスティングサービスの環境変数設定を確認してください。"
  );
}

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

let app;
let auth;
let provider;
let db;

try {
  // Initialize Firebase
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  provider = new GoogleAuthProvider();
  db = getFirestore(app);
} catch (error) {
  console.error("Firebaseの初期化に失敗しました:", error);
  throw new Error(
    "Firebaseの初期化に失敗しました。\n" +
      "1. 環境変数が正しく設定されているか確認してください。\n" +
      "2. Firebase Consoleでプロジェクトが正しく設定されているか確認してください。\n" +
      "3. インターネット接続を確認してください。"
  );
}

export { auth, provider, db };
