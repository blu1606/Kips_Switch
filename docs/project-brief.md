# Project Brief: Deadman's Switch (Digital Legacy Protocol)

## 1. Executive Summary
**Deadman's Switch** là giao thức thừa kế kỹ thuật số phi tập trung (Decentralized Digital Legacy Protocol) trên Web3. Dự án giải quyết vấn đề mất mát tài sản và thông tin kỹ thuật số khi chủ sở hữu qua đời hoặc mất khả năng truy cập.

Hệ thống hoạt động như một công tắc an toàn: Người dùng gửi bằng chứng sự sống (Proof-of-Liveness) định kỳ. Nếu quá hạn check-in, Smart Contract tự động chuyển quyền truy cập dữ liệu đã mã hóa (Private Key, thư tuyệt mệnh, tài liệu) cho ví người nhận được chỉ định.

**Mục tiêu cốt lõi:** Xây dựng MVP hoàn chỉnh trong **5 ngày** với tính năng cốt lõi: Tạo Vault, Check-in, và Claim tài sản an toàn.

## 2. Problem Statement
* **Mất mát vĩnh viễn:** Hàng tỷ USD tài sản crypto bị đóng băng vĩnh viễn vì chủ sở hữu qua đời mà không kịp chia sẻ Private Key.
* **Phụ thuộc trung gian:** Các giải pháp Web2 (Google) hoặc pháp lý truyền thống thiếu quyền riêng tư, có thể bị kiểm duyệt, và không hỗ trợ Native Crypto.
* **Rủi ro bảo mật:** Lưu trữ thông tin nhạy cảm trên server tập trung dễ bị lộ lọt.

## 3. Proposed Solution
Xây dựng DApp trên **Base L2** với kiến trúc **Hybrid (Lai tạo)** để tối ưu trải nghiệm và bảo mật:
* **Zero-Knowledge Architecture:** Dữ liệu được mã hóa Client-side trước khi upload. Hệ thống không bao giờ nhìn thấy nội dung gốc.
* **Smart Contract Logic:** Quản lý trạng thái "Sống/Mất" và phân quyền truy cập Key giải mã một cách phi tập trung (Trustless).
* **Hybrid Notification:** Sử dụng backend nhẹ để gửi Email thông báo/nhắc nhở, kết hợp với sự chắc chắn của Blockchain.

## 4. Target Users
* **Crypto Investors:** Người nắm giữ tài sản số cần phương án thừa kế an toàn.
* **Privacy Advocates:** Nhà báo, nhà hoạt động cần cơ chế bảo vệ thông tin.
* **Người dùng phổ thông:** Muốn lưu trữ "Di chúc số" hiện đại, không phụ thuộc luật sư.

## 5. MVP Scope (5-Day Timeline)

### ✅ Core Features (Must Have)
1.  **Vault Creation:**
    * Upload File (Max 50MB) hoặc nhập Text.
    * Mã hóa AES Client-side.
    * Upload IPFS (qua Pinata).
    * Tạo Smart Contract lưu trữ Hash và Encrypted Key cho người nhận.
2.  **Check-in Mechanism (Option 1):**
    * Nút bấm "I'm Alive" trên Dashboard.
    * Thực hiện giao dịch on-chain (trả gas bằng ETH trên Base) để reset timer.
3.  **Trigger & Notification:**
    * Backend Cronjob quét trạng thái contract.
    * Gửi Email nhắc nhở user trước hạn check-in.
    * Gửi Email báo cho người nhận khi Vault mở (Timeout).
4.  **Claim Portal:**
    * Người nhận kết nối ví.
    * Contract kiểm tra quyền hạn.
    * Client giải mã Key -> Giải mã File -> Download.

### ❌ Out of Scope (Phase 2)
* Check-in bằng chữ ký miễn phí gas (Gasless Signature).
* Tự động thanh lý tài sản DeFi (Swap token).
* Biometric check-in (FaceID).
* Chia sẻ theo phần trăm (Shares) - Hiện tại: Unlock là Full Access.
* Lit Protocol (Dùng AES đơn giản cho MVP).

## 6. Goals & Success Metrics
* **Functional Goal:** Hoàn thành luồng E2E (Tạo -> Check-in -> Timeout -> Claim) không lỗi nghiêm trọng.
* **Time Goal:** Code xong và Deploy Testnet trong 4 ngày, Polish ngày thứ 5.
* **Security Goal:** Dữ liệu trên IPFS không thể bị đọc nếu không có ví người nhận.

## 7. Technical Considerations
* **Blockchain:** Base Sepolia (Testnet) -> Base Mainnet (Gas rẻ).
* **Frontend:** Next.js, RainbowKit, TailwindCSS.
* **Cryptography:** CryptoJS (AES-GCM), Web Crypto API.
* **Storage:** Pinata (IPFS Pinning Service).
* **Backend:** Next.js API Routes + Cronjob (Vercel Cron hoặc script đơn giản).

## 8. Risks & Mitigation
* **User quên check-in:** Gửi email nhắc nhở dồn dập (7 ngày, 3 ngày, 1 ngày).
* **Mất key người nhận:** Cảnh báo người dùng nên setup nhiều ví nhận (nếu kịp) hoặc lưu trữ key cẩn thận.
* **Browser Crash khi mã hóa:** Giới hạn file upload < 50MB.
