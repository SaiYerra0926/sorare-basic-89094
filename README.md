# The Worx - Recovery Support Services

A professional web application for The Worx recovery support services, providing referral forms, resources, and community information for individuals and families in Allegheny County.

## Features

- **Referral Forms**: Comprehensive referral forms for recovery support services
- **Consent Management**: Consent form for data collection and processing
- **Handbook**: Complete guide to The Worx services and resources
- **Multiple Forms**: Form1, Form2, Form3, Form4, and Form5 for various services
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Dark/Light Mode**: Professional theming with dark and light mode support
- **Accessibility**: WCAG compliant with proper contrast ratios

## Technology Stack

- **React 18**: Modern UI library
- **TypeScript**: Type-safe development
- **Vite**: Fast build tool and development server
- **React Router**: Client-side routing
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: High-quality UI components
- **React Hook Form**: Form validation and management
- **Zod**: Schema validation

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd sorare-basic-89094
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:8080`

### Building for Production

To build the application for production:

```bash
npm run build
```

The production build will be in the `dist` directory.

To preview the production build:

```bash
npm run preview
```

## Project Structure

```
src/
├── components/        # Reusable UI components
├── pages/            # Page components
├── data/            # Data configuration files
├── lib/             # Utility functions and API clients
├── assets/          # Static assets (images, etc.)
└── index.css        # Global styles
```

## Available Routes

- `/` - Home page with forms listing
- `/beginners-guide` - Complete guide about The Worx
- `/referrals` - Recovery referral form
- `/handbook` - Comprehensive handbook
- `/form1` - Form1
- `/form2` - Form2
- `/form3` - Form3
- `/form4` - Form4
- `/form5` - Form5

## Development

### Code Style

- ESLint is configured for code quality
- TypeScript strict mode enabled
- Follow React best practices

### Linting

```bash
npm run lint
```

## Environment Variables

If needed, create a `.env` file in the root directory for environment-specific configuration.

## License

© 2025 The Worx. All rights reserved.

## Contact

For questions or support, please contact:
- Email: info@theworx.us
- Address: 300 Catherine Street, 1st Floor McKees Rocks, PA 15136
