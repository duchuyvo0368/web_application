const { MongoClient } = require('mongodb');
const faker = require('faker');

async function seedUsers() {
  const uri = 'mongodb://localhost:27017'; // hoặc URI Atlas của bạn
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db('users_dev'); 
    const usersCollection = db.collection('users');

    const users = [];

    for (let i = 1; i <= 50; i++) {
      users.push({
        email: `user${i}@example.com`,
        name: faker.name.findName(),
        avatar: `https://i.pravatar.cc/150?img=${i % 70}`,
        password: '123456', // Bạn có thể dùng bcrypt để hash nếu cần
        bio: faker.lorem.sentence(),
      });
    }

    const result = await usersCollection.insertMany(users);
    console.log(`Đã thêm ${result.insertedCount} users`);
  } catch (err) {
    console.error('Lỗi khi seed:', err);
  } finally {
    await client.close();
  }
}

seedUsers();
