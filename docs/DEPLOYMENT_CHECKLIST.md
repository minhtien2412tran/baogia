# Deployment Checklist

> **Updated:** 2026-07-14 · **Status:** CURRENT  
> Dùng trước mỗi deploy. Không thay [JETBAY_DEPLOY_PLAN.md](./JETBAY_DEPLOY_PLAN.md).

## Pre

- [ ] `git status` sạch hoặc ghi rõ files  
- [ ] Không có `.env` trong stage  
- [ ] Local/CI: relevant smoke PASS  
- [ ] Contract đổi → đã cập nhật Web + Admin + Swagger notes + SURFACE_MAP  
- [ ] Owner approve nếu production impacting

## API

- [ ] migrate  
- [ ] seed chỉ khi intentional  
- [ ] PM2 restart  
- [ ] health + smoke-web-api  

## Web / Admin

- [ ] sync script  
- [ ] env bake API URL prod  
- [ ] build  
- [ ] PM2 restart  
- [ ] curl page 200  

## Post

- [ ] Update CONTINUE_AT_HOME  
- [ ] Update TEST_MATRIX nếu kết quả mới  
- [ ] Không commit secrets  

**PASS deploy:** health OK + critical smoke PASS + không regression trang chủ.
