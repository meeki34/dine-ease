/* eslint-disable no-console */
const bcrypt = require('bcryptjs');
const { connectDB } = require('../config/db');
const { syncDB, Tenant, User } = require('../models');

const isProd = (process.env.NODE_ENV || '').toLowerCase() === 'production';
const allowProdSeed = process.env.ALLOW_PROD_SEED === 'true';
if (isProd && !allowProdSeed) {
  console.error('Refusing to run seed in production (NODE_ENV=production) unless ALLOW_PROD_SEED=true is set.');
  process.exit(1);
}

const DEFAULT_PASSWORDS = {
  superadmin: process.env.SEED_SUPERADMIN_PASSWORD || 'Super@1234',
  admin: process.env.SEED_ADMIN_PASSWORD || 'Admin@1234',
  manager: process.env.SEED_MANAGER_PASSWORD || 'Manager@1234',
  chef: process.env.SEED_CHEF_PASSWORD || 'Chef@1234',
  waiter: process.env.SEED_WAITER_PASSWORD || 'Waiter@1234',
};

const hashPassword = async (plain) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(plain, salt);
};

const ensureTenant = async ({ name, email, phone }) => {
  const existing = await Tenant.findOne({ where: { email } });
  if (existing) {
    await existing.update({ name, phone });
    return existing;
  }
  return Tenant.create({ name, email, phone });
};

const ensureUser = async ({ tenant_id, name, email, role, password }) => {
  const existing = await User.findOne({ where: { email } });
  const hashedPassword = await hashPassword(password);

  if (existing) {
    await existing.update({
      tenant_id,
      name,
      role,
      password: hashedPassword,
      is_active: true,
    });
    return existing;
  }

  return User.create({
    tenant_id,
    name,
    email,
    role,
    password: hashedPassword,
    is_active: true,
  });
};

const main = async () => {
  await connectDB();
  await syncDB();

  const tenant1 = await ensureTenant({
    name: 'Demo Bistro',
    email: 'demo-bistro@tenant.test',
    phone: '+1 555 010 1000',
  });

  const tenant2 = await ensureTenant({
    name: 'Amber Lounge',
    email: 'amber-lounge@tenant.test',
    phone: '+1 555 010 2000',
  });

  const usersToSeed = [
    {
      label: 'Super Admin',
      tenant_id: null,
      name: 'Super Admin',
      email: 'superadmin@dineease.test',
      role: 'superadmin',
      password: DEFAULT_PASSWORDS.superadmin,
    },
    {
      label: 'Tenant1 Admin',
      tenant_id: tenant1.id,
      name: 'Demo Admin',
      email: 'admin@demo-bistro.test',
      role: 'admin',
      password: DEFAULT_PASSWORDS.admin,
    },
    {
      label: 'Tenant1 Manager',
      tenant_id: tenant1.id,
      name: 'Demo Manager',
      email: 'manager@demo-bistro.test',
      role: 'manager',
      password: DEFAULT_PASSWORDS.manager,
    },
    {
      label: 'Tenant1 Chef',
      tenant_id: tenant1.id,
      name: 'Demo Chef',
      email: 'chef@demo-bistro.test',
      role: 'chef',
      password: DEFAULT_PASSWORDS.chef,
    },
    {
      label: 'Tenant1 Waiter',
      tenant_id: tenant1.id,
      name: 'Demo Waiter',
      email: 'waiter@demo-bistro.test',
      role: 'waiter',
      password: DEFAULT_PASSWORDS.waiter,
    },
    {
      label: 'Tenant2 Admin',
      tenant_id: tenant2.id,
      name: 'Amber Admin',
      email: 'admin@amber-lounge.test',
      role: 'admin',
      password: DEFAULT_PASSWORDS.admin,
    },
    {
      label: 'Tenant2 Chef',
      tenant_id: tenant2.id,
      name: 'Amber Chef',
      email: 'chef@amber-lounge.test',
      role: 'chef',
      password: DEFAULT_PASSWORDS.chef,
    },
    {
      label: 'Tenant2 Waiter',
      tenant_id: tenant2.id,
      name: 'Amber Waiter',
      email: 'waiter@amber-lounge.test',
      role: 'waiter',
      password: DEFAULT_PASSWORDS.waiter,
    },
  ];

  const seeded = [];
  for (const u of usersToSeed) {
    // eslint-disable-next-line no-await-in-loop
    const user = await ensureUser(u);
    seeded.push({ ...u, id: user.id });
  }

  console.log('\nSeeded sample users:\n');
  console.table(
    seeded.map((u) => ({
      label: u.label,
      id: u.id,
      role: u.role,
      tenant_id: u.tenant_id,
      email: u.email,
      password: u.password,
    }))
  );

  console.log('\nLogin URLs:');
  console.log('- Admin Login:  http://localhost:3000/login');
  console.log('- Staff Login:  http://localhost:3000/staff-login');
  console.log('- Super Admin:  http://localhost:3000/login (use superadmin credentials)');

  process.exit(0);
};

main().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
