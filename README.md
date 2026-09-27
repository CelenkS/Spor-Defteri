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

5. (Opsiyonel) Yapay zeka asistanı için `ai-config.js` dosyasına
   [console.anthropic.com](https://console.anthropic.com)'dan alınan bir API
   anahtarı gir:

   ```js
   window.anthropicApiKey = "sk-ant-...";
   ```

   **Uyarı:** Bu anahtar sitenin herkese açık kaynak kodunda görünür (bu
   basit uygulamada arka uç yok). Bu linki başkasıyla paylaşma ve Anthropic
   Console'dan bu anahtara bir aylık harcama limiti koymanı öneririz.
   Anahtar boşsa sağ altta hâlâ sohbet ikonu görünür ama asistan "henüz
   kurulmamış" der.

## Yapay zeka asistanı

Sağ alttaki sohbet ikonuna dokunarak açılır. İki şey yapabilir:
- Verilerin hakkında soru cevaplar (örn. "bu hafta kaç antrenman yaptım").
- Senin adına veri ekler/değiştirir (örn. "bugünü push günü yap ve chest
  press 4x10 60kg ekle") — bunun için mevcut günlere egzersiz seti, öğün,
  kardiyo, kilo ve adım kaydı eklemek, ve bir günün antrenman türünü
  ayarlamak gibi araçları kullanır.

## Yerel geliştirme

`index.html` tek başına açılabilir; `firebase-config.js` boşsa uygulama
sadece bu cihazdaki tarayıcı deposunu (localStorage) kullanarak çalışmaya
devam eder (üstte "Bu cihazda" yazar).
