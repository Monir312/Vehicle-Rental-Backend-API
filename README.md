# 🚗 Vehicle Rental System – Backend API

A complete backend system built using **Node.js**, **TypeScript**, **Express** & **PostgreSQL** for managing vehicle rentals.  
Supports **Authentication, Role Based Authorization, Vehicle CRUD, Bookings Management & User Control.**

---

## 📌 Features

- 🔐 JWT Login & Authentication  
- 👨‍💼 Admin / Customer Role Based Access  
- 🚘 Vehicle CRUD Operations  
- 📅 Booking Management  
- 📊 PostgreSQL Relational Database  
- 🔒 Secure Password Hashing with bcrypt  
- 🧩 Modular Folder Structure  

---

## 🛠 Tech Stack

| Technology | Use |
|---|---|
| Node.js + TypeScript | Backend server |
| Express.js | REST API framework |
| PostgreSQL | Database |
| bcryptjs | Password hashing |
| jsonwebtoken | Authentication |
| pg | Database connection |

---


---

## 🌍 API Endpoints

### Auth
| Method | Endpoint | Access |
|---|---|---|
| POST | /api/v1/auth/signup | Public |
| POST | /api/v1/auth/signin | Public |

### Vehicles
| Method | Endpoint | Access |
|---|---|---|
| POST | /api/v1/vehicles | Admin |
| GET | /api/v1/vehicles | Public |
| GET | /api/v1/vehicles/:id | Public |
| PUT | /api/v1/vehicles/:id | Admin |
| DELETE | /api/v1/vehicles/:id | Admin |

### Users
| Method | Endpoint | Access |
|---|---|---|
| GET | /api/v1/users | Admin |
| PUT | /api/v1/users/:id | Admin or Own |
| DELETE | /api/v1/users/:id | Admin |

### Bookings
| Method | Endpoint | Access |
|---|---|---|
| POST | /api/v1/bookings | Customer/Admin |
| GET | /api/v1/bookings | Role Based |
| PUT | /api/v1/bookings/:id | Return/Cancel |

---

## ▶ Run Locally

```bash
git clone <repo-url>
cd project-folder
npm install
npm run dev



---

## 🗄 Database Schema

### Users Table
| Field | Type | Notes |
|---|---|---|
| id | uuid | Auto Primary Key |
| name | text | required |
| email | text | unique |
| password | text | hashed |
| phone | text | required |
| role | enum | `admin/customer` |

### Vehicles Table
| Field | Notes |
|---|---|
| id | Auto-generated |
| vehicle_name | required |
| type | car/bike/van/SUV |
| registration_number | unique |
| daily_rent_price | positive value |
| availability_status | available/booked |

### Bookings Table
| Field | Notes |
|---|---|
| id | auto |
| customer_id | FK → users |
| vehicle_id | FK → vehicles |
| rent_start_date | required |
| rent_end_date | must be > start |
| total_price | auto calculated |
| status | active/cancelled/returned |

---

## 🔐 Authentication Rules

| Role | Permissions |
|---|---|
| Admin | Full access (Users/Vehicles/Bookings) |
| Customer | Only Self Bookings & View Vehicles |

Token format:

