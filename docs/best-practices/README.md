# Solana Anchor Programs - Best Practices Guide

Tài liệu này hướng dẫn các best practices và coding conventions cho việc phát triển Solana programs với Anchor framework.

## 📚 Mục lục

1. [Cấu trúc Project](./01-project-structure.md) - Tổ chức thư mục và files
2. [Account & State](./02-account-state.md) - Định nghĩa accounts và state
3. [Instructions](./03-instructions.md) - Viết instructions và handler pattern
4. [Errors](./04-errors.md) - Xử lý và định nghĩa errors
5. [Macros & CPI](./05-macros-cpi.md) - Sử dụng macros và Cross-Program Invocations
6. [Security](./06-security.md) - Bảo mật và validations
7. [PDA & Constants](./07-pda-constants.md) - Program Derived Addresses và constants

## 🎯 Nguyên tắc chung

1. **Handler Pattern** - Logic instruction nằm trong `impl` block của context struct
2. **Declarative Validation** - Sử dụng Anchor constraints thay vì imperative checks
3. **Consistent Naming** - Tuân theo naming conventions nhất quán
4. **Documentation** - Comment đầy đủ với doc comments (`///`)
5. **Modular Code** - Tách common utilities vào shared module

## 🔗 Tài liệu tham khảo

- [Anchor Framework](https://www.anchor-lang.com/)
- [Solana Docs](https://solana.com/docs)
- [Solana Cookbook](https://solanacookbook.com/)
