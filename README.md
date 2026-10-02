# Spor Defteri

Antrenman, beslenme ve kardiyo takip uygulaması. GitHub Pages üzerinde statik
olarak yayınlanır, veriler Firebase Firestore'da gerçek zamanlı olarak saklanır
(telefonlar arası senkron + çevrimdışı çalışma desteği). Giriş ekranı yoktur;
uygulama açılışta görünmez (anonim) bir Firebase oturumu açar.

Antrenman/Beslenme/Kardiyo/Ana Sayfa'nın yanında bir de **Plan** sekmesi var:
günlük, saat etiketli bir yapılacaklar listesi (tiklenebilir) ve o güne özel
serbest bir not alanı — tarih ileri/geri okuyla gezilebiliyor. Antrenman
sekmesinde set eklenince otomatik 2 dakikalık bir dinlenme sayacı beliriyor,
"Antrenman Başlat" ile o günkü antrenman süresi de ayrıca sayılabiliyor,
egzersiz kartları akordeon şeklinde (sadece üzerinde çalışılan açık kalıyor).
Ana Sayfa'da hızlı su ve adım girişi için ayrı kartlar var. Ana Sayfa'nın en
üstünde günün/haftanın/ayın genel ilerlemesini (beslenme+antrenman+kardiyo+adım
ortalaması) tek bakışta gösteren gradyanlı bir karşılama kartı ve ilerleme
halkası var, altında durumuna göre değişen kısa bir motivasyon mesajı
gösteriliyor; haftalık şeritte bugünün günü de aynı gradyanla öne çıkıyor.
Uygulamanın genel rengi koyu + turuncu/kırmızı gradyan bir tema kullanıyor
(Ayarlar'dan Aydınlık/Karanlık/Sistem seçilebiliyor, tema her ikisinde de aynı
renk paletini kullanıyor). İçindeki yapay zeka asistanı Plan sekmesindeki
ajanda/not içeriğini de görüyor ve sorulduğunda onlar hakkında cevap
verebiliyor, gerekirse yeni madde/not da ekleyebiliyor.

Ana Sayfa'da artık **Bugünün Görevleri** kartı var: antrenman, kardiyo, adım,
su, uyku ve o güne ait ajanda maddeleri tek bir tiklenebilir listede birleşiyor
(üstte kaç tanesinin tamamlandığı görünüyor). Altında **Bu Hafta Özet** kartı
antrenman günü/hedefi, rutin uyum %'si, bu hafta kırılan rekor sayısı, ortalama
su ve uyku miktarını gösteriyor. Yeni bir **Uyku** kartı (Ayarlar'dan hedef
saat belirlenebiliyor) su/adım kartlarının yanına eklendi. Antrenman
sekmesinde her egzersiz artık geçmiş performansa göre bir **ilerleme önerisi**
(aynı kilo + 1 tekrar fazla), bu oturum ile geçen oturumun **hacim
karşılaştırması** ve o ana kadarki en ağır seti geçtiğinde bir **"Yeni
Rekor!" rozetini** gösteriyor. Antrenman sekmesindeki **Hareket Kütüphanesi**
butonu ön/arka vücut haritası üzerinden bölgeye (göğüs, sırt, bacak vb.)
tıklayarak o bölgenin hareketlerini, geçmiş performanslarını ve "Bugüne Ekle"
kısayolunu gösteren bir pencere açıyor.

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
   altından **Anonymous**'u aç. Cihazlar arası senkron özelliğinin çalışması için
   aynı yerden **Email/Password**'ü de aç (aşağıdaki "Cihazlar arası senkron"
   bölümüne bak).

3. Firestore > Rules sekmesine bu projedeki `firestore.rules` dosyasının
   içeriğini yapıştır ve yayınla.

4. Repo ayarlarından (Settings > Pages) "Deploy from a branch", `main` /
   `root` seçilerek GitHub Pages açılır. Her `main`'e push otomatik olarak
   siteyi günceller.

5. (Opsiyonel) Yapay zeka asistanı için [console.anthropic.com](https://console.anthropic.com)'dan
   bir API anahtarı al ve `ai-config.js` dosyasına **commit etme** — bunun
   yerine bir GitHub Actions repository secret olarak ekle:

   - Repo > Settings > Secrets and variables > Actions > New repository secret
   - Name: `ANTHROPIC_API_KEY`, Value: anahtarın

   Repo > Settings > Pages > Build and deployment > Source'u **"GitHub
   Actions"** olarak değiştir (artık "Deploy from a branch" değil).
   `.github/workflows/deploy.yml` her `main`'e push'ta bu anahtarı
   `ai-config.js`'in içine yazıp öyle deploy ediyor — yani gerçek anahtar
   hiçbir zaman repoya commit edilmiyor.

   **Neden böyle:** Anahtarı doğrudan `ai-config.js`'e commit edip herkese
   açık repoya push edersek, GitHub'ın secret scanning'i bunu tespit edip
   Anthropic'e bildiriyor ve anahtar otomatik iptal ediliyor (bu bir kere
   başımıza geldi, 401 hatası olarak görünür). Actions secret'i bu döngüyü
   önlüyor. Yine de son kullanıcıya servis edilen sayfanın kaynağında anahtar
   görünür durumda olduğundan, bu linki başkasıyla paylaşma ve Anthropic
   Console'dan bu anahtara bir aylık harcama limiti koy.

## Yapay zeka asistanı

Sağ alttaki sohbet ikonuna dokunarak açılır. İki şey yapabilir:
- Verilerin hakkında soru cevaplar (örn. "bu hafta kaç antrenman yaptım").
- Senin adına veri ekler/değiştirir (örn. "bugünü push günü yap ve chest
  press 4x10 60kg ekle") — bunun için mevcut günlere egzersiz seti, öğün,
  kardiyo, kilo, adım ve vücut ölçüsü (örn. "biceps 38 cm") kaydı eklemek, ve
  bir günün antrenman türünü ayarlamak gibi araçları kullanır. (Fotoğraf
  eklemeyi asistan üzerinden yapamazsın — bunun için Vücut Ölçüleri
  kartındaki "Fotoğraf Kaydet" formunu kullan.)

## Vücut ölçüleri ve fotoğraf

Ana sayfadaki "Vücut Ölçüleri" kartından (veya sağ alttaki yapay zeka asistanından,
örn. "bugün biceps 38 cm") biceps, bel, göğüs, kalça, uyluk, baldır, omuz, boyun,
önkol gibi bölgelere tarihli ölçüm eklenebilir; her bölge için ilk kayıtla son
kayıt otomatik karşılaştırılır (örn. "Biceps ↑ 3"). Aynı yerden tarihli vücut
fotoğrafı da eklenebilir; en eski ve en yeni fotoğraf otomatik yan yana
("İlk" / "Son") gösterilir.

**Önemli — fotoğraf boyutu:** Fotoğraflar cihazda otomatik küçültülüp
sıkıştırılıyor (yaklaşık birkaç on KB) ve doğrudan Firestore belgesinin içine
kaydediliyor (ayrı bir dosya deposu kurulmadı). Firestore'da tek bir belge en
fazla ~1 MB olabiliyor; çok sayıda fotoğraf biriktirirse bir noktadan sonra
kayıtlar başarısız olur ve uygulama sessizce "Bu cihazda" (yalnızca yerel)
moduna düşer. Böyle bir şey fark edersen (üstte sürekli "Bu cihazda" yazması)
Vücut Ölçüleri > Fotoğraf Geçmişi'nden birkaç eski fotoğrafı silmen yeterli.

## Cihazlar arası senkron (telefon + bilgisayar aynı veriyi görsün)

Uygulama açılışta görünmez (anonim) bir Firebase oturumu açar ve bu oturum
**cihaza/tarayıcıya özeldir** — yani telefonda ve bilgisayarda açılan iki anonim
oturum, varsayılan olarak birbirinden habersiz iki ayrı (ve boş) Firestore
belgesi kullanır. Aynı verilere birden fazla cihazdan ulaşmak için anonim
oturumu kalıcı bir e-posta/şifre hesabına bağlamak gerekir:

1. Firebase Console > Authentication > Sign-in method'dan **Email/Password**'ü
   aç (bir kere, kurulum adımı 2'de de belirtildi).
2. Verilerin olduğu cihazda (genelde telefon) Ayarlar > **Cihazlar Arası
   Senkron** bölümünü aç, bir e-posta ve şifre gir, "Hesabı Oluştur ve Bağla"ya
   bas. Bu işlem mevcut verileri taşımaz/silmez — sadece aynı veriye artık bir
   e-posta/şifre ile de erişilebilir hale gelir.
3. Diğer cihazda (örneğin bilgisayar) aynı Ayarlar bölümünden, aynı e-posta ve
   şifre ile "Giriş Yap"a bas. O cihaz artık aynı hesaba/verilere bağlanır.

Her cihazda bu işlemi bir kere yapman yeterli; sonrasında oturum o cihazda
kalıcı olarak açık kalır ve normal gerçek zamanlı senkron devam eder.

## Apple Sağlık'tan otomatik adım/kardiyo çekme (iPhone Kısayollar)

Apple, Sağlık verilerini hiçbir zaman bir web sitesine açmıyor (HealthKit sadece
gerçek bir iPhone uygulamasından erişilebilir); Huawei Health'in gerçek bir API'si
var ama Huawei Developer hesabı açıp onay almayı gerektiriyor — kişisel, tek
kullanıcılı bir site için pratik değil. Bunun yerine uygulama, adresine özel bir
sorgu parametresiyle açılınca sessizce **bugünün** adım sayısını/kardiyosunu
kaydeden bir "içe aktarma" kapısı içeriyor:

```
https://celenks.github.io/Spor-Defteri/?adim=8412
https://celenks.github.io/Spor-Defteri/?kardiyoTip=kosu&kardiyoDk=32&kardiyoKm=5.1&kardiyoKcal=310&kardiyoId=2026-09-27-sabah
```

- `adim`: bugünün toplam adım sayısı (sayı).
- `kardiyoTip`: `yurus`, `kosu`, `bisiklet`, `yuzme`, `ip` veya `diger`.
- `kardiyoDk`: kardiyo süresi (dakika).
- `kardiyoKm`, `kardiyoKcal`: opsiyonel, mesafe (km) ve kalori — verilmezse
  uygulama kaloriyi kendi formülüyle hesaplar.
- `kardiyoId`: aynı antrenmanı iki kez eklememek için benzersiz bir metin (ör.
  antrenmanın başlangıç saati) — aynı `kardiyoId` ile tekrar açarsan kardiyo
  kaydı tekrar eklenmez, sadece adım güncellenir.

Sayfa açılır açılmaz bu değerleri kaydedip adres çubuğundaki parametreleri
temizliyor ve seni doğrudan bugünün Kardiyo ekranına götürüyor.

**Önemli — "hesap" ve "anahtar" parametreleri (PWA kullananlar için şart):**
iOS, uygulamayı Ana Ekran'a ekleyip (PWA) oradan kullanırken ile Kısayol'un
açtığı normal Safari sekmesi için **ayrı bir depolama/anonim oturum**
kullanabiliyor. Bu durumda yukarıdaki basit `?adim=...` linki, verini Safari'nin
kendi (boş) oturumuna yazar ve Ana Ekran'daki uygulamada hiçbir zaman görünmez —
"adım otomatik çekilmiyor" şikayetinin asıl sebebi genelde bu. Bunu kesin olarak
çözmek için linke hesabını tanımlayan iki parametre daha eklenmeli:

```
https://celenks.github.io/Spor-Defteri/?adim=8412&hesap=UID&anahtar=OTURUM_ANAHTARI
```

`UID` ve `OTURUM_ANAHTARI` değerlerini **Ayarlar > Kısayol (Otomasyon)
Bağlantısı** bölümünden kopyalayabilirsin — en alttaki "Örnek tam adres" alanı
zaten `adim=8000` ile hazır bir şablon veriyor, sadece `8000` kısmını Kısayol'daki
adım değişkeniyle değiştirmen yeterli. Bu iki parametre verildiğinde uygulama o
anki tarayıcı oturumunu hiç kullanmıyor; doğrudan Firestore'a, hesabına özel
olarak yazıyor — hangi bağlamda açılırsa açılsın (Safari, PWA, başka bir cihaz)
veri her zaman doğru yere gider. Sayfa da normal arayüz yerine sadece kısa bir
"Kaydedildi ✓" onayı gösterip kapanmaya hazır hale gelir. `hesap`/`anahtar`
olmadan sadece `adim` ile açarsan eski (tarayıcı oturumuna bağlı) yöntem
çalışmaya devam eder — ama PWA kullanıyorsan önerilmez.

**iPhone'da tek dokunuşluk Kısayol kurmak için:**

1. Kısayollar uygulamasını aç → sağ üstten "+" ile yeni bir Kısayol oluştur, adını
   "Spor Defteri Sağlık" gibi bir şey koy.
2. Arama kutusuna "Sağlık" (Health) yaz, adım sayısını (Adımlar/Steps) bugün için
   getiren bir eylem ekle (ör. "Sağlık Örneklerini Bul" / "Find Health Samples" →
   Tür: Adımlar, Başlangıç: Bugün — birden fazla örnek gelirse aralarına bir
   "İstatistik Hesapla" / "Calculate Statistics" → Toplam adımı ekle).
3. "Metin" (Text) eylemiyle şu adresi oluştur (adım sayısı değişkenini uygun yere
   ekleyerek — Ayarlar'daki örnek adresi kopyalayıp üzerine yazman en kolayı):
   `https://celenks.github.io/Spor-Defteri/?adim=` + [adım sayısı] + `&hesap=UID&anahtar=OTURUM_ANAHTARI`
4. "URL'leri Aç" (Open URLs) eylemiyle bu metni aç.
5. (İstersen kardiyo için) "Sağlık Örneklerini Bul" yerine "Antrenmanları Bul" /
   "Find Workouts" → Başlangıç: Bugün ekleyip Süre/Mesafe/Toplam Enerji alanlarını
   al, tür alanına göre birkaç "Eğer" (If) bloğuyla `kardiyoTip`i belirle (Koşu→kosu,
   Yürüyüş→yurus, Bisiklet→bisiklet, Yüzme→yuzme, diğerleri→diger), sonra 3. adımdaki
   metne `&kardiyoTip=...&kardiyoDk=...&kardiyoKm=...&kardiyoKcal=...&kardiyoId=...`
   ekle (kardiyoId için antrenmanın başlangıç tarihini/saatini kullanabilirsin).
6. Kısayolu Ana Ekran'a ekle (Kısayolun paylaş/ayarlar menüsünden "Ana Ekrana Ekle")
   veya Otomasyonlar'dan "her gün saat X'te" otomatik çalışacak şekilde ayarla —
   "Çalıştırmadan Önce Sor" (Ask Before Running) kapalı olmalı, yoksa otomasyon
   bildirim olarak bekler ve sen dokunmazsan hiç çalışmaz.

Tam menü/eylem adları iOS sürümüne göre küçük farklılıklar gösterebilir; takılırsan
ekran görüntüsü at, birlikte ilerleriz. Huawei Health için bu yöntemin bir eşdeğeri
yok — o taraf şimdilik elle giriş ile devam ediyor.

## Yerel geliştirme

`index.html` tek başına açılabilir; `firebase-config.js` boşsa uygulama
sadece bu cihazdaki tarayıcı deposunu (localStorage) kullanarak çalışmaya
devam eder (üstte "Bu cihazda" yazar).
