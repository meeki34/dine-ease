# DINE-EASE Deployment & Hosting Guide (100% Free)

This guide walks you through deploying the **DINE-EASE** application for free using:
1. **Aiven (Free Tier)** for the hosted MySQL Database.
2. **Render (Free Tier)** for the Web Service hosting both the Express API and the React frontend.

---

## Step 1: Provision a Free MySQL Database on Aiven

Aiven offers a permanently free tier for managed MySQL databases.

1. Go to the [Aiven Console](https://console.aiven.io/) and sign up for a free account.
2. Click **Create Service**.
3. Choose **MySQL** as the service type.
4. Select the **Free Tier** plan.
5. Select a Cloud Provider (e.g. AWS or GCP) and a region closest to your users or Render deployment (e.g., `us-east-1` or `eu-west-1`).
6. Name your service (e.g., `dineease-db`) and click **Create Service**.
7. Wait 2-3 minutes for the database status to turn green (Running).
8. Under **Connection Information**, find and copy the **Service URI**. It should look like this:
   ```text
   mysql://avnadmin:password@host-name.aivencloud.com:port/defaultdb
   ```
   > [!IMPORTANT]
   > Make sure the connection scheme starts with `mysql://`. Keep this URI safe and private!

---

## Step 2: Deploy to Render (Web Service)

We deploy the application as a single web service where the Node.js backend serves the compiled React frontend statically.

1. Go to [Render](https://render.com/) and sign up or sign in.
2. Click **New** (top-right) -> **Web Service**.
3. Connect your GitHub repository containing the DINE-EASE project.
4. Configure the Web Service settings:
   - **Name**: `dine-ease` (or any custom name)
   - **Root Directory**: Leave blank (monorepo root)
   - **Runtime**: `Node`
   - **Build Command**: `npm install && npm run build:frontend`
   - **Start Command**: `npm run start:backend`
   - **Instance Type**: Select **Free**
5. Click **Deploy Web Service** (do not worry if the first build fails, we need to configure environment variables next).

---

## Step 3: Configure Environment Variables on Render

For the backend to connect to the database and authorize requests, you need to add environment variables.

1. In the Render Dashboard, go to your newly created Web Service and click on the **Environment** tab on the left.
2. Click **Add Environment Variable** and enter the following keys and values:

| Key | Value | Description |
| :--- | :--- | :--- |
| `NODE_ENV` | `production` | Enables production mode and static frontend serving. |
| `DATABASE_URL` | `mysql://...` (Your Aiven Service URI) | The database connection string copied in Step 1. |
| `DB_SSL` | `true` | Tells Sequelize to connect using SSL (Aiven requirement). |
| `JWT_SECRET` | `generate-a-secure-random-string` | A secret key used to sign JWT login tokens. |
| `JWT_EXPIRE` | `30d` | The expiration period for login sessions. |

3. Click **Save Changes**. Render will automatically trigger a redeployment with the new environment variables.

---

## Step 4: Seed the Database with Admin & Demo Users

Since the database starts empty, you need to run the seeding scripts to create the **Super Admin**, **Demo Bistro** accounts, and menu items.

You can trigger this easily from your local machine because the Aiven MySQL database is accessible over the internet using the connection string.

### Option A: Seeding from your Local Terminal (Easiest)

Open a terminal on your computer inside the `d:\DINE-EASE` project directory and run the following commands (replace `YOUR_AIVEN_SERVICE_URI` with the URI you copied from Aiven):

**For Windows (PowerShell):**
```powershell
# Set database URI
$env:DATABASE_URL="YOUR_AIVEN_SERVICE_URI"
$env:DB_SSL="true"
$env:ALLOW_PROD_SEED="true"

# Install root dependencies if not already done
npm install

# 1. Seed base users (Super Admin, Demo Manager, Chef, Waiter)
npm run seed --workspace=backend

# 2. Seed realistic restaurant data (Menu Items, Ingredients, Suppliers)
node backend/seed-demo.js
```

**For macOS / Linux (Bash):**
```bash
export DATABASE_URL="YOUR_AIVEN_SERVICE_URI"
export DB_SSL="true"
export ALLOW_PROD_SEED="true"

# Install root dependencies
npm install

# 1. Seed base users
npm run seed --workspace=backend

# 2. Seed realistic restaurant data
node backend/seed-demo.js
```

### Option B: Seeding using Render's Built-In Shell

Alternatively, if you prefer not to seed locally:
1. Go to your Render Dashboard for your Web Service.
2. Click the **Shell** tab on the left menu (available once the deploy completes successfully).
3. Run the following commands inside the Render Shell:
   ```bash
   ALLOW_PROD_SEED=true npm run seed --workspace=backend
   node backend/seed-demo.js
   ```

---

## Step 5: Verification & Login

Once the deployment completes and seeding is finished, your app is fully live!

1. Open the Render URL (e.g. `https://dine-ease.onrender.com`).
2. Log in using the seeded credentials:

### Seeded Credentials

#### 1. Business Manager (Manage restaurant, menus, orders, employees)
- **Login URL**: `https://your-app.onrender.com/login`
- **Email**: `manager@demo-bistro.test`
- **Password**: `Manager@1234`

#### 2. Staff Portal (Waiter & Kitchen screens)
- **Login URL**: `https://your-app.onrender.com/staff-login`
- **Chef Email**: `chef@demo-bistro.test` / **Password**: `Chef@1234`
- **Waiter Email**: `waiter@demo-bistro.test` / **Password**: `Waiter@1234`

#### 3. Super Admin (System-wide metrics and billing management)
- **Login URL**: `https://your-app.onrender.com/login`
- **Email**: `superadmin@dineease.test`
- **Password**: `Super@1234`
