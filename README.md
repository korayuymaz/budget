# Budget Tracker

A comprehensive budget management application built with Next.js, TypeScript, and Tailwind CSS. Track your expenses and earnings with ease, featuring Google authentication and a modern, responsive UI.

## Features

- 🔐 **Google Authentication** - Secure sign-in with Google OAuth
- 💰 **Expense Tracking** - Add variable and fixed expenses with categories
- 💵 **Earnings Tracking** - Record your income and earnings
- 📊 **Financial Summary** - View monthly and overall financial overview
- 🌍 **Multi-Currency Support** - Support for USD, EUR, GBP, TRY, JPY, CAD, AUD
- 📱 **Responsive Design** - Works perfectly on desktop and mobile devices
- 🎨 **Modern UI** - Beautiful interface built with Tailwind CSS
- 🔧 **TypeScript** - Full type safety throughout the application

## Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Authentication**: NextAuth.js with Google Provider
- **Database**: GraphQL with Apollo Client
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **Tables**: TanStack Table (React Table)
- **Styling**: Tailwind CSS with shadcn/ui components

## Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── api/auth/          # NextAuth API routes
│   ├── auth/signin/       # Sign-in page
│   ├── expenses/          # Expenses page
│   ├── earnings/          # Earnings page
│   ├── summary/           # Financial summary page
│   └── profile/           # User profile page
├── components/            # Reusable components
│   ├── ui/               # UI components (Card, etc.)
│   ├── AuthProvider.tsx  # NextAuth provider
│   ├── Navigation.tsx    # Main navigation
│   ├── ExpenseForm.tsx   # Expense form component
│   ├── ExpenseList.tsx   # Expense list component
│   ├── EarningForm.tsx   # Earning form component
│   └── EarningList.tsx   # Earning list component
├── graphql/             # GraphQL configuration
│   ├── mutations.ts     # GraphQL mutations
│   └── queries.ts       # GraphQL queries
├── types/               # TypeScript type definitions
│   └── index.ts         # All application types
└── lib/                 # Utility libraries
    └── auth.ts          # NextAuth configuration
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Google OAuth credentials

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd budget
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:

   ```env
   # NextAuth Configuration
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-nextauth-secret-key-here

   # Google OAuth
   GOOGLE_CLIENT_ID=your-google-client-id-here
   GOOGLE_CLIENT_SECRET=your-google-client-secret-here

   # GraphQL Configuration
   NEXT_PUBLIC_API_URL=http://localhost:4000/api
   ```

4. **Set up Google OAuth**

   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select an existing one
   - Enable the Google+ API
   - Go to Credentials → Create Credentials → OAuth 2.0 Client IDs
   - Set the authorized redirect URI to: `http://localhost:3000/api/auth/callback/google`
   - Copy the Client ID and Client Secret to your `.env.local` file

5. **Run the development server**

   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## GraphQL Schema

The application uses GraphQL for data fetching and mutations. Here are the main operations:

### Queries

- `GET_EXPENSES` - Fetch all expenses for a user
- `GET_EXPENSES_MONTHLY` - Fetch expenses for a specific month
- `GET_EARNINGS` - Fetch all earnings for a user
- `GET_EARNINGS_MONTHLY` - Fetch earnings for a specific month
- `GET_SUMMARY` - Fetch financial summary with monthly breakdown
- `GET_USER_BY_ID` - Fetch user information

### Mutations

- `CREATE_EXPENSE` - Create a new expense
- `UPDATE_EXPENSE` - Update an existing expense
- `DELETE_EXPENSE` - Delete an expense
- `CREATE_EARNING` - Create a new earning
- `UPDATE_EARNING` - Update an existing earning
- `DELETE_EARNING` - Delete an earning

## GraphQL Support

The application is fully integrated with GraphQL using Apollo Client. The GraphQL client is configured in `src/app/lib/apollo.ts` and provides real-time data synchronization with optimistic updates.

## Features in Detail

### Expense Management

- Add variable and fixed expenses
- Categorize expenses (Food, Transportation, Housing, etc.)
- Set specific dates for expenses
- Choose from multiple currencies
- Mark expenses as recurring (fixed)

### Earning Management

- Record income and earnings
- Add descriptions and dates
- Support for multiple currencies
- Track all sources of income

### Financial Summary

- Total earnings and expenses
- Net amount calculation
- Monthly breakdown with earnings, expenses, and net amounts
- Currency-specific calculations
- Real-time data updates

### User Profile

- View account information
- Set preferred currency
- Manage account settings
- Export data (placeholder)
- Account deletion (placeholder)

## Customization

### Adding New Currencies

Edit the `Currency` type in `src/types/index.ts` and update the currency arrays in the form components.

### Adding New Expense Types

Edit the `ExpenseType` type in `src/types/index.ts` and update the expense type arrays in the form components.

### Styling

The application uses Tailwind CSS. You can customize the design by modifying the Tailwind classes or extending the configuration in `tailwind.config.js`.

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Other Platforms

The application can be deployed to any platform that supports Next.js:

- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

If you encounter any issues or have questions, please open an issue on GitHub.

## Future Enhancements

- [ ] Data export functionality
- [ ] Charts and graphs for better data visualization
- [ ] Budget goals and alerts
- [ ] Receipt image upload
- [ ] Recurring expense automation
- [ ] Mobile app (React Native)
- [ ] Dark mode support
- [ ] Multi-language support
- [ ] Advanced filtering and search
- [ ] Data backup and sync
