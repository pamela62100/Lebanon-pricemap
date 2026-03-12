# Recommended API Endpoints for Wein

Based on the architecture of the Wein application (Catalog-First, Multi-Role, Geo-validated), here is a comprehensive and structured list of the RESTful API endpoints you should implement. 

They are organized by domain and include the expected HTTP methods, routes, access levels, and their primary purpose.

---

## 1. Authentication & Identity (`/api/auth`)
*Handles user registration, login, and session management using JWTs.*

| Method | Endpoint | Role | Purpose |
|:---|:---|:---|:---|
| **POST** | `/api/auth/login` | Public | Authenticate a user (Shopper/Retailer/Admin) and return a JWT. |
| **POST** | `/api/auth/register` | Public | Register a new Shopper or initiate Retailer account creation. |
| **GET** | `/api/auth/me` | Authenticated | Validate the current token and return the user's profile. |
| **POST** | `/api/auth/logout` | Authenticated | Invalidate the current session (if using server-side token blacklists). |

---

## 2. Public Prices & Search (`/api/prices`)
*The primary interface for shoppers to find the cheapest products nearby.*

| Method | Endpoint | Role | Purpose |
|:---|:---|:---|:---|
| **GET** | `/api/prices/search` | Public | Full-text search for products across stores (`?query=milk&city=Beirut`). |
| **GET** | `/api/prices/product/{id}` | Public | Get all prices and store availability for a specific product. |
| **GET** | `/api/prices/{id}` | Public | Get details of a single price entry enriched with store information. |
| **POST**| `/api/prices` | Shopper | Submit a community price entry (e.g., uploading a receipt). |
| **POST**| `/api/prices/{id}/vote` | Shopper | Upvote or downvote a user-submitted price entry to affect trust scores. |

---

## 3. Retailer Catalog Management (`/api/catalog`)
*The "Source of Truth" for official store pricing.*

| Method | Endpoint | Role | Purpose |
|:---|:---|:---|:---|
| **GET** | `/api/catalog/store/{id}` | Public | Fetch the entire official catalog for a specific store. |
| **GET** | `/api/catalog/{id}` | Public | Fetch details for a specific catalog item. |
| **POST**| `/api/catalog` | Retailer, Admin | Add a new product to a store's official catalog. |
| **PUT** | `/api/catalog/{id}` | Retailer, Admin | Update an existing catalog item (price, stock status, promotions). |
| **DELETE**| `/api/catalog/{id}` | Retailer, Admin | Soft-delete a catalog item (`is_archived = true`). |
| **POST**| `/api/catalog/upload` | Retailer | Bulk-upload a CSV file to sync thousands of products at once. |
| **GET** | `/api/catalog/{id}/audit` | Retailer, Admin | Get the price change history (audit trail) for a specific item. |

---

## 4. Discrepancy & Moderation (`/api/discrepancy`)
*The community-driven correction loop.*

| Method | Endpoint | Role | Purpose |
|:---|:---|:---|:---|
| **POST** | `/api/discrepancy` | Shopper | Submit a report claiming an official price is wrong (must include Geo-coordinates). |
| **GET** | `/api/discrepancy/pending`| Admin | Get all unresolved discrepancy reports. |
| **GET** | `/api/discrepancy/store/{id}`| Retailer, Admin | Get all discrepancy reports filed against a specific store. |
| **PATCH**| `/api/discrepancy/{id}/approve` | Admin | Approve a report (atomically updates the catalog price and user trust score). |
| **PATCH**| `/api/discrepancy/{id}/reject` | Admin | Reject a report and penalize the reporter's trust score. |

---

## 5. Stores & Geography (`/api/stores`)
*Information about physical retail locations and their operational status.*

| Method | Endpoint | Role | Purpose |
|:---|:---|:---|:---|
| **GET** | `/api/stores` | Public | List stores, filterable by city, district, or Geo-bounding box for Map views. |
| **GET** | `/api/stores/{id}` | Public | View a store's profile, overall trust score, and exchange rate. |
| **PUT** | `/api/stores/{id}` | Retailer, Admin | Update a store's details (internal LBP rate, opening hours). |
| **PATCH**| `/api/stores/{id}/power` | Retailer, Admin | Quick-update the store's power status (e.g., generator on, unstable, off). |
| **PATCH**| `/api/stores/{id}/status`| Admin | Verify, suspend, or flag a store on the platform. |

---

## 6. Global Products (`/api/products`)
*The centralized dictionary of physical goods.*

| Method | Endpoint | Role | Purpose |
|:---|:---|:---|:---|
| **GET** | `/api/products` | Public | List global products (e.g., "Picon Cheese 8 Portions"). |
| **GET** | `/api/products/{id}` | Public | Get details of a global product. |
| **GET** | `/api/products/barcode/{code}`| Public | Quickly lookup a product via its scanned EAN/UPC barcode. |
| **POST**| `/api/products` | Admin | Create a new master product in the global dictionary. |

---

## 7. User Management & Profiles (`/api/users`)
*Handling user profiles and trust scores.*

| Method | Endpoint | Role | Purpose |
|:---|:---|:---|:---|
| **GET** | `/api/users/{id}` | Admin, Self | Get a user's public profile, stats, and trust score. |
| **PUT** | `/api/users/{id}` | Self | Update personal details (Name, avatar, default city). |
| **GET** | `/api/users/{id}/notifications`| Self | Get paginated notifications for the user. |
| **PATCH**| `/api/users/{id}/status`| Admin | Ban, warn, or suspend a user. |

---

## 8. Specific Crisis Features (Fuel & Carts)

### Fuel Tracking (`/api/fuel`)
| Method | Endpoint | Role | Purpose |
|:---|:---|:---|:---|
| **GET** | `/api/fuel` | Public | Get current official nationwide fuel prices. |
| **GET** | `/api/fuel/stations`| Public | Get physical gas stations and their live availability (open/closed/queues). |
| **POST**| `/api/fuel/stations/{id}/report`| Shopper| Report a station's queue length or if it's out of fuel. |

### Smart Cart (`/api/cart`)
| Method | Endpoint | Role | Purpose |
|:---|:---|:---|:---|
| **GET** | `/api/cart` | Shopper | Retrieve saved cart items. |
| **POST**| `/api/cart/items` | Shopper | Add an item to the shopping list. |
| **GET** | `/api/cart/optimize` | Shopper | Run the algorithm to figure out which nearby store has the cheapest total basket. |

### Alerts (`/api/alerts`)
| Method | Endpoint | Role | Purpose |
|:---|:---|:---|:---|
| **POST**| `/api/alerts` | Shopper | Create a trigger to notify the user when a specific product drops below $X. |
| **GET** | `/api/alerts` | Shopper | List all active price alerts for the user. |
