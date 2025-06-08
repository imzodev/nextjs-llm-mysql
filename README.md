# Next.js MySQL Dashboard

A modern, full-stack e-commerce dashboard built with Next.js, MySQL, and shadcn/ui components. This application provides a beautiful and functional admin interface for managing an online store.

📺 [Watch the YouTube Tutorial](https://www.youtube.com/watch?v=J6-burOS2FA)

## Features

- **Modern Dashboard UI**: Clean and responsive interface built with Tailwind CSS and shadcn/ui components
- **Dark/Light Mode**: Theme toggle with persistent preferences
- **MySQL Integration**: Full database connectivity with connection pooling
- **RESTful API**: Complete backend API for all dashboard operations
- **Dashboard Analytics**: Overview of store performance with charts and statistics
- **Product Management**: CRUD operations for products with image support
- **Category Management**: Organize products with customizable categories
- **Order Management**: Track and manage customer orders
- **Supplier Management**: Keep track of product suppliers
- **Color & Size Management**: Manage product attributes
- **Settings**: Configurable store settings
- **SQL Assistant (Natural Language to SQL)**: Ask questions about your store in plain English from the dashboard. The system generates, validates, and safely executes SQL SELECT queries, returning results instantly.

## Tech Stack

- **Frontend**: Next.js 14 with App Router, React, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **State Management**: React Hooks
- **Database**: MySQL
- **ORM**: Raw SQL with mysql2 package
- **Charts**: Recharts
- **Icons**: Lucide React
- **Theme**: next-themes for dark/light mode

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- MySQL 8+ database server

### Database Setup

#### 1. Create the Target Database (if it doesn't exist)

First, log in to the MySQL shell:

```sh
mysql -u your_mysql_username -p
```

Once inside the MySQL prompt, create a new database (replace `ecommerce_llm_mysql` with your desired name):

```sql
CREATE DATABASE ecommerce_llm_mysql;
```

Exit the MySQL shell:

```sql
exit
```

#### 2. Import the SQL Dump File

From your terminal (not inside the MySQL shell), use the following command to import the dump file into your database:

```sh
mysql -u your_mysql_username -p ecommerce_llm_mysql < ecommerce_llm_mysql.sql
```

- Replace `your_mysql_username` with your MySQL username.
- Replace `ecommerce_llm_mysql` with the name of the database you created.

You will be prompted for your password. If the import is successful, there will be no output; errors will be displayed in the terminal if any occur.

(Optional) You can also review or modify the schema/data in `ecommerce_llm_mysql.sql` as needed.

### Environment Setup

Create a `.env.local` file in the root directory with the following variables:

```
DB_HOST=localhost
DB_USER=your_mysql_username
DB_PASSWORD=your_mysql_password
DB_NAME=your_database_name
DB_PORT=3306
```

### Installation

```bash
# Install dependencies
npm install
# or
yarn install

# Run the development server
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the dashboard.

## Project Structure

```
├── app/                    # Next.js App Router
│   ├── api/                # API routes
│   │   ├── categories/     # Categories API
│   │   ├── dashboard/      # Dashboard statistics API
│   │   ├── orders/         # Orders API
│   │   ├── products/       # Products API
│   │   └── suppliers/      # Suppliers API
│   ├── dashboard/          # Dashboard pages
│   │   ├── categories/     # Categories management
│   │   ├── colors/         # Colors management
│   │   ├── orders/         # Orders management
│   │   ├── products/       # Products management
│   │   ├── settings/       # Settings page
│   │   ├── sizes/          # Sizes management
│   │   ├── suppliers/      # Suppliers management
│   │   └── page.tsx        # Main dashboard page
│   └── page.tsx            # Root page (redirects to dashboard)
├── components/             # React components
│   ├── layout/             # Layout components
│   │   ├── dashboard-layout.tsx  # Dashboard layout
│   │   ├── header.tsx      # Header component
│   │   └── sidebar.tsx     # Sidebar navigation
│   ├── ui/                 # UI components
│   │   ├── user-button.tsx # User dropdown
│   │   └── mode-toggle.tsx # Theme toggle
│   └── theme-provider.tsx  # Theme context provider
├── lib/                    # Utility functions
│   └── db.ts               # Database connection and helpers
├── types/                  # TypeScript type definitions
│   └── index.ts            # Database and app types
└── schema.sql              # Database schema
```

## API Routes

- **GET /api/dashboard** - Get dashboard statistics
- **GET /api/products** - List all products
- **GET /api/products?id=:id** - Get product by ID
- **POST /api/products** - Create a new product
- **PATCH /api/products?id=:id** - Update a product
- **DELETE /api/products?id=:id** - Delete a product
- **GET /api/categories** - List all categories
- **GET /api/categories?id=:id** - Get category by ID
- **POST /api/categories** - Create a new category
- **PATCH /api/categories?id=:id** - Update a category
- **DELETE /api/categories?id=:id** - Delete a category
- **GET /api/orders** - List all orders
- **GET /api/orders?id=:id** - Get order by ID
- **POST /api/orders** - Create a new order
- **PATCH /api/orders?id=:id** - Update an order
- **DELETE /api/orders?id=:id** - Delete an order
- **GET /api/suppliers** - List all suppliers
- **GET /api/suppliers?id=:id** - Get supplier by ID
- **POST /api/suppliers** - Create a new supplier
- **PATCH /api/suppliers?id=:id** - Update a supplier
- **DELETE /api/suppliers?id=:id** - Delete a supplier
- **POST /api/sql-assistant** - Generate and execute a safe SQL SELECT query from a natural language prompt (returns SQL and results)

## SQL Assistant (Natural Language to SQL)

You can now ask questions about your store's data directly from the Dashboard using natural language (e.g., "Show me the top 5 products by sales this month").

- The Dashboard UI (`app/dashboard/page.tsx`) includes a query input at the top where you can type your question.
- Your input is sent to the backend API (`app/api/sql-assistant/route.ts`), which:
  1. Uses an LLM to generate a SQL SELECT query based on your prompt and the database schema.
  2. Validates the generated SQL for safety (only SELECT queries are allowed).
  3. Executes the query and returns the results along with the generated SQL.
- Results are shown instantly in the dashboard UI.
- Only safe, read-only queries are permitted (no INSERT/UPDATE/DELETE/etc).

## Future Enhancements

- Authentication and authorization
- Image upload functionality
- Pagination for large data sets
- Advanced filtering and sorting
- Real-time notifications
- PDF invoice generation
- Multi-language support

## License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.
