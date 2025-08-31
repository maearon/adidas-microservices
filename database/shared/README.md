```
cd /mnt/c/Users/manhn/code/shop-php
dos2unix $(find . -type f)
git add .
cd database/shared/
tree .
npx prisma -v
ALTER TABLE messages 
ADD COLUMN is_ai BOOLEAN DEFAULT FALSE;
prisma introspect
npx prisma introspect
npx prisma db pull
npx prisma db push
history
```
