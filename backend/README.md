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
