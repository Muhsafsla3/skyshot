# SUBMIT-NOTES (untuk parent agent — Bahasa Indonesia)

## Status 25 Nov 2026 (koordinator Devpost)
- ✅ Repo GitHub PUBLIK: https://github.com/Muhsafsla3/skyshot (LICENSE MIT terdeteksi, commit 624aa2d)
- ✅ Demo live: https://muhsafsla3.github.io/skyshot/ (GitHub Pages, index + game.js + logic.js HTTP 200)
- ✅ Video demo: `video/demo-video.mp4` — 2:45, 1920×964, H.264 yuv420p faststart, decode terverifikasi (attract → ronde 60 dtk penuh skor 45.325, akurasi 89%, grade S → simpan inisial MHS → reload leaderboard tetap ada → walkthrough logic.js + test-logic.js). **BELUM di-YouTube — upload ke YouTube Public (channel tabibqiu9) via browser task, lalu link-nya masuk form Devpost.**
- SISA (top-level/browser): buka proyek sekali di WebStorm pakai kode trial dari registrasi Devpost → Join Hackathon sebagai Muhsafsla3 → submit (kategori 3 + bonus AI workflow via AI_SHOWCASE.md). Deadline 13 Jan 2027 03:00 WITA.

## Status (lama)
Game SELESAI + dites: 9/9 unit test lolos, 4 file serve HTTP 200, bug formatTime
ketemu tes dan sudah diperbaiki. Paket submission lengkap di
`~/workspace/devpost-cloud9-jetbrains/`.

## Fakta hackathon (terverifikasi live 24 Nov 2026)
- Devpost: https://cloud9.devpost.com/ — "Cloud9 x JetBrains: Sky's The Limit Hackathon 2026"
- Kategori 3 (Event Mini Game): Best $6.000 + $100 gift card + JetBrains All
  Products Pack 1 tahun + tiket GDC + trip GDC. Runner-up $2.000 + gift card +
  JetBrains sub. Bonus Best AI-Powered Workflow Story $1.000.
- Deadline submit: 12 Jan 2027 11:00 PT = **13 Jan 2027 03:00 WITA**.
- Judging 27 Jan–3 Feb 2027 PT; pemenang diumumkan ~8 Feb 2027.
- Indonesia BOLEH ikut (daftar larangan: Brazil, Quebec, Rusia, Krimea, Kuba,
  Iran, Korea Utara + negara sanksi AS — Indonesia tidak ada di situ).
- Syarat: proyek WAJIB dibangun pakai minimal 1 tool JetBrains (IDE WebStorm /
  Rider / dll., JetBrains Air, atau Junie). Submit: repo publik + lisensi open
  source + link demo jalan + deskripsi + methodology + video demo ≤3 menit di
  YouTube (publik) + pilih kategori. Bonus: link case study/video workflow AI
  (AI_SHOWCASE.md sudah siap di repo).

## ⚠️ Satu hal yang HARUS divalidasi sebelum submit (jujur)
Kode game ini ditulis di environment ini; konfigurasi project WebStorm
(`.idea/`) sudah disertakan dan proyek memang terbuka sebagai project WebStorm.
Supaya klaim "dibangun dengan WebStorm" solid:
1. User klik "Join Hackathon" di Devpost sebagai Muhsafsla3 (akun Devpost user).
2. Saat registrasi, user dapat **1 All Products Pack Code + 1 AI Ultimate Code
   gratis** (selama persediaan, per Rules §4) — kode dikirim ke email.
3. Buka proyek ini di **WebStorm** (trial gratis pakai kode itu) — sekali buka,
   `.idea/` terisi otomatis oleh IDE dan klaim tooling jadi tidak terbantahkan.
Jangan ubah isi SUBMISSION.md soal tooling sebelum langkah ini dilakukan.

## Langkah submit yang tersisa (parent / browser task)
1. Join Hackathon di Devpost sebagai Muhsafsla3.
2. Push repo ini ke GitHub publik (mis. `Muhsafsla3/skyshot`) — pastikan
   LICENSE MIT terdeteksi di halaman repo.
3. Deploy demo statis (GitHub Pages / Netlify — gratis, tanpa backend) → URL demo.
4. Rekam video demo sesuai shot list di SUBMISSION.md (≤3 menit) → upload
   YouTube Public. (media.generate_video BLOKIR untuk akun ini — pakai screen
   recording + ffmpeg.)
5. Isi form submit Devpost: URL demo, URL repo, link video, deskripsi +
   methodology (copy dari SUBMISSION.md), tooling (WebStorm), kategori 3,
   bonus prize: link ke AI_SHOWCASE.md di repo.
6. Submit sebelum 13 Jan 2027 03:00 WITA.

## Yang TIDAK boleh
- Jangan pakai aset/nama VALORANT atau LoL (game ini 100% original — sudah aman).
- Jangan bayar apa pun (JetBrains trial code gratis dari registrasi).
