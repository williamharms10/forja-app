// 1) Vá em console.firebase.google.com > seu projeto > ⚙️ Configurações do projeto
// 2) Na seção "Seus apps", escolha o app da Web já criado e copie o objeto de config
// 3) Cole os valores abaixo, substituindo os placeholders (ou deixe como está se já preencheu antes)
const firebaseConfig = {
  apiKey: "AIzaSyDW8seo4x0VHVdRON2BPOe97wKiio4XBDU",
  authDomain: "forja-app-17944.firebaseapp.com",
  projectId: "forja-app-17944",
  storageBucket: "forja-app-17944.firebasestorage.app",
  messagingSenderId: "942215315973",
  appId: "1:942215315973:web:029e9653c8636b6c0d126c",
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
const functionsInstance = firebase.app().functions("us-central1");
