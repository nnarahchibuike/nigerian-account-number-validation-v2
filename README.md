# Bank Account Verification System

A web application for verifying bank account numbers using the Paystack API. This system supports both single account verification and batch verification through file uploads.

## Features

- Single account verification
- Batch verification with support for JSON and TXT files
- Responsive design that works on all screen sizes
- Export verification results to CSV
- Real-time validation feedback
- Error handling and user-friendly messages

## Tech Stack

- Frontend:
  - React with TypeScript
  - Material-UI (MUI) for UI components
  - Vite for build tooling
- Backend:
  - Node.js with Express
  - TypeScript
  - Paystack API integration

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Paystack API key

## Setup

1. Clone the repository:

   ```bash
   git clone <your-repo-url>
   cd account-number-validation-v2
   ```

2. Install dependencies:

   ```bash
   # Install frontend dependencies
   npm install

   # Install backend dependencies
   cd backend
   npm install
   ```

3. Create environment files:

   - Create `.env` in the backend directory:
     ```
     PORT=3000
     PAYSTACK_SECRET_KEY=your_paystack_secret_key
     ```

4. Start the development servers:

   ```bash
   # Start backend server (from backend directory)
   npm run dev

   # Start frontend server (from root directory)
   npm run dev
   ```

## Usage

### Single Account Verification

1. Enter the account number and bank code
2. Click "Verify Account"
3. View the verification result

### Batch Verification

1. Prepare your input file:
   - JSON format: Array of objects with `accountNumber` and `bankCode`
   - TXT format: One account per line as `accountNumber,bankCode`
2. Click "Select File" and choose your file
3. Click "Verify Accounts"
4. View results in the table
5. Optionally export results to CSV

## File Formats

### JSON Format

```json
[
  {
    "accountNumber": "0000000000",
    "bankCode": "011"
  },
  {
    "accountNumber": "1111111111",
    "bankCode": "044"
  }
]
```

### TXT Format

```
0000000000,011
1111111111,044
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Paystack API for providing the bank account verification service
- Material-UI for the component library
- React and TypeScript communities
