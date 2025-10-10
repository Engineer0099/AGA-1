# AGA - Admin Dashboard

## Project Overview
This is the frontend for the AGA Admin Dashboard, built with React Native and Expo. The application provides a comprehensive interface for managing users, papers, notes, and tips for the AGA platform.

## 🚀 Tech Stack

### Core Technologies
- **React Native** (v0.72.0+)
- **Expo** (v49.0.0+)
- **TypeScript**
- **Expo Router** (File-based routing)

### UI Components & Styling
- **React Native Paper** - Material Design components
- **Expo Vector Icons** - Icons from various icon sets
- **React Native Safe Area Context** - Safe area handling
- **React Native Reanimated** - Smooth animations

### State Management
- **React Context API** - For global state management
- **React Query** - For server state management and data fetching

### Navigation
- **Expo Router** - File-based routing solution
- **React Navigation** - Underlying navigation library

### Form Handling
- **React Hook Form** - Form state management and validation
- **Zod** - Schema validation

### HTTP Client
- **Axios** - For making HTTP requests to the backend API

## 📁 Project Structure

```
app/
├── admin/
│   ├── _layout.tsx           # Admin layout and navigation
│   ├── index.tsx             # Admin dashboard
│   ├── login.tsx             # Admin login
│   ├── notes/                # Notes management
│   │   ├── [id].tsx         # Note details
│   │   ├── index.tsx         # Notes list
│   │   └── new.tsx           # Create new note
│   ├── papers/               # Papers management
│   │   ├── [id].tsx         # Paper details
│   │   ├── index.tsx         # Papers list
│   │   └── new.tsx           # Upload new paper
│   ├── tips/                 # Tips management
│   │   ├── [id].tsx         # Tip details
│   │   ├── index.tsx         # Tips list
│   │   └── new.tsx           # Create new tip
│   └── users/                # User management
│       ├── [id].tsx         # User details
│       ├── index.tsx         # Users list
│       └── new.tsx           # Create new user
├── _layout.tsx              # Root layout
└── index.tsx                # Main entry point
```

## 🛠️ Setup & Installation

1. **Prerequisites**
   - Node.js (v16+)
   - npm or yarn
   - Expo CLI (`npm install -g expo-cli`)

2. **Install Dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment Variables**
   Create a `.env` file in the root directory with the following variables:
   ```env
   EXPO_PUBLIC_API_URL=your_api_url_here
   EXPO_PUBLIC_API_KEY=your_api_key_here
   ```

4. **Run the App**
   ```bash
   # Start the development server
   npx expo start
   ```

## 🌐 API Integration

The frontend expects the following API endpoints to be implemented:

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user info

### Users
- `GET /api/users` - List all users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Papers
- `GET /api/papers` - List all papers
- `GET /api/papers/:id` - Get paper by ID
- `POST /api/papers` - Upload new paper
- `PUT /api/papers/:id` - Update paper
- `DELETE /api/papers/:id` - Delete paper

### Notes
- `GET /api/notes` - List all notes
- `GET /api/notes/:id` - Get note by ID
- `POST /api/notes` - Create new note
- `PUT /api/notes/:id` - Update note
- `DELETE /api/notes/:id` - Delete note

### Tips
- `GET /api/tips` - List all tips
- `GET /api/tips/:id` - Get tip by ID
- `POST /api/tips` - Create new tip
- `PUT /api/tips/:id` - Update tip
- `DELETE /api/tips/:id` - Delete tip

## 📱 UI Components

The app uses a custom design system with the following key components:

- **Buttons**: Primary, secondary, and text buttons
- **Cards**: For displaying content in lists
- **Forms**: With validation and error handling
- **Modals**: For dialogs and alerts
- **Loaders**: For async operations

## 🧪 Testing

Run tests with:
```bash
npm test
```

## 📦 Building for Production

```bash
# Build for Android
npx expo prebuild -p android
npx expo run:android

# Build for iOS
npx expo prebuild -p ios
npx expo run:ios
```

## 🔄 Deployment

The app can be deployed using:
- Expo Application Services (EAS)
- Expo Go (for testing)
- Standalone apps for App Store and Play Store

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Expo team for the amazing development experience
- React Native community for the awesome ecosystem
- All contributors who helped build this project
