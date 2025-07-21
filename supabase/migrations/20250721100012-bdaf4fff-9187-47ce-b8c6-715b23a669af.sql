-- Reset password for admin user
UPDATE auth.users 
SET encrypted_password = crypt('admin123', gen_salt('bf'))
WHERE email = 'marounantoun@gmail.com';