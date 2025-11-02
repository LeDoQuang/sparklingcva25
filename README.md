🧠 Hướng dẫn cho AI – Dự án “Sparkling Chu Văn An Landing Page”

Repo GitHub: https://github.com/LeDoQuang/sparklingcva25

📘 Mục đích: Giúp các công cụ AI trong VS Code (GitHub Copilot, ChatGPT, Codeium, v.v.) hiểu cấu trúc, phong cách code, và định hướng phát triển của website này.

🎯 Mục tiêu dự án

Trang web giới thiệu và cập nhật sự kiện “Vẻ đẹp học sinh Chu Văn An – Sparkling CVA”, được thiết kế theo phong cách:

Hiện đại, chuyển động nhẹ, nhiều “element động”

Không dùng framework (HTML, CSS, JS thuần)

Tối ưu di động, tải nhanh, dễ mở rộng

🧱 Nguyên tắc khi AI hỗ trợ sinh code

Không dùng framework
→ Chỉ dùng HTML, CSS, JavaScript thuần.
❌ Không React, Bootstrap, Vue, Tailwind.

Thiết kế mobile-first
→ Dùng CSS Grid/Flex, test ở các kích thước 360px – 1440px.

Hiệu ứng động nhưng nhẹ
→ Dùng CSS transition hoặc IntersectionObserver.
❌ Không dùng thư viện nặng (GSAP, jQuery...).

Giao diện phải “trẻ, sạch, mượt”
→ Màu pastel, gradient nhẹ, text sáng trên nền tối.

Code có cấu trúc, dễ đọc, có chú thích rõ ràng

Dùng // === phần === để chia nhóm JS.

Giữ format 2 space, indent hợp lý.

Ưu tiên code dễ hiểu hơn là ngắn.

📁 Cấu trúc dự án
root/
├─ index.html        # Toàn bộ code HTML/CSS/JS
├─ README.md         # File hướng dẫn này
└─ assets/ (tùy chọn)
   ├─ css/
   ├─ js/
   └─ img/

⚙️ Chức năng hiện có
Thành phần	Mô tả	Công nghệ dùng
Thanh điều hướng	Dính trên đầu, tự highlight mục đang xem	IntersectionObserver
Hiệu ứng cuộn hiện dần	Các phần tử xuất hiện khi cuộn tới	CSS + JS
Counter	Chạy số tăng dần khi xuất hiện	JS animation
Carousel	Lướt trái/phải nội dung	transform + JS
Timeline	Dòng thời gian sự kiện	HTML + CSS
Accordion (FAQ)	Mở/đóng mượt	JS toggle max-height
Cuộn mượt	Khi click menu	CSS scroll-behavior
Countdown (TODO)	Đếm ngược đến sự kiện, chuyển “Đã diễn ra”	Đang phát triển
🎨 Quy tắc style
Biến màu trong :root
:root {
  --bg:#0b1220;     /* nền tối */
  --ink:#e6f0ff;    /* màu chữ chính */
  --brand:#6ae3ff;  /* màu nhấn 1 */
  --brand2:#7cffb2; /* màu nhấn 2 */
  --card:#11182b;   /* màu thẻ */
}

JS

✅ Dùng const, let — không dùng var
✅ Dùng hàm mũi tên (()=>{})
✅ Comment logic rõ ràng
✅ Mọi script đặt cuối <body>
✅ Không chạy vòng lặp vô hạn

🪄 Cách AI nên hỗ trợ khi lập trình
Khi sinh code mới

Dùng thẻ semantic (<section>, <article>, <nav>, <footer>).

Giữ nguyên format & style hiện có.

Giải thích code bằng comment ngắn gọn, bằng tiếng Việt.

Khi AI sửa code

Giữ nguyên cấu trúc gốc (đừng đổi toàn bộ).

Khi tối ưu hiệu năng, nêu lý do bằng comment.

Không tự động thêm thư viện ngoài.

🧠 Câu lệnh mẫu cho AI (trong VS Code)
/ask thêm module đếm ngược sự kiện (countdown) cho từng event
/ask viết hàm render bảng điểm của các Nhà theo JSON
/fix vì sao hiệu ứng reveal bị giật trên mobile
/refactor tách CSS nội tuyến ra file main.css
/comment giải thích cách hoạt động của carousel
/generate thêm section “Bảng điểm các Nhà” có animation điểm tăng

🚀 Chạy thử & deploy
Cách 1: Dùng Live Server (khuyên dùng)

Mở thư mục dự án bằng VS Code

Cài extension Live Server (Ritwick Dey)

Chuột phải index.html → Open with Live Server

Cách 2: Chạy thủ công
python -m http.server 5500
# mở trình duyệt http://localhost:5500

Deploy GitHub Pages

Commit và push code lên GitHub

Vào Settings → Pages → Build and deployment → Deploy from a branch

Chọn main / (root)

Truy cập: https://<tên-bạn>.github.io/sparkling-cva/

📌 Quy ước khi commit (cho AI & team)

Dùng chuẩn Conventional Commits

feat: thêm section Countdown cho sự kiện
fix: sửa bug không đếm ngược đúng múi giờ
style: chỉnh màu pastel cho thẻ card
refactor: tách code JS ra module riêng
docs: cập nhật hướng dẫn AI trong README

🧩 Nhiệm vụ sắp tới (AI có thể gợi ý)

 Module Countdown tự động phân loại “Sắp diễn ra / Đang diễn ra / Đã kết thúc”

 Thêm bảng điểm các Nhà (leaderboard)

 Kết nối dữ liệu qua JSON / Google Sheets

 Thêm ảnh & video highlight sự kiện

 Thêm thẻ meta SEO + ảnh share

---

## Cập nhật điểm nhà hằng tuần (points.json)

Để website tự động cập nhật thứ hạng và đưa nhà cao điểm nhất vào giữa, mỗi tuần bạn chỉ cần sửa file `points.json` ở thư mục gốc.

Hai dạng dữ liệu được hỗ trợ:

1) Mảng điểm đơn giản

```
[
  { "code": "a", "points": 512 },
  { "code": "p", "points": 498 },
  { "code": "e", "points": 473 },
  { "code": "i", "points": 461 },
  { "code": "s", "points": 450 },
  { "code": "m", "points": 432 },
  { "code": "v", "points": 401 },
  { "code": "d", "points": 389 }
]
```

2) Đối tượng có thông tin tuần + mảng điểm

```
{
  "week": 5,
  "updatedAt": "2025-11-02",
  "points": [
    { "code": "a", "points": 512 },
    { "code": "p", "points": 498 }
  ]
}
```

Ghi chú:
- `code` là ký tự nhà: a, p, e, i, s, m, v, d.
- Website sẽ đọc `points.json` (nếu có), ghi đè điểm, tự tính lại xếp hạng và đưa nhà cao điểm nhất vào giữa vòng.
- Tên/giới thiệu/nhạc cụ… vẫn lấy từ `ttin.txt` (JSON hoặc phần prose). `points.json` chỉ cập nhật điểm.
- Có thể thêm code mới trong `points.json`; site sẽ hiển thị với ảnh `photo/<code>.png` nếu tồn tại.
- Dữ liệu được tải với `cache: no-store`; chỉ cần lưu file và refresh là thấy thay đổi.