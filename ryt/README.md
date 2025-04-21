# Ryt Bank App

A secure and modern banking application built with React Native and Expo, featuring biometric authentication, transaction management, and a responsive UI that works across web and mobile platforms.

## Features

- 🔐 Secure authentication with biometrics (mobile) and PIN (web)
- 💳 Transaction management and viewing
- 🌓 Dark mode support
- 🖥️ Cross-platform support (iOS, Android, Web)
- 📱 Responsive design
- 🔒 Sensitive data masking

## Prerequisites

Before you begin, ensure you have installed:

- [Node.js](https://nodejs.org/) (v16 or newer)
- [Git](https://git-scm.com/)
- [Expo CLI](https://docs.expo.dev/get-started/installation/) (install with `npm install -g expo-cli`)

For mobile development:
- iOS: [Xcode](https://developer.apple.com/xcode/) (Mac only)
- Android: [Android Studio](https://developer.android.com/studio)

## Installation

1. Clone the repository:
   ```bash
   git clone [repository-url]
   cd ryt
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Running the App

You can run the app on different platforms:

### Web
```bash
npm run web
```
Access the app in your browser at `http://localhost:19006`

Default PIN for web login: `123456`

### iOS
```bash
npm run ios
```
Requires a Mac with Xcode installed

### Android
```bash
npm run android
```
Requires Android Studio with an emulator set up

### Development Mode
To start the development server with options for all platforms:
```bash
npm start
```

This will show a QR code and options to run on different platforms.

## Development

- The app uses Expo Router for navigation
- Authentication is handled through the `useAuthentication` hook
- Styles are managed using React Native's StyleSheet
- The app supports both light and dark themes

### Project Structure

- `/app` - Contains all the screens and routing logic
- `/components` - Reusable React components
- `/hooks` - Custom React hooks
- `/services` - Business logic and API services
- `/constants` - App-wide constants and configurations
- `/assets` - Images, fonts, and other static assets

## Testing

Run the test suite:
```bash
npm test
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
