// Bu dosya BİLEREK boş bırakılıyor. Gerçek Anthropic API anahtarı buraya
// commit edilmiyor (edilirse GitHub bunu herkese açık repoda tespit edip
// Anthropic'e bildiriyor ve anahtar otomatik iptal ediliyor — bu bir kere
// başımıza geldi). Bunun yerine anahtar bir GitHub Actions "repository
// secret" olarak saklanıyor ve her deploy'da .github/workflows/deploy.yml
// tarafından bu dosyanın içine otomatik yazılıyor. Yerelde (bilgisayarında
// index.html'i doğrudan açarsan) bu dosya boş kalır, asistan "henüz
// kurulmamış" der — bu normaldir.
window.anthropicApiKey = "";
