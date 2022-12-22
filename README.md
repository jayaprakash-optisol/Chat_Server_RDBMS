# Awesome Project Build with TypeORM

Steps to run this project:

1. Run `npm i` command
2. Setup database settings inside `data-source.ts` file
3. Run in development mode using `npm run dev` command

Migrations:

1. Run `npm run generate -- migration:generate ./src/migration/migration`
2. Run `npm run generate schema:sync`

Test Cases:

1. Run `npm run test`
