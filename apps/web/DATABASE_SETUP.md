# Database Setup Guide

## 🚨 **IMPORTANT: Database Connection Required**

The web app requires a PostgreSQL database connection to function properly. Without proper database configuration, you will see connection errors.

## 📋 **Prerequisites**

1. **PostgreSQL Database** running locally or remotely
2. **Database credentials** (username, password, host, port, database name)
3. **Environment variables** properly configured

## 🔧 **Setup Steps**

### 1. **Create `.env` file**

Create a `.env` file in the `apps/web` directory:

```bash
# Copy the example file
cp .env-example .env

# Edit the .env file with your database credentials
```

### 2. **Configure Database URL**

Add your database connection string to `.env`:

```env
# Primary database URL (required)
PRISMA_DATABASE_URL="postgresql://username:password@localhost:5432/database_name"

# Alternative database URL (fallback)
DATABASE_URL="postgresql://username:password@localhost:5432/database_name"

# Individual database components (optional)
POSTGRES_DATABASE=database_name
POSTGRES_HOST=localhost
POSTGRES_PASSWORD=password
POSTGRES_USER=username
POSTGRES_PORT=5432
```

### 3. **Database URL Format**

```
postgresql://username:password@host:port/database_name
```

**Examples:**
- Local: `postgresql://postgres:password@localhost:5432/adidas_dev`
- Remote: `postgresql://user123:pass456@db.example.com:5432/adidas_prod`
- With SSL: `postgresql://user:pass@host:5432/db?sslmode=require`

### 4. **Verify Connection**

After setting up the `.env` file, restart your development server:

```bash
# Stop the current server (Ctrl+C)
# Then restart
npm run dev
# or
yarn dev
```

You should see in the console:
```
✅ Database URL found: postgresql://***:***@localhost:5432/database_name
```

## 🧪 **Test Database Connection**

Visit the test endpoint to verify database connectivity:

```
GET /api/test
```

Expected response:
```json
{
  "success": true,
  "productCount": 123,
  "testProducts": [...],
  "message": "Database connection working"
}
```

## ❌ **Common Errors & Solutions**

### **Error: "Database URL not found"**
```
❌ Database URL not found! Please set PRISMA_DATABASE_URL or DATABASE_URL environment variable.
```

**Solution:** Create `.env` file with proper database URL

### **Error: "Connection refused"**
```
Error: connect ECONNREFUSED 127.0.0.1:5432
```

**Solution:** 
- Check if PostgreSQL is running
- Verify host and port in database URL
- Check firewall settings

### **Error: "Authentication failed"**
```
Error: password authentication failed for user "username"
```

**Solution:**
- Verify username and password
- Check if user has access to database
- Ensure database exists

### **Error: "Database does not exist"**
```
Error: database "database_name" does not exist
```

**Solution:**
- Create the database: `CREATE DATABASE database_name;`
- Or use existing database name

## 🔍 **Troubleshooting**

### **1. Check Environment Variables**
```bash
# In your terminal
echo $PRISMA_DATABASE_URL
echo $DATABASE_URL
```

### **2. Verify .env File Location**
Make sure `.env` file is in the correct directory:
```
apps/web/
├── .env          ← Should be here
├── src/
├── package.json
└── ...
```

### **3. Restart Development Server**
Environment variables are loaded when the server starts. After changing `.env`, restart the server.

### **4. Check Database Status**
```bash
# If using local PostgreSQL
sudo systemctl status postgresql
# or
brew services list | grep postgresql
```

## 📚 **Additional Resources**

- [Prisma Database Connection](https://www.prisma.io/docs/concepts/database-connectors)
- [PostgreSQL Connection Strings](https://www.postgresql.org/docs/current/libpq-connect.html)
- [Environment Variables in Next.js](https://nextjs.org/docs/basic-features/environment-variables)

## 🆘 **Still Having Issues?**

1. **Check the console logs** for detailed error messages
2. **Verify database credentials** with database admin
3. **Test connection** using `psql` or database client
4. **Check network connectivity** if using remote database

---

**Remember:** The web app cannot function without a proper database connection. Ensure your database is running and accessible before starting the development server.
