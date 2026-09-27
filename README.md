# Spor Defteri

Antrenman, beslenme ve kardiyo takip uygulaması. GitHub Pages üzerinde statik
olarak yayınlanır, veriler Firebase Firestore'da gerçek zamanlı olarak saklanır
(telefonlar arası senkron + çevrimdışı çalışma desteği). Giriş ekranı yoktur;
uygulama açılışta görünmez (anonim) bir Firebase oturumu açar.

## Kurulum (tek seferlik)

1. `firebase-config.js` dosyasını Firebase Console > Proje Ayarları > Web
   uygulaması bölümünden alınan `firebaseConfig` nesnesi ile doldur:

   ```js
   window.firebaseConfig = {
     apiKey: "...",
     authDomain: "...",
     projectId: "...",
     storageBucket: "...",
     messagingSenderId: "...",
     appId: "..."
   };
   ```

2. Firestore'u etkinleştir (production mode) ve Authentication > Sign-in method
   altından **Anonymous**'u aç.

3. Firestore > Rules sekmesine bu projedeki `firestore.rules` dosyasının
   içeriğini yapıştır ve yayınla.

4. Repo ayarlarından (Settings > Pages) "Deploy from a branch", `main` /
   `root` seçilerek GitHub Pages açılır. Her `main`'e push otomatik olarak
   siteyi günceller.

## Yerel geliştirme

`index.html` tek başına açılabilir; `firebase-config.js` boşsa uygulama
sadece bu cihazdaki tarayıcı deposunu (localStorage) kullanarak çalışmaya
devam eder (üstte "Bu cihazda" yazar).
