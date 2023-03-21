import { AppDataSource } from '../data-source';
import { User } from '../entity/User';
import bcryptjs from 'bcryptjs';

AppDataSource.initialize()
  .then(async () => {
    console.log('Seeding test users into the database...');

    const seedUsers = [
      {
        id: 1,
        name: 'jai',
        email: 'jai@123.com',
        password: 'test123',
      },
      {
        id: 2,
        name: 'jett',
        email: 'jett@123.com',
        password: 'test123',
      },
      {
        id: 3,
        name: 'user',
        email: 'user@123.com',
        password: 'test123',
      },
      {
        id: 4,
        name: 'user2',
        email: 'user2@123.com',
        password: 'test123',
      },
    ];

    await Promise.all(
      seedUsers.map(async (usr) => {
        const hashedPassword = await bcryptjs.hash(usr.password, 10);

        const user = new User();
        user.id = usr.id;
        user.name = usr.name;
        user.email = usr.email;
        user.password = hashedPassword;
        user.isAdmin = false;
        await AppDataSource.manager.save(user);
        console.log('Saved a new user with id: ' + user.id);
      }),
    );
  })
  .catch((error) => console.log(error));
