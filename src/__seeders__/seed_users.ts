import { AppDataSource } from '../data-source';
import { User } from '../entity/User';
import bcryptjs from 'bcryptjs';

AppDataSource.initialize()
  .then(async () => {
    console.log('Seeding test users into the database...');

    const seedUsers = [
      {
        id: '499887bf-69b1-4110-9369-5709c239b2d5',
        name: 'jai',
        email: 'jai@123.com',
        password: 'test123',
      },
      {
        id: '22318b3e-3caa-4358-9a69-628d9b94ab70',
        name: 'jett',
        email: 'jett@123.com',
        password: 'test123',
      },
      {
        id: 'd59d39d7-76f0-4b26-aa57-a09f1287414c',
        name: 'user',
        email: 'user@123.com',
        password: 'test123',
      },
      {
        id: '9347c59a-35ed-4957-9760-547b0f889230',
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
      })
    );
  })
  .catch((error) => console.log(error));
