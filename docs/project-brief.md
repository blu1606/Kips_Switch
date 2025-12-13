# Project Brief: Deadman's Switch (Digital Guardian)

## 1. Executive Summary
**Deadman's Switch** là giao thức bảo vệ di sản kỹ thuật số (Digital Legacy Protocol) trên **Solana**. Dự án không chỉ giải quyết vấn đề mất mát tài sản khi chủ sở hữu qua đời, mà còn biến việc "Check-in" nhàm chán thành trải nghiệm nuôi dưỡng một **Digital Guardian (Kip)**.

**Mục tiêu cốt lõi:** Xây dựng Consumer App thân thiện nhất trên Solana, nơi người dùng "nuôi" Kip hàng tháng để giữ an toàn cho bí mật của họ.

---

## 2. Problem Statement
*   **Mất mát vĩnh viễn:** Hàng tỷ USD crypto bị mất vì chủ sở hữu mất private key hoặc gặp rủi ro đột ngột.
*   **Trải nghiệm tẻ nhạt (The "Boring" Problem):** Các giải pháp thừa kế hiện tại quá tập trung vào cái chết (morbid), khiến người dùng trì hoãn việc setup.
*   **Rào cản gia nhập:** Người dùng phổ thông (Non-crypto) sợ gas fee, sợ ví, sợ check-in phức tạp.

## 3. Proposed Solution
Xây dựng **"Tamagotchi for your Legacy"** trên Solana:
*   **Gamified Check-in:** Người dùng check-in để "cho Kip ăn". Kip vui -> Vault an toàn. Kip đói -> Cảnh báo. Kip "ma" -> Vault mở.
*   **Silent Guardian:** Dữ liệu được mã hóa Client-side (Zero-Knowledge). Server và Blockchain chỉ giữ Key đã mã hóa.
*   **Flash Onboarding:** Cho phép thử nghiệm (Try Demo) trong 30 giây mà không cần ví, không cần SOL.

## 4. Target Users
*   **Crypto Natives:** Cần backup cho Seed Phrase.
*   **Gen Z / Digital Citizens:** Thích trải nghiệm interactive, gamified.
*   **Non-technical Users:** Cần giải pháp thừa kế đơn giản cho gia đình.

## 5. Key Features (MVP + Phase 8, 9)

### ✅ Core Features
1.  **Vault Creation:** Upload File/Text -> Mã hóa AES Client-side -> IPFS.
2.  **Gamified Check-in:** Ấn "Feed Kip" để reset timer (Solana Transaction).
3.  **Claim Portal:** Người nhận kết nối ví để giải mã và nhận tài sản.

### 🌟 Consumer-Facing Features (New)
1.  **Flash Onboarding (Tutorial):** Trải nghiệm "nhặt được bí mật của điệp viên" để hiểu luồng Claim -> Create trong 1 phút.
2.  **Kip (Mascot):** Nhân vật đại diện thay đổi cảm xúc theo thời gian (Happy, Worried, Ghost).
3.  **AI Micro-UX:**
    *   **Anti-Doxxer:** Ngăn chặn paste private key vào trường public.
    *   **Kip's Voice:** Lời nhắn động viên từ Kip giúp tăng retention.

## 6. Technical Stack
*   **Blockchain:** Solana (Mainnet/Devnet).
*   **Smart Contract:** Rust (Anchor Framework).
*   **Frontend:** Next.js, TailwindCSS.
*   **Storage:** IPFS (Pinata).
*   **Security:** Client-side AES-256-GCM.

## 7. Goals & Success Metrics
*   **Retention:** Người dùng check-in đều đặn (nhờ Kip Streaks).
*   **Conversion:** >20% user từ Flash Onboarding chuyển sang tạo Vault thật.
*   **Security:** Zero-Knowledge architecture được duy trì tuyệt đối.
