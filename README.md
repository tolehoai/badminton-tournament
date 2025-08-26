# Badminton Tournament Manager

Ứng dụng quản lý giải đấu cầu lông với khả năng quản lý player linh hoạt.

## Tính năng chính

### Quản lý Player
- **Thêm Player mới**: Có thể thêm player mới vào bảng A hoặc B
- **Di chuyển Player**: Chuyển player giữa bảng A và B
- **Xóa Player**: Xóa player khỏi bảng
- **Reset về dữ liệu ban đầu**: Khôi phục về danh sách player gốc

### Quản lý Giải đấu
- **Vòng bảng**: Thi đấu vòng tròn một lượt trong mỗi bảng
- **Vòng loại trực tiếp**: Bán kết → Tranh hạng 3 → Chung kết
- **Tính điểm**: Hệ thống tính điểm tự động
- **Xếp hạng**: Xếp hạng theo số trận thắng và hiệu số điểm

### Giao diện
- **Đa ngôn ngữ**: Hỗ trợ tiếng Việt và tiếng Anh
- **Responsive**: Giao diện thích ứng với mọi thiết bị
- **Modal**: Các cửa sổ popup để quản lý player

## Cách sử dụng

### Thêm Player mới
1. Click vào nút ⚙️ (Settings) ở góc trên bên phải
2. Chọn "Thêm VĐV" hoặc "Add Player"
3. Nhập tên player và chọn bảng (A hoặc B)
4. Click "Thêm vào bảng" hoặc "Add to Group"

### Di chuyển Player
1. Vào tab "VĐV" hoặc "Players" của bảng
2. Click nút ↔️ bên cạnh tên player
3. Xác nhận việc di chuyển

### Xóa Player
1. Vào tab "VĐV" hoặc "Players" của bảng
2. Click nút 🗑️ bên cạnh tên player
3. Xác nhận việc xóa

### Reset về dữ liệu ban đầu
1. Click vào nút ⚙️ (Settings)
2. Chọn "Reset về dữ liệu ban đầu" hoặc "Reset to Initial Data"
3. Xác nhận việc reset

## Cấu trúc dữ liệu

Dữ liệu được lưu trữ trong LocalStorage:
- `badminton_tourney_v8_group_data`: Danh sách player trong các bảng
- `badminton_tourney_v8_fixtures`: Lịch đấu và kết quả
- `badminton_tourney_v8_bk`: Kết quả vòng loại trực tiếp
- `badminton_tourney_v8_lang`: Ngôn ngữ hiện tại

## Công nghệ sử dụng

- React 18
- CSS3 với CSS Variables
- LocalStorage để lưu trữ dữ liệu
- Responsive design

## Cài đặt và chạy

```bash
npm install
npm run dev
```

Ứng dụng sẽ chạy tại `http://localhost:5173`
