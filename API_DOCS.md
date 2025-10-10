# Backend API Requirements

## Base URL
```
https://api.yourapp.com/v1
```

## Authentication
All endpoints (except login) require authentication via Bearer token in the Authorization header:
```
Authorization: Bearer <token>
```

## Endpoints

### 1. Authentication

#### Login
- **URL**: `/auth/login`
- **Method**: `POST`
- **Request Body**:
  ```json
  {
    "email": "admin@example.com",
    "password": "password123"
  }
  ```
- **Success Response**:
  ```json
  {
    "token": "jwt_token_here",
    "user": {
      "id": "user_id",
      "name": "Admin User",
      "email": "admin@example.com",
      "role": "admin"
    }
  }
  ```

### 2. Users Management

#### Get All Users
- **URL**: `/users`
- **Method**: `GET`
- **Query Params**:
  - `page`: number (default: 1)
  - `limit`: number (default: 10)
  - `search`: string (optional)
  - `role`: string (optional)

#### Create User
- **URL**: `/users`
- **Method**: `POST`
- **Request Body**:
  ```json
  {
    "name": "New User",
    "email": "user@example.com",
    "password": "password123",
    "role": "user"
  }
  ```

### 3. Papers Management

#### Get All Papers
- **URL**: `/papers`
- **Method**: `GET`
- **Query Params**:
  - `page`: number (default: 1)
  - `limit`: number (default: 10)
  - `search`: string (optional)
  - `subject`: string (optional)
  - `type`: enum['Midterm', 'Final', 'Quiz', 'Practice'] (optional)
  - `year`: number (optional)

#### Upload Paper
- **URL**: `/papers/upload`
- **Method**: `POST`
- **Content-Type**: `multipart/form-data`
- **Body**:
  - `file`: File (PDF/DOC)
  - `title`: string
  - `subject`: string
  - `type`: string
  - `year`: number

### 4. Notes Management

#### Get All Notes
- **URL**: `/notes`
- **Method**: `GET`
- **Query Params**:
  - `page`: number (default: 1)
  - `limit`: number (default: 10)
  - `search`: string (optional)
  - `subject`: string (optional)

## Data Models

### User
```typescript
interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  createdAt: string;
  updatedAt: string;
}
```

### Paper
```typescript
interface Paper {
  id: string;
  title: string;
  subject: string;
  year: number;
  type: 'Midterm' | 'Final' | 'Quiz' | 'Practice';
  fileType: 'PDF' | 'DOC' | 'IMAGE';
  fileUrl: string;
  uploadedBy: string; // User ID
  downloads: number;
  createdAt: string;
  updatedAt: string;
}
```

### Note
```typescript
interface Note {
  id: string;
  title: string;
  content: string;
  subject: string;
  createdBy: string; // User ID
  createdAt: string;
  updatedAt: string;
}
```

## Environment Variables
Create a `.env` file with the following variables:
```
API_BASE_URL=https://api.yourapp.com/v1
UPLOAD_URL=https://storage.yourapp.com/upload
```

## Mock Data
For development, you can use the following mock data structure:

```typescript
// Mock users
const mockUsers = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'admin',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// Mock papers and notes arrays with similar structure...
```

## Error Responses
All error responses should follow this format:
```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable error message",
    "details": {} // Optional additional error details
  }
}
```

## Status Codes
- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `500`: Internal Server Error

## Rate Limiting
- 100 requests per minute per IP address
- 1000 requests per day per user (for authenticated endpoints)
