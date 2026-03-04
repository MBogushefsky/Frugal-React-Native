# Frugal

A React Native mobile app for personal finance management that links your bank accounts via Plaid, visualizes spending across configurable time windows, and lets you comparison-shop across Amazon and eBay — all from one screen.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React Native 0.63 + Expo ~42 |
| Language | TypeScript 4 |
| State management | Redux Toolkit + React Redux |
| Navigation | React Navigation 5 (stack, bottom tabs, drawer) |
| UI | React Native Paper, React Native Elements, Expo Vector Icons |
| Bank linking | react-native-plaid-link-sdk ^7 |
| HTTP | fetch + fetch-intercept |
| Fonts | Expo Google Fonts (Roboto) |
| Animation | React Native Reanimated 2 |

## Why It's Valuable

Frugal connects directly to your real bank accounts through the Plaid API and surfaces net worth, grouped transaction history, and a time-scoped spending view in a clean mobile UI. The product search screen lets you compare live prices across multiple retailers, bridging personal budgeting with smarter purchasing decisions.

## Key Features

- **Bank account linking** — Plaid Link OAuth flow embedded natively; public tokens exchanged server-side
- **Dashboard** — live net worth calculation across all linked accounts; transactions grouped by day and scoped to past week, past month, or all time
- **Linked accounts screen** — view all connected accounts with balance and subtype metadata
- **Product search** — cross-retailer price comparison (Amazon, eBay) with average price calculation
- **Redux state** — global search filter and user session managed via Redux Toolkit slices
- **Privacy mode** — `ScrambleBankAccountsIfNeeded` / `ScrambleGroupedTransactionsIfNeeded` demo-safe data masking
- **Cross-platform** — runs on iOS, Android, and web (`expo start --web`)

## Architecture Overview

```
App.tsx
├─ Redux StoreProvider
├─ React Native Paper PaperProvider (theme)
└─ Navigation (MainNavigation)
    ├─ LoginScreen / SignUpScreen
    └─ Authenticated tabs
        ├─ DashboardScreen
        │   ├─ GetBankAccounts()  → REST API
        │   └─ GetTransactionsGrouped(scope) → REST API
        ├─ LinkedBankAccountsScreen
        │   ├─ PlaidLink (react-native-plaid-link-sdk)
        │   └─ CreateLinkToken / SavePublicToken → REST API
        └─ ProductSearchScreen
            └─ SearchProducts(filter) → REST API

services/RestApiService.tsx   — all fetch() calls, configurable base URL
services/FoundationService.tsx — currency formatting, scrambling utilities
redux/Store.tsx + Reducers.tsx — global state (searchFilter, user)
```

## Getting Started

### Prerequisites

- Node.js 14+ and Yarn
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (Xcode) or Android emulator, or the Expo Go app
- A running backend that implements the Plaid token and account endpoints

### Install & Run

```bash
git clone https://github.com/MBogushefsky/Frugal-React-Native
cd Frugal-React-Native
yarn install
yarn start          # opens Expo dev tools
yarn ios            # iOS simulator
yarn android        # Android emulator
```

### Configure API Server

Edit `environment/environment.tsx`:

```ts
export default {
  apiServer: 'http://YOUR_SERVER_IP:PORT'
};
```

## Environment Variables

All configuration is done via `environment/environment.tsx` (no `.env` file required at the app layer). The backend server must expose:

| Endpoint | Description |
|---|---|
| `GET /accounts` | Returns linked Plaid bank accounts |
| `GET /tokens/link/create` | Creates a Plaid Link token |
| `POST /tokens/link?token=` | Exchanges Plaid public token |
| `GET /transactions/grouped/*` | Returns transactions grouped by day |
| `PUT /products/search` | Cross-retailer product search |

## Screens

| Screen | Description |
|---|---|
| Dashboard | Net worth + scoped transaction history |
| Linked Bank Accounts | Plaid Link flow + account list |
| Product Search | Amazon/eBay price comparison |
| Login / Sign Up | Authentication screens |
