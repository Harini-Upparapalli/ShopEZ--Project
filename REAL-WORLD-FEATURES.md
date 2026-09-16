# ShopEZ Real-World Feature Upgrade

This version keeps the existing ShopEZ 50-product catalog and adds:

1. Cart quantity controls with stock validation.
2. Server-side inventory checks and stock deduction at checkout.
3. Saved delivery addresses (add/select/delete).
4. Checkout summary with free-delivery threshold and demo payment methods.
5. Demo online payment status and transaction ID (no real money/payment gateway).
6. Order numbers and expected delivery dates.
7. Customer order tracking timeline.
8. Customer cancellation rules with stock restoration.
9. Admin order-status management.
10. Product reviews and 1–5 star ratings, one review per customer/product.
11. Admin stock quantity display and stock editing when adding/editing products.
12. Fashion-only gender choices: Men/Women. Unisex is removed from the application UI and catalog repair script.
13. The existing modern ShopEZ product-page UI is retained.

## Run locally

Backend:
```powershell
cd D:\ShopEZ-Full-RealWorld-Project\server
npm install
npm run dev
```

Frontend:
```powershell
cd D:\ShopEZ-Full-RealWorld-Project\client
npm install
npm run dev
```

Do not run `seed` or `upgrade-catalog` unless you intentionally want to repair/reset catalog data. Existing product IDs, users and orders are preserved by the upgrade script.
