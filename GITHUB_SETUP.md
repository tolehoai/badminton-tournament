# 🚀 Hướng dẫn Setup GitHub Repository

## Bước 1: Tạo Repository trên GitHub

1. **Đăng nhập GitHub** và vào trang chủ
2. **Click "New"** hoặc **"+"** → **"New repository"**
3. **Điền thông tin:**
   - **Repository name**: `badminton-tournament`
   - **Description**: `A comprehensive React-based tournament management application for badminton competitions`
   - **Visibility**: Public (hoặc Private tùy chọn)
   - **Không check** "Add a README file" (vì đã có)
   - **Không check** "Add .gitignore" (vì đã có)
   - **Không check** "Choose a license" (vì đã có)

4. **Click "Create repository"**

## Bước 2: Cập nhật Remote URL

Thay thế `yourusername` bằng username GitHub của bạn:

```bash
# Xóa remote cũ
git remote remove origin

# Thêm remote mới với username thực
git remote add origin https://github.com/tolehoai/badminton-tournament.git

# Kiểm tra remote
git remote -v
```

## Bước 3: Push Main Branch

```bash
# Push main branch lên GitHub
git push -u origin main
```

## Bước 4: Chạy Script Tạo PRs

```bash
# Chạy script để tạo tất cả branches và commits
./create_prs.sh
```

## Bước 5: Tạo Pull Requests trên GitHub

Sau khi chạy script, vào GitHub repository và tạo PR cho từng branch:

### PR 1: Fix TypeErrors và Logic Improvements
- **Source branch**: `fix/type-errors-and-logic-improvements`
- **Target branch**: `main`
- **Title**: `fix: resolve TypeError issues and improve tournament logic`
- **Description**: Sử dụng từ `PR_GUIDE.md`

### PR 2: Group Layout và Styling
- **Source branch**: `feature/group-layout-and-styling`
- **Target branch**: `main`
- **Title**: `feat: improve group layout and styling`
- **Description**: Sử dụng từ `PR_GUIDE.md`

### PR 3: Random Score Generation
- **Source branch**: `feature/random-score-generation`
- **Target branch**: `main`
- **Title**: `feat: add random score generation functionality`
- **Description**: Sử dụng từ `PR_GUIDE.md`

### PR 4: Simplified Knockout Stage
- **Source branch**: `feature/simplified-knockout-stage`
- **Target branch**: `main`
- **Title**: `feat: simplify knockout stage structure`
- **Description**: Sử dụng từ `PR_GUIDE.md`

### PR 5: Component Architecture Refactor
- **Source branch**: `refactor/component-architecture`
- **Target branch**: `main`
- **Title**: `refactor: restructure code into component-based architecture`
- **Description**: Sử dụng từ `PR_GUIDE.md`

### PR 6: CSS Conflicts và Styling Fixes
- **Source branch**: `fix/css-conflicts-and-styling`
- **Target branch**: `main`
- **Title**: `fix: resolve CSS conflicts and improve styling`
- **Description**: Sử dụng từ `PR_GUIDE.md`

### PR 7: Player Profile Modal
- **Source branch**: `feature/player-profile-modal`
- **Target branch**: `main`
- **Title**: `feat: add player profile modal with detailed statistics`
- **Description**: Sử dụng từ `PR_GUIDE.md`

### PR 8: Keyboard Shortcuts
- **Source branch**: `feature/keyboard-shortcuts`
- **Target branch**: `main`
- **Title**: `feat: add keyboard shortcuts for better user experience`
- **Description**: Sử dụng từ `PR_GUIDE.md`

## Bước 6: Merge PRs theo thứ tự

Merge các PR theo thứ tự sau để đảm bảo không có conflicts:

1. **PR 1**: Fix TypeErrors (cơ sở)
2. **PR 2**: Group Layout (UI improvements)
3. **PR 3**: Random Score Generation (features)
4. **PR 4**: Simplified Knockout (logic)
5. **PR 5**: Component Architecture (refactor)
6. **PR 6**: CSS Fixes (styling)
7. **PR 7**: Player Profile (features)
8. **PR 8**: Keyboard Shortcuts (UX)

## Bước 7: Cleanup

Sau khi merge tất cả PRs:

```bash
# Xóa các feature branches đã merge
git checkout main
git pull origin main

# Xóa local branches
git branch -d fix/type-errors-and-logic-improvements
git branch -d feature/group-layout-and-styling
git branch -d feature/random-score-generation
git branch -d feature/simplified-knockout-stage
git branch -d refactor/component-architecture
git branch -d fix/css-conflicts-and-styling
git branch -d feature/player-profile-modal
git branch -d feature/keyboard-shortcuts

# Xóa remote branches
git push origin --delete fix/type-errors-and-logic-improvements
git push origin --delete feature/group-layout-and-styling
git push origin --delete feature/random-score-generation
git push origin --delete feature/simplified-knockout-stage
git push origin --delete refactor/component-architecture
git push origin --delete fix/css-conflicts-and-styling
git push origin --delete feature/player-profile-modal
git push origin --delete feature/keyboard-shortcuts
```

## 🎯 Kết quả cuối cùng

Sau khi hoàn thành, bạn sẽ có:
- ✅ Repository GitHub với code hoàn chỉnh
- ✅ 8 Pull Requests với descriptions chi tiết
- ✅ Lịch sử commit rõ ràng cho từng feature
- ✅ Documentation đầy đủ
- ✅ Code structure tốt và maintainable

## 📝 Lưu ý

- ✅ Remote URL đã được cập nhật với username: `tolehoai`
- Nếu có lỗi khi push, có thể cần authenticate với GitHub
- Có thể sử dụng GitHub CLI hoặc GitHub Desktop để dễ dàng hơn
- Nên review từng PR trước khi merge để đảm bảo chất lượng code
