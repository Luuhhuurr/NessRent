# PROJECT FLOW

# APPLICATION TYPE
This application is a fullstack web-based marketplace and booking system.

---

# PUBLIC PAGES

## Landing_Page
Purpose:
- Main homepage
- Introduce platform
- Navigation to login/register

Route:
/

---

## Login_Page
Purpose:
- User authentication
- Login access

Route:
/login

---

## Registration_Page
Purpose:
- User registration

Route:
/register

---

# USER PAGES

## User_Dashboard
Purpose:
- Main dashboard after login
- Quick access to products and booking

Route:
/dashboard

---

## Product_Listing
Purpose:
- Display all products/services

Route:
/products

---

## Product_Detail_Page
Purpose:
- Display selected product details

Route:
/products/:id

---

## Booking_Page
Purpose:
- User booking process

Route:
/booking

---

## Booking_Confirmation
Purpose:
- Booking success page

Route:
/booking-success

---

## Transaction_History
Purpose:
- Display user transaction history

Route:
/history

---

# ADMIN PAGES

## Admin_Dashboard
Purpose:
- Main admin control panel

Route:
/admin

---

## Manajemen_Barang
Purpose:
- Manage products/services

Route:
/admin/products

---

## Tambah_Barang
Purpose:
- Add new products/services

Route:
/admin/add-product

---

## Verifikasi_User
Purpose:
- Verify registered users

Route:
/admin/verify-user

---

## Blacklist_User
Purpose:
- Block problematic users

Route:
/admin/blacklist-user

---

# APPLICATION FLOW

## USER FLOW

Landing_Page
→ Login_Page
→ User_Dashboard
→ Product_Listing
→ Product_Detail_Page
→ Booking_Page
→ Booking_Confirmation
→ Transaction_History

---

## ADMIN FLOW

Admin_Dashboard
→ Manajemen_Barang
→ Tambah_Barang
→ Verifikasi_User
→ Blacklist_User

---

# FRONTEND STACK

- React
- React Router
- Tailwind CSS
- Axios

---

# BACKEND STACK

- Node.js
- Express.js
- MySQL
- JWT Authentication

---

# DEVELOPMENT RULES

- Use reusable React components
- Use clean folder structure
- Preserve responsive design
- Separate user and admin routes
- Use protected routes for dashboard pages