-- Update the user's email confirmation status
UPDATE auth.users 
SET email_confirmed_at = now(), 
    confirmed_at = now()
WHERE email = 'marounantoun@gmail.com';