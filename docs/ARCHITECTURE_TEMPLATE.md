# Architecture Documentation Template

## Table of Contents
- [System Overview](#system-overview)
- [Architecture Diagram](#architecture-diagram)
- [Component Design](#component-design)
- [Database Design](#database-design)
- [API Documentation](#api-documentation)
- [Technology Stack](#technology-stack)
- [Security Architecture](#security-architecture)
- [Deployment Architecture](#deployment-architecture)
- [Performance Considerations](#performance-considerations)

---

## System Overview

### Architecture Style
**Selected Architecture:** [e.g., Microservices / Monolithic / Serverless / Event-Driven]

**Rationale:**
[Explain why this architecture was chosen for the project]

**Example:**
```
We chose a monolithic architecture with clear separation of concerns for this 
MVP because:
1. Faster development and deployment
2. Simpler debugging and testing
3. Lower operational complexity
4. Easier to refactor into microservices later if needed
5. Team size and timeline favor this approach
```

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                          │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐            │
│  │  Web App   │  │ Mobile App │  │  Admin UI  │            │
│  │  (React)   │  │  (Future)  │  │  (React)   │            │
│  └─────┬──────┘  └─────┬──────┘  └─────┬──────┘            │
└────────┼────────────────┼────────────────┼──────────────────┘
         │                │                │
         │            HTTPS/TLS            │
         │                │                │
┌────────▼────────────────▼────────────────▼──────────────────┐
│                     API GATEWAY / CDN                        │
│                   (Cloudflare / AWS)                         │
└────────┬─────────────────────────────────────────────────────┘
         │
┌────────▼──────────────────────────────────────────────────┐
│                   APPLICATION LAYER                        │
│  ┌──────────────────────────────────────────────────┐     │
│  │         Express.js Application Server            │     │
│  │                                                   │     │
│  │  ┌────────┐  ┌────────┐  ┌────────┐  ┌────────┐│     │
│  │  │ Auth   │  │Product │  │ Cart   │  │ Order  ││     │
│  │  │Service │  │Service │  │Service │  │Service ││     │
│  │  └────────┘  └────────┘  └────────┘  └────────┘│     │
│  │                                                   │     │
│  │  ┌──────────────────────────────────────────┐   │     │
│  │  │         Middleware Layer                 │   │     │
│  │  │  • Authentication                        │   │     │
│  │  │  • Authorization                         │   │     │
│  │  │  • Validation (Zod)                      │   │     │
│  │  │  • Error Handling                        │   │     │
│  │  │  • Rate Limiting                         │   │     │
│  │  └──────────────────────────────────────────┘   │     │
│  └──────────────────────────────────────────────────┘     │
└────────┬────────────────────────────────────────────────────┘
         │
┌────────▼──────────────────────────────────────────────────┐
│                    DATA LAYER                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │
│  │   MongoDB    │  │   Redis      │  │   AWS S3     │   │
│  │  (Primary    │  │  (Session &  │  │  (File       │   │
│  │   Database)  │  │   Cache)     │  │   Storage)   │   │
│  └──────────────┘  └──────────────┘  └──────────────┘   │
└───────────────────────────────────────────────────────────┘
         │
┌────────▼──────────────────────────────────────────────────┐
│              EXTERNAL SERVICES                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │
│  │   Stripe     │  │   SendGrid   │  │   Twilio     │   │
│  │  (Payments)  │  │   (Email)    │  │   (SMS)      │   │
│  └──────────────┘  └──────────────┘  └──────────────┘   │
└───────────────────────────────────────────────────────────┘
```

### System Context
[Describe how the system fits into the larger business ecosystem]

**Key Integrations:**
- Payment Gateway (Stripe)
- Email Service (SendGrid)
- SMS Service (Twilio) - Optional
- Analytics (Google Analytics)
- Monitoring (DataDog / New Relic)

---

## Architecture Diagram

### Component Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND LAYER                            │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌───────────────────────────────────────────────────┐     │
│  │              React Application                     │     │
│  │                                                    │     │
│  │  ┌─────────────┐  ┌─────────────┐  ┌──────────┐ │     │
│  │  │   Pages     │  │ Components  │  │  Hooks   │ │     │
│  │  └─────────────┘  └─────────────┘  └──────────┘ │     │
│  │                                                    │     │
│  │  ┌─────────────┐  ┌─────────────┐  ┌──────────┐ │     │
│  │  │   Context   │  │   Services  │  │  Utils   │ │     │
│  │  │   (State)   │  │  (API Call) │  │          │ │     │
│  │  └─────────────┘  └─────────────┘  └──────────┘ │     │
│  └───────────────────────────────────────────────────┘     │
└──────────────────────┬──────────────────────────────────────┘
                       │ REST API / JSON
┌──────────────────────▼──────────────────────────────────────┐
│                   BACKEND LAYER                              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │              Express.js Server                     │    │
│  │                                                     │    │
│  │  ┌──────────────────────────────────────────────┐ │    │
│  │  │           Routes Layer                       │ │    │
│  │  │  /api/auth  /api/products  /api/orders      │ │    │
│  │  └──────────────────┬───────────────────────────┘ │    │
│  │                     │                              │    │
│  │  ┌──────────────────▼───────────────────────────┐ │    │
│  │  │           Controllers Layer                  │ │    │
│  │  │  authController  productController          │ │    │
│  │  └──────────────────┬───────────────────────────┘ │    │
│  │                     │                              │    │
│  │  ┌──────────────────▼───────────────────────────┐ │    │
│  │  │           Services Layer                     │ │    │
│  │  │  Business Logic + External APIs              │ │    │
│  │  └──────────────────┬───────────────────────────┘ │    │
│  │                     │                              │    │
│  │  ┌──────────────────▼───────────────────────────┐ │    │
│  │  │           Models Layer                       │ │    │
│  │  │  Mongoose Schemas + Validators               │ │    │
│  │  └──────────────────────────────────────────────┘ │    │
│  └────────────────────────────────────────────────────┘    │
└──────────────────────┬──────────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────────┐
│                    DATABASE LAYER                            │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │  MongoDB    │  │   Redis     │  │   AWS S3    │        │
│  │  (Primary)  │  │  (Cache)    │  │  (Storage)  │        │
│  └─────────────┘  └─────────────┘  └─────────────┘        │
└─────────────────────────────────────────────────────────────┘
```

### Sequence Diagrams

#### User Registration Flow

```
User        Frontend      Backend       Database      Email Service
 │              │             │             │               │
 │─Register────>│             │             │               │
 │              │             │             │               │
 │              │─POST────────>│             │               │
 │              │ /api/auth/  │             │               │
 │              │  register   │             │               │
 │              │             │             │               │
 │              │             │─Validate────>│               │
 │              │             │  Input      │               │
 │              │             │             │               │
 │              │             │─Check Exist─>│               │
 │              │             │             │               │
 │              │             │<─No Duplicate─              │
 │              │             │             │               │
 │              │             │─Hash Pass───>│               │
 │              │             │             │               │
 │              │             │─Save User───>│               │
 │              │             │             │               │
 │              │             │<─User Saved──│               │
 │              │             │             │               │
 │              │             │─Generate JWT─>│               │
 │              │             │             │               │
 │              │             │─Send Email──────────────────>│
 │              │             │   Confirm   │               │
 │              │             │             │               │
 │              │<─201 Created─              │               │
 │              │  + JWT      │             │               │
 │              │             │             │               │
 │<─Success─────│             │             │               │
 │  Message    │             │             │               │
 │              │             │             │               │
```

#### Product Purchase Flow

```
User      Frontend    Backend    Payment     Database
 │            │          │        Gateway       │
 │─Checkout───>│          │          │          │
 │            │          │          │          │
 │            │─POST─────>│          │          │
 │            │ /api/    │          │          │
 │            │ orders   │          │          │
 │            │          │          │          │
 │            │          │─Validate─>│          │
 │            │          │  Cart    │          │
 │            │          │          │          │
 │            │          │─Check────>│          │
 │            │          │ Inventory│          │
 │            │          │          │          │
 │            │          │<─In Stock─          │
 │            │          │          │          │
 │            │          │─Create──────────────>│
 │            │          │  Payment │          │
 │            │          │  Intent  │          │
 │            │          │          │          │
 │            │          │<─Client──>│          │
 │            │          │  Secret  │          │
 │            │          │          │          │
 │            │<─200 OK──│          │          │
 │            │ +Secret  │          │          │
 │            │          │          │          │
 │<─Redirect──│          │          │          │
 │  to Stripe │          │          │          │
 │            │          │          │          │
 │─Pay────────────────────────────>│          │
 │            │          │          │          │
 │            │          │<─Webhook─│          │
 │            │          │ Payment  │          │
 │            │          │ Success  │          │
 │            │          │          │          │
 │            │          │─Create──────────────>│
 │            │          │  Order   │          │
 │            │          │          │          │
 │            │          │─Update──────────────>│
 │            │          │ Inventory│          │
 │            │          │          │          │
 │<─Success──────────────│          │          │
 │  Message   │          │          │          │
```

---

## Component Design

### Backend Components

#### 1. Authentication Service

**Responsibilities:**
- User registration
- User login
- JWT token generation and validation
- Password reset
- Session management

**Key Functions:**
```javascript
class AuthService {
  async register(userData)
  async login(email, password)
  async verifyToken(token)
  async refreshToken(refreshToken)
  async resetPassword(email)
  async updatePassword(userId, newPassword)
}
```

**Dependencies:**
- User Model
- JWT library
- bcrypt
- Email Service

---

#### 2. Product Service

**Responsibilities:**
- Product CRUD operations
- Product search and filtering
- Inventory management
- Product recommendations

**Key Functions:**
```javascript
class ProductService {
  async createProduct(productData)
  async getProductById(id)
  async getAllProducts(filters, pagination)
  async updateProduct(id, updates)
  async deleteProduct(id)
  async searchProducts(query)
  async updateInventory(productId, quantity)
}
```

**Dependencies:**
- Product Model
- Category Model
- Image Storage Service

---

#### 3. Cart Service

**Responsibilities:**
- Add/remove items from cart
- Update quantities
- Calculate totals
- Apply discount codes

**Key Functions:**
```javascript
class CartService {
  async addToCart(userId, productId, quantity)
  async removeFromCart(userId, productId)
  async updateQuantity(userId, productId, quantity)
  async getCart(userId)
  async clearCart(userId)
  async applyDiscount(userId, discountCode)
}
```

**Dependencies:**
- Cart Model
- Product Service
- Discount Service

---

#### 4. Order Service

**Responsibilities:**
- Order creation
- Order status management
- Order history
- Refund processing

**Key Functions:**
```javascript
class OrderService {
  async createOrder(userId, orderData)
  async getOrderById(orderId)
  async getUserOrders(userId, filters)
  async updateOrderStatus(orderId, status)
  async processRefund(orderId, amount)
  async cancelOrder(orderId)
}
```

**Dependencies:**
- Order Model
- Payment Service
- Inventory Service
- Email Service

---

### Frontend Components

#### Component Hierarchy

```
App
├── Router
│   ├── PublicRoute
│   │   ├── HomePage
│   │   ├── ProductListPage
│   │   ├── ProductDetailPage
│   │   ├── LoginPage
│   │   └── RegisterPage
│   │
│   └── PrivateRoute
│       ├── CartPage
│       ├── CheckoutPage
│       ├── OrderHistoryPage
│       ├── ProfilePage
│       └── AdminDashboard
│
├── Layout
│   ├── Header
│   │   ├── Logo
│   │   ├── SearchBar
│   │   ├── Navigation
│   │   └── UserMenu
│   │
│   ├── Footer
│   │   ├── Links
│   │   └── SocialMedia
│   │
│   └── Sidebar (Admin)
│
└── Common Components
    ├── Button
    ├── Input
    ├── Card
    ├── Modal
    ├── Spinner
    └── ErrorMessage
```

#### Key React Components

**ProductCard Component:**
```jsx
/**
 * Displays a single product in grid/list view
 * 
 * Props:
 * - product: Object (id, name, price, image, rating)
 * - onAddToCart: Function
 * 
 * State:
 * - loading: Boolean
 * - error: String
 */
function ProductCard({ product, onAddToCart }) {
  // Implementation
}
```

**ShoppingCart Component:**
```jsx
/**
 * Displays shopping cart with items
 * 
 * Props:
 * - items: Array of cart items
 * - onUpdateQuantity: Function
 * - onRemove: Function
 * - onCheckout: Function
 * 
 * State:
 * - subtotal: Number
 * - total: Number
 */
function ShoppingCart({ items, onUpdateQuantity, onRemove, onCheckout }) {
  // Implementation
}
```

---

## Database Design

### Entity Relationship Diagram (ERD)

```
┌─────────────────────┐
│       User          │
├─────────────────────┤
│ _id: ObjectId (PK)  │
│ username: String    │
│ email: String       │
│ password: String    │
│ role: String        │
│ createdAt: Date     │
│ updatedAt: Date     │
└──────────┬──────────┘
           │
           │ 1:N
           │
┌──────────▼──────────┐         ┌─────────────────────┐
│      Order          │    N:M  │     Product         │
├─────────────────────┤◄────────┤─────────────────────┤
│ _id: ObjectId (PK)  │         │ _id: ObjectId (PK)  │
│ userId: ObjectId(FK)│         │ name: String        │
│ items: Array        │         │ description: String │
│ totalAmount: Number │         │ price: Number       │
│ status: String      │         │ category: ObjectId  │
│ shippingAddress: Obj│         │ images: Array       │
│ paymentId: String   │         │ inventory: Number   │
│ createdAt: Date     │         │ rating: Number      │
│ updatedAt: Date     │         │ createdAt: Date     │
└──────────┬──────────┘         │ updatedAt: Date     │
           │                     └──────────┬──────────┘
           │                                │
           │                                │
           │                                │ N:1
           │                                │
           │                     ┌──────────▼──────────┐
           │                     │      Category       │
           │                     ├─────────────────────┤
           │                     │ _id: ObjectId (PK)  │
           │                     │ name: String        │
           │                     │ description: String │
           │                     │ slug: String        │
           │                     │ parentId: ObjectId  │
           │                     │ createdAt: Date     │
           │                     └─────────────────────┘
           │
           │ 1:N
           │
┌──────────▼──────────┐
│     Review          │
├─────────────────────┤
│ _id: ObjectId (PK)  │
│ userId: ObjectId(FK)│
│ productId: ObjectId │
│ orderId: ObjectId   │
│ rating: Number      │
│ comment: String     │
│ images: Array       │
│ helpful: Number     │
│ createdAt: Date     │
└─────────────────────┘
```

### Database Schemas

#### User Schema

```javascript
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    minlength: [3, 'Username must be at least 3 characters'],
    maxlength: [30, 'Username cannot exceed 30 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    validate: {
      validator: function(v) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: 'Invalid email format'
    }
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 8,
    select: false // Don't return password in queries
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  profile: {
    firstName: String,
    lastName: String,
    phone: String,
    avatar: String
  },
  addresses: [{
    type: {
      type: String,
      enum: ['shipping', 'billing'],
      required: true
    },
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String,
    isDefault: { type: Boolean, default: false }
  }],
  emailVerified: {
    type: Boolean,
    default: false
  },
  verificationToken: String,
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  lastLogin: Date
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
userSchema.index({ email: 1 });
userSchema.index({ username: 1 });

// Virtual for full name
userSchema.virtual('fullName').get(function() {
  return `${this.profile.firstName} ${this.profile.lastName}`;
});

// Pre-save hook for password hashing
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Instance method for password comparison
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
```

#### Product Schema

```javascript
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: [200, 'Name cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  salePrice: {
    type: Number,
    min: [0, 'Sale price cannot be negative'],
    validate: {
      validator: function(v) {
        return v < this.price;
      },
      message: 'Sale price must be less than regular price'
    }
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Category is required']
  },
  images: [{
    url: String,
    alt: String,
    isPrimary: Boolean
  }],
  inventory: {
    quantity: {
      type: Number,
      required: true,
      min: [0, 'Inventory cannot be negative']
    },
    lowStockThreshold: {
      type: Number,
      default: 10
    }
  },
  specifications: {
    type: Map,
    of: String
  },
  tags: [String],
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
productSchema.index({ name: 'text', description: 'text' });
productSchema.index({ category: 1 });
productSchema.index({ price: 1 });
productSchema.index({ 'rating.average': -1 });
productSchema.index({ tags: 1 });

// Virtual for sale status
productSchema.virtual('isOnSale').get(function() {
  return this.salePrice && this.salePrice < this.price;
});

// Virtual for in-stock status
productSchema.virtual('inStock').get(function() {
  return this.inventory.quantity > 0;
});

module.exports = mongoose.model('Product', productSchema);
```

#### Order Schema

```javascript
const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  orderNumber: {
    type: String,
    unique: true,
    required: true
  },
  items: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    name: String, // Snapshot of product name
    price: Number, // Snapshot of price at time of order
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    subtotal: Number
  }],
  pricing: {
    subtotal: Number,
    tax: Number,
    shipping: Number,
    discount: Number,
    total: Number
  },
  shippingAddress: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  billingAddress: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  payment: {
    method: {
      type: String,
      enum: ['card', 'paypal', 'bank_transfer'],
      required: true
    },
    transactionId: String,
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending'
    },
    paidAt: Date
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  tracking: {
    carrier: String,
    trackingNumber: String,
    shippedAt: Date,
    deliveredAt: Date
  },
  notes: String
}, {
  timestamps: true
});

// Indexes
orderSchema.index({ userId: 1, createdAt: -1 });
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ 'payment.status': 1 });

// Pre-save hook to generate order number
orderSchema.pre('save', async function(next) {
  if (this.isNew) {
    const count = await this.constructor.countDocuments();
    this.orderNumber = `ORD-${Date.now()}-${count + 1}`;
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema);
```

### Database Indexes

**Critical Indexes for Performance:**

```javascript
// User indexes
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ username: 1 }, { unique: true });

// Product indexes
db.products.createIndex({ name: "text", description: "text" });
db.products.createIndex({ category: 1 });
db.products.createIndex({ price: 1 });
db.products.createIndex({ "rating.average": -1 });
db.products.createIndex({ tags: 1 });

// Order indexes
db.orders.createIndex({ userId: 1, createdAt: -1 });
db.orders.createIndex({ orderNumber: 1 }, { unique: true });
db.orders.createIndex({ status: 1 });
```

---

## API Documentation

### REST API Endpoints

#### Authentication Endpoints

**POST /api/auth/register**
```
Description: Register a new user
Auth Required: No

Request Body:
{
  "username": "string (3-30 chars)",
  "email": "string (valid email)",
  "password": "string (min 8 chars)"
}

Response 201:
{
  "success": true,
  "data": {
    "user": {
      "id": "string",
      "username": "string",
      "email": "string",
      "role": "string"
    },
    "token": "string (JWT)"
  }
}

Response 400:
{
  "success": false,
  "error": "Validation error message"
}

Response 409:
{
  "success": false,
  "error": "User already exists"
}
```

**POST /api/auth/login**
```
Description: Login existing user
Auth Required: No

Request Body:
{
  "email": "string",
  "password": "string"
}

Response 200:
{
  "success": true,
  "data": {
    "user": { ... },
    "token": "string"
  }
}

Response 401:
{
  "success": false,
  "error": "Invalid credentials"
}
```

#### Product Endpoints

**GET /api/products**
```
Description: Get list of products with filtering
Auth Required: No

Query Parameters:
- page: number (default: 1)
- limit: number (default: 20, max: 100)
- category: string (category ID)
- minPrice: number
- maxPrice: number
- search: string
- sort: string (price_asc, price_desc, rating, newest)

Response 200:
{
  "success": true,
  "data": {
    "products": [ ... ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 10,
      "totalItems": 200,
      "itemsPerPage": 20
    }
  }
}
```

**GET /api/products/:id**
```
Description: Get single product by ID
Auth Required: No

Response 200:
{
  "success": true,
  "data": {
    "product": { ... }
  }
}

Response 404:
{
  "success": false,
  "error": "Product not found"
}
```

**POST /api/products** (Admin only)
```
Description: Create new product
Auth Required: Yes (Admin role)

Request Body:
{
  "name": "string",
  "description": "string",
  "price": number,
  "category": "string (ID)",
  "inventory": {
    "quantity": number
  },
  "images": [ ... ]
}

Response 201:
{
  "success": true,
  "data": {
    "product": { ... }
  }
}
```

#### Cart Endpoints

**POST /api/cart/items**
```
Description: Add item to cart
Auth Required: Yes

Request Body:
{
  "productId": "string",
  "quantity": number
}

Response 200:
{
  "success": true,
  "data": {
    "cart": { ... }
  }
}
```

**GET /api/cart**
```
Description: Get user's cart
Auth Required: Yes

Response 200:
{
  "success": true,
  "data": {
    "cart": {
      "items": [ ... ],
      "subtotal": number,
      "tax": number,
      "total": number
    }
  }
}
```

#### Order Endpoints

**POST /api/orders**
```
Description: Create new order
Auth Required: Yes

Request Body:
{
  "items": [ ... ],
  "shippingAddress": { ... },
  "paymentMethod": "string"
}

Response 201:
{
  "success": true,
  "data": {
    "order": { ... }
  }
}
```

**GET /api/orders/:id**
```
Description: Get order by ID
Auth Required: Yes

Response 200:
{
  "success": true,
  "data": {
    "order": { ... }
  }
}
```

### API Rate Limiting

```
Standard Rate Limits:
- Anonymous: 100 requests per 15 minutes
- Authenticated: 1000 requests per 15 minutes
- Admin: Unlimited

Headers Returned:
- X-RateLimit-Limit: Maximum requests allowed
- X-RateLimit-Remaining: Remaining requests
- X-RateLimit-Reset: Time when limit resets (Unix timestamp)
```

---

## Technology Stack

### Backend Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | 16.x+ | Runtime environment |
| Express.js | 4.x | Web framework |
| MongoDB | 5.x+ | Primary database |
| Mongoose | 6.x | ODM for MongoDB |
| Redis | 6.x | Caching & sessions |
| JWT | 8.x | Authentication |
| bcrypt | 5.x | Password hashing |
| Zod | 3.x | Input validation |
| Helmet | 4.x | Security headers |
| Morgan | 1.x | HTTP request logger |
| Cors | 2.x | CORS handling |

### Frontend Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 17.x | UI framework |
| Vite | 2.x | Build tool |
| React Router | 5.x | Client-side routing |
| Axios | 0.21.x | HTTP client |
| Tailwind CSS | 2.x | Styling framework |
| React Hook Form | 7.x | Form management |
| React Query | 3.x | Data fetching/caching |

### Development Tools

| Tool | Purpose |
|------|---------|
| ESLint | Code linting |
| Prettier | Code formatting |
| Jest | Unit testing |
| Vitest | Frontend testing |
| Supertest | API testing |
| Husky | Git hooks |
| Nodemon | Development server |

### External Services

| Service | Purpose |
|---------|---------|
| Stripe | Payment processing |
| SendGrid | Email delivery |
| AWS S3 | File storage |
| Cloudflare | CDN & DDoS protection |
| DataDog | Monitoring & logging |

---

## Security Architecture

### Authentication Flow

```
1. User Registration:
   User → Frontend → Backend → Hash Password → Store in DB → Generate JWT → Return Token

2. User Login:
   User → Frontend → Backend → Verify Password → Generate JWT → Return Token

3. Authenticated Request:
   User → Frontend (Add Token) → Backend → Verify JWT → Process Request → Return Response
```

### Security Measures

#### 1. Authentication & Authorization
- JWT tokens with expiration
- Password hashing with bcrypt (12 rounds)
- Role-based access control (RBAC)
- Session management with Redis

#### 2. Data Protection
- HTTPS/TLS encryption
- Encrypted passwords in database
- Sensitive data encryption at rest
- No sensitive data in JWT payload

#### 3. Input Validation
- Zod schema validation
- MongoDB injection prevention
- XSS protection
- SQL injection protection (if using SQL)

#### 4. API Security
- Rate limiting
- CORS configuration
- Security headers (Helmet.js)
- Request size limits

#### 5. Infrastructure Security
- Environment variables for secrets
- No hardcoded credentials
- Regular dependency updates
- Security audit logs

---

## Deployment Architecture

### Production Environment

```
┌─────────────────────────────────────────┐
│           Cloudflare CDN                │
│    (SSL, DDoS Protection, Caching)      │
└────────────────┬────────────────────────┘
                 │
      ┌──────────┴──────────┐
      │                     │
┌─────▼──────┐    ┌────────▼────────┐
│  Frontend  │    │  Load Balancer  │
│  (Vercel/  │    │  (AWS ELB /     │
│  Netlify)  │    │   Nginx)        │
└────────────┘    └────────┬────────┘
                           │
                  ┌────────┴────────┐
                  │                 │
            ┌─────▼─────┐    ┌─────▼─────┐
            │ Backend   │    │ Backend   │
            │ Instance 1│    │ Instance 2│
            │ (Node.js) │    │ (Node.js) │
            └─────┬─────┘    └─────┬─────┘
                  │                │
                  └────────┬───────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
  ┌─────▼─────┐    ┌───────▼──────┐   ┌──────▼──────┐
  │ MongoDB   │    │    Redis     │   │   AWS S3    │
  │ (Primary) │    │   (Cache)    │   │  (Storage)  │
  │  + Replica│    │              │   │             │
  └───────────┘    └──────────────┘   └─────────────┘
```

### Deployment Steps

1. **Build Frontend:**
   ```bash
   cd src/frontend
   npm run build
   ```

2. **Deploy Backend:**
   ```bash
   # Using PM2
   pm2 start src/backend/server.js
   pm2 save
   ```

3. **Configure Nginx:**
   ```nginx
   server {
       listen 80;
       server_name api.yourdomain.com;
       
       location / {
           proxy_pass http://localhost:5000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

4. **Setup MongoDB Replica Set**

5. **Configure Environment Variables**

---

## Performance Considerations

### Caching Strategy

```javascript
// Cache frequently accessed products
const getProduct = async (id) => {
  const cacheKey = `product:${id}`;
  
  // Try cache first
  const cached = await redis.get(cacheKey);
  if (cached) return JSON.parse(cached);
  
  // Fetch from database
  const product = await Product.findById(id);
  
  // Cache for 1 hour
  await redis.setex(cacheKey, 3600, JSON.stringify(product));
  
  return product;
};
```

### Database Optimization

1. **Proper Indexing:** All frequently queried fields
2. **Query Optimization:** Use `lean()` for read-only queries
3. **Pagination:** Limit result sets
4. **Connection Pooling:** Reuse database connections
5. **Read Replicas:** Separate read/write operations

### Frontend Optimization

1. **Code Splitting:** Dynamic imports
2. **Lazy Loading:** Load components on demand
3. **Image Optimization:** WebP format, responsive images
4. **Asset Minification:** Compress JS/CSS
5. **CDN Usage:** Serve static assets from CDN

---

**Document Status:** Draft  
**Last Updated:** [YYYY-MM-DD]  
**Reviewed By:** [Name]  
**Next Review:** [YYYY-MM-DD]
