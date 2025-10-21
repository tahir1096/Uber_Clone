# Backend API: /users/register

This document describes the POST `/users/register` endpoint for the backend in this project.

## Endpoint

- URL: `/users/register`
- Method: `POST`
- Purpose: Register a new user. Validates the request body, hashes the password, saves the user, and returns a JSON Web Token (JWT) and basic user info.

## Request body

The endpoint expects a JSON body with the following fields:

- email (string, required)
  - Must be a valid email address.
- firstname (string, required)
  - Minimum length: 3 characters.
- lastname (string, optional)
  - If provided, minimum length: 3 characters.
- password (string, required)
  - Minimum length: 6 characters.

Example request body:

```json
{
  "email": "alice@example.com",
  "firstname": "Alice",
  "lastname": "Smith",
  "password": "supersecret"
}
```

Notes:
- Validation is performed using `express-validator` in `routes/user.routes.js`.
- The `password` is hashed before saving to the database using bcrypt. The model method for hashing is `hashPassword` in `models/user.model.js`.

## Responses

### Success (201 Created)

Returned when the user is created successfully.

Example:

```json
Status: 201 Created
{
  "message": "User registered successfully ✅",
  "token": "<jwt_token_here>",
  "user": {
    "firstname": "Alice",
    "lastname": "Smith",
    "_id": "6421a7e8e1f3c2a5d4b6c7f8"
  }
}
```

### Client validation error (400 Bad Request)

Returned when request body validation fails. The response includes an `errors` array returned from `express-validator`.

Example:

```json
Status: 400 Bad Request
{
  "errors": [
    {
      "msg": "Invalid email address",
      "param": "email",
      "location": "body"
    }
  ]
}
```

### Server error (500 Internal Server Error)

Returned when an unexpected error occurs on the server during registration (e.g., database error).

Example:

```json
Status: 500 Internal Server Error
{
  "message": "Internal Server Error"
}
```

## Implementation notes

- The route is defined in `routes/user.routes.js` and uses the `registerUser` controller in `controllers/user.controller.js`.
- Password hashing: `userSchema.statics.hashPassword` in `models/user.model.js`.
- JWT generation: `userSchema.methods.generateAuthToken` signs a token using `process.env.JWT_SECRET` and expires in 1 day.

## Additional endpoint: /users/login

- URL: `/users/login`
- Method: `POST`
- Purpose: Authenticate an existing user. Validates the request body, compares password with the hashed password stored in the DB, and returns a JSON Web Token (JWT) and basic user info on success.

### Request body

The endpoint expects a JSON body with the following fields:

- email (string, required)
  - Must be a valid email address.
- password (string, required)
  - The plain-text password to compare against the stored hash.

Example request body:

```json
{
  "email": "alice@example.com",
  "password": "supersecret"
}
```

Notes:
- The `comparePassword` instance method on the user model uses bcrypt to compare the provided password with the stored hash.
- The route may be implemented in `routes/user.routes.js` and the controller in `controllers/user.controller.js` (look for a `loginUser` or similar function).

### Success (200 OK)

Returned when authentication succeeds.

Example:

```json
Status: 200 OK
{
  "message": "Login successful",
  "token": "<jwt_token_here>",
  "user": {
    "firstname": "Alice",
    "lastname": "Smith",
    "_id": "6421a7e8e1f3c2a5d4b6c7f8"
  }
}
```

### Authentication error (401 Unauthorized)

Returned when credentials are invalid (wrong email or password).

Example:

```json
Status: 401 Unauthorized
{
  "message": "Invalid email or password"
}
```

### Client validation error (400 Bad Request)

Returned when request body validation fails (e.g., missing email or invalid format). Response includes an `errors` array from `express-validator`.

Example:

```json
Status: 400 Bad Request
{
  "errors": [
    {
      "msg": "Invalid email address",
      "param": "email",
      "location": "body"
    }
  ]
}
```

### Server error (500 Internal Server Error)

Returned when an unexpected error occurs on the server during login (e.g., database error).

Example:

```json
Status: 500 Internal Server Error
{
  "message": "Internal Server Error"
}
```

## Additional endpoint: /user/profile

- URL: `/user/profile`
- Method: `GET`
- Purpose: Return the authenticated user's profile information. Requires a valid JWT provided either in the `Authorization: Bearer <token>` header or as the `authToken` cookie (set during login).

### Request requirements

- Authorization header (preferred): `Authorization: Bearer <jwt>`
- or Cookie: `authToken=<jwt>`

No request body is required.

### Success (200 OK)

Returned when the provided token is valid and the user is found.

```json
Status: 200 OK
{
  "_id": "6421a7e8e1f3c2a5d4b6c7f8",
  "firstname": "Alice",
  "lastname": "Smith",
  "email": "alice@example.com"
}
```

### Unauthorized (401 Unauthorized)

Returned when the token is missing, expired, blacklisted, or invalid.

```json
Status: 401 Unauthorized
{
  "message": "Invalid token."
}
```

If the token is absent, the message will be `Access denied. No token provided.`; if the token is blacklisted (e.g., after logout), the message will be `Token has been revoked. Please log in again.`

### Notes

- The route is protected by `auth.middleware.js`, which verifies the JWT and checks the blacklist collection.
- The controller `getUserProfile` simply returns the user document attached to `req.user` by the middleware.

## Additional endpoint: /user/logout

- URL: `/user/logout`
- Method: `POST`
- Purpose: Invalidate the current session by blacklisting the JWT and clearing the `authToken` cookie. Requires authentication.

### Request requirements

- Authorization header: `Authorization: Bearer <jwt>` **or** cookie `authToken=<jwt>`
- No request body is required.

### Success (200 OK)

Returned when the token is successfully blacklisted (or was already blacklisted) and the cookie cleared.

```json
Status: 200 OK
{
  "message": "Logout successful ✅"
}
```

### Unauthorized (401 Unauthorized)

Returned when no token is provided, the token is invalid, or already revoked.

```json
Status: 401 Unauthorized
{
  "message": "Access denied. No token provided."
}
```

If a token is supplied but invalid or expired, you'll receive `Invalid token.`; if it has been blacklisted previously, the message will be `Token has been revoked. Please log in again.`

### Notes

- The controller `logoutUser` clears the cookie and stores the token using `BlacklistToken.blacklist`, which relies on the TTL index to auto-expire entries after 24 hours.
- The `auth.middleware` checks the blacklist before accepting a token, so subsequent requests with a blacklisted token will fail.

## Quick test with curl (PowerShell) for login

```powershell
curl -Method POST -Uri "http://localhost:3000/users/login" -ContentType "application/json" -Body (@{email="alice@example.com"; password="supersecret"} | ConvertTo-Json)
```

Replace the host/port as appropriate for your `server.js` configuration.

## Quick test with curl (PowerShell)

```powershell
curl -Method POST -Uri "http://localhost:3000/users/register" -ContentType "application/json" -Body (@{email="alice@example.com"; firstname="Alice"; lastname="Smith"; password="supersecret"} | ConvertTo-Json)
```

Replace the host/port as appropriate for your `server.js` configuration.

---

Document created to help front-end or API consumers understand how to call the registration endpoint and what responses to expect.
# Backend API: Captain Endpoints

This document describes the captain-related endpoints for the backend API in this project.

---

## Endpoint: /captain/register

- **URL**: `/captain/register`
- **Method**: `POST`
- **Purpose**: Register a new captain (driver). Validates the request body, hashes the password, saves the captain with vehicle details, and returns a JSON Web Token (JWT) and captain info.

### Request body

The endpoint expects a JSON body with the following fields:

- **fullname** (object, required)
  - **firstname** (string, required): Minimum length: 3 characters.
  - **lastname** (string, optional): If provided, minimum length: 3 characters.
- **email** (string, required): Must be a valid email address.
- **password** (string, required): Minimum length: 6 characters.
- **vehicle** (object, required)
  - **color** (string, required): Minimum length: 2 characters.
  - **plateNumber** (string, required): Minimum length: 5 characters.
  - **seatingCapacity** (integer, required): Minimum value: 1.
  - **vehicleType** (string, required): Must be one of: `'bike'`, `'car'`, or `'auto-rikshaw'`.
  - **model** (string, required): Minimum length: 2 characters.

#### Example request body:

```json
{
  "fullname": {
    "firstname": "John",
    "lastname": "Doe"
  },
  "email": "john.doe@example.com",
  "password": "password123",
  "vehicle": {
    "color": "Black",
    "plateNumber": "ABC12345",
    "seatingCapacity": 4,
    "vehicleType": "car",
    "model": "Toyota Camry"
  }
}
```

#### Notes:
- Validation is performed using `express-validator` in `routes/captain.routes.js`.
- The `password` is hashed before saving to the database using bcrypt. The model method for hashing is `hashPassword` in `models/captain.model.js`.
- The system checks if a captain with the same email already exists before registration.

### Responses

#### Success (201 Created)

Returned when the captain is created successfully.

**Example:**

```json
{
  "message": "Captain registered successfully ✅",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "captain": {
    "_id": "6421a7e8e1f3c2a5d4b6c7f8",
    "firstname": "John",
    "lastname": "Doe",
    "email": "john.doe@example.com",
    "vehicle": {
      "color": "Black",
      "plateNumber": "ABC12345",
      "seatingCapacity": 4,
      "vehicleType": "car"
    }
  }
}
```

#### Client validation error (400 Bad Request)

Returned when request body validation fails. The response includes an `errors` array returned from `express-validator`.

**Example:**

```json
{
  "errors": [
    {
      "msg": "Invalid email address",
      "param": "email",
      "location": "body"
    },
    {
      "msg": "First name must be at least 3 characters long",
      "param": "fullname.firstname",
      "location": "body"
    }
  ]
}
```

#### Captain already exists (409 Conflict)

Returned when a captain with the provided email already exists.

**Example:**

```json
{
  "message": "Captain already exists"
}
```

#### Server error (500 Internal Server Error)

Returned when an unexpected error occurs on the server during registration (e.g., database error).

**Example:**

```json
{
  "message": "Internal Server Error"
}
```

---

## Endpoint: /captain/login

- **URL**: `/captain/login`
- **Method**: `POST`
- **Purpose**: Authenticate an existing captain. Validates the request body, compares password with the hashed password stored in the DB, and returns a JSON Web Token (JWT) and captain info on success.

### Request body

The endpoint expects a JSON body with the following fields:

- **email** (string, required): Must be a valid email address.
- **password** (string, required): The plain-text password to compare against the stored hash.

#### Example request body:

```json
{
  "email": "john.doe@example.com",
  "password": "password123"
}
```

#### Notes:
- The `comparePassword` instance method on the captain model uses bcrypt to compare the provided password with the stored hash.
- A cookie named `token` is set upon successful login.

### Responses

#### Success (200 OK)

Returned when authentication succeeds.

**Example:**

```json
{
  "message": "Captain logged in successfully ✅",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "captain": {
    "_id": "6421a7e8e1f3c2a5d4b6c7f8",
    "firstname": "John",
    "lastname": "Doe",
    "email": "john.doe@example.com"
  }
}
```

#### Authentication error (401 Unauthorized)

Returned when credentials are invalid (wrong email or password).

**Example:**

```json
{
  "message": "Invalid email or password"
}
```

#### Client validation error (400 Bad Request)

Returned when request body validation fails (e.g., missing email or invalid format). Response includes an `errors` array from `express-validator`.

**Example:**

```json
{
  "errors": [
    {
      "msg": "Invalid email address",
      "param": "email",
      "location": "body"
    }
  ]
}
```

#### Server error (500 Internal Server Error)

Returned when an unexpected error occurs on the server during login (e.g., database error).

**Example:**

```json
{
  "message": "Internal Server Error"
}
```

---

## Endpoint: /captain/profile

- **URL**: `/captain/profile`
- **Method**: `GET`
- **Purpose**: Return the authenticated captain's profile information. Requires a valid JWT provided either in the `Authorization: Bearer <token>` header or as the `token` cookie (set during login).

### Request requirements

- **Authorization header** (preferred): `Authorization: Bearer <jwt>`
- **or Cookie**: `token=<jwt>`

No request body is required.

### Responses

#### Success (200 OK)

Returned when the provided token is valid and the captain is found.

**Example:**

```json
{
  "captain": {
    "_id": "6421a7e8e1f3c2a5d4b6c7f8",
    "firstname": "John",
    "lastname": "Doe",
    "email": "john.doe@example.com",
    "status": "inactive",
    "vehicleDetails": {
      "color": "Black",
      "plateNumber": "ABC12345",
      "seatingCapacity": 4,
      "vehicleType": "car"
    },
    "model": "Toyota Camry"
  }
}
```

#### Unauthorized (401 Unauthorized)

Returned when the token is missing, expired, blacklisted, or invalid.

**Example:**

```json
{
  "message": "Invalid token."
}
```

If the token is absent, the message will be `"Access denied. No token provided."`; if the token is blacklisted (e.g., after logout), the message will be `"Token has been revoked. Please log in again."`

#### Notes:
- The route is protected by `auth.middleware.js` (`authCaptain` middleware), which verifies the JWT and checks the blacklist collection.
- The controller `getCaptainProfile` simply returns the captain document attached to `req.captain` by the middleware.

---

## Endpoint: /captain/logout

- **URL**: `/captain/logout`
- **Method**: `POST`
- **Purpose**: Invalidate the current session by blacklisting the JWT and clearing the `token` cookie. Requires authentication.

### Request requirements

- **Authorization header**: `Authorization: Bearer <jwt>` **or** **cookie** `token=<jwt>`
- No request body is required.

### Responses

#### Success (200 OK)

Returned when the token is successfully blacklisted and the cookie cleared.

**Example:**

```json
{
  "message": "Captain logged out successfully ✅"
}
```

#### Unauthorized (401 Unauthorized)

Returned when no token is provided, the token is invalid, or already revoked.

**Example:**

```json
{
  "message": "Access denied. No token provided."
}
```

If a token is supplied but invalid or expired, you'll receive `"Invalid token."`; if it has been blacklisted previously, the message will be `"Token has been revoked. Please log in again."`

#### Notes:
- The controller `logoutCaptain` clears the cookie and stores the token in the `BlacklistToken` collection, which relies on the TTL index to auto-expire entries after 24 hours.
- The `authCaptain` middleware checks the blacklist before accepting a token, so subsequent requests with a blacklisted token will fail.

---

## Implementation notes

- The routes are defined in `routes/captain.routes.js` and use controllers from `controllers/captain.controller.js`.
- Password hashing: `captainSchema.statics.hashPassword` in `models/captain.model.js`.
- Password comparison: `captainSchema.methods.comparePassword` in `models/captain.model.js`.
- JWT generation: `captainSchema.methods.generateAuthToken` signs a token using `process.env.JWT_SECRET` and expires in 24 hours.
- The captain model includes a `status` field (enum: `'active'`, `'inactive'`, `'suspended'`) which defaults to `'inactive'`.

---

## Quick test with curl (PowerShell)

### Register a captain:

```powershell
$body = @{
  fullname = @{
    firstname = "John"
    lastname = "Doe"
  }
  email = "john.doe@example.com"
  password = "password123"
  vehicle = @{
    color = "Black"
    plateNumber = "ABC12345"
    seatingCapacity = 4
    vehicleType = "car"
    model = "Toyota Camry"
  }
} | ConvertTo-Json

curl -Method POST -Uri "http://localhost:4000/captain/register" -ContentType "application/json" -Body $body
```

### Login as captain:

```powershell
$body = @{
  email = "john.doe@example.com"
  password = "password123"
} | ConvertTo-Json

curl -Method POST -Uri "http://localhost:4000/captain/login" -ContentType "application/json" -Body $body
```

### Get captain profile:

```powershell
curl -Method GET -Uri "http://localhost:4000/captain/profile" -Headers @{Authorization="Bearer <your_token_here>"}
```

### Logout captain:

```powershell
curl -Method POST -Uri "http://localhost:4000/captain/logout" -Headers @{Authorization="Bearer <your_token_here>"}
```

Replace the host/port as appropriate for your `server.js` configuration.

---

## Vehicle Types

The system supports three types of vehicles:

1. **bike**: Motorcycle/Bike with seating capacity typically 1
2. **car**: Standard car with seating capacity typically 3-4
3. **auto-rikshaw**: Three-wheeler auto-rickshaw with seating capacity typically 3

---

Document created to help front-end or API consumers understand how to call the captain endpoints and what responses to expect.
