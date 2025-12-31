
# AICARE W33 - Landing Page 0Đ

Trang web landing page giới thiệu chương trình tặng máy đo đường huyết AICARE W33 của Đức Phương Medical.

## 🚀 Tính năng
- Đặt hàng trực tiếp gửi về Google Sheets.
- Trợ lý tư vấn sức khỏe tích hợp Gemini AI.
- Giao diện tối ưu cho thiết bị di động (Mobile First).
- Hệ thống quản trị (Admin) tích hợp sẵn.

## 🛠️ Cài đặt cục bộ (Local)

1. Cài đặt các thư viện:
```bash
npm install
```

2. Chạy môi trường phát triển:
```bash
npm run dev
```

3. Đóng gói để đưa lên Host:
```bash
npm run build
```

## 🌐 Triển khai lên Netlify (Khuyên dùng)
1. Đẩy code lên GitHub.
2. Kết nối GitHub với Netlify.
3. Trong cấu hình Netlify, thêm **Environment Variable** tên là `API_KEY` với mã API Gemini của bạn.
4. Build command: `npm run build`
5. Publish directory: `dist`

## 📊 Kết nối Google Sheets
Truy cập Admin (Mật khẩu: `123456`) ở cuối trang để dán link Google Apps Script.
