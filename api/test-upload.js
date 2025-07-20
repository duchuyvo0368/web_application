// const { MongoClient } = require('mongodb');

// async function seedUsers() {
//   const uri = 'mongodb://localhost:27017';
//   const client = new MongoClient(uri);

//   try {
//     await client.connect();
//     const db = client.db('users_dev');
//     const usersCollection = db.collection('Users');

//     const users = [];

//     for (let i = 51; i <= 100000; i++) {
//       users.push({
//         email: `user${i}@example.com`,
//         name: `User ${i}`,
//         avatar: `https://i.pravatar.cc/150?img=${i % 70}`, // vòng lặp ảnh đại diện
//         password: '123456',
//         bio: `This is the bio of User ${i}`,
//       });
//     }

//     const result = await usersCollection.insertMany(users);
//     console.log(`✅ Đã thêm ${result.insertedCount} users vào MongoDB`);
//   } catch (err) {
//     console.error('❌ Lỗi khi seed:', err);
//   } finally {
//     await client.close();
//   }
// }

// seedUsers();
const { MongoClient } = require('mongodb');

async function updateAvatars() {
  const uri = 'mongodb://localhost:27017';
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db('users_dev');
    const usersCollection = db.collection('Users');

    // Tìm các user có email từ user50@example.com đến user10000@example.com
    const regex = /^user(\d+)@example\.com$/;
    const cursor = usersCollection.find({
      email: { $regex: regex }
    });

    let count = 0;

    while (await cursor.hasNext()) {
      const user = await cursor.next();

      // Lấy số thứ tự từ email (ví dụ: user59@example.com => 59)
      const match = user.email.match(regex);
      if (!match) continue;

      const index = parseInt(match[1]);
      if (index < 50 || index > 100000) continue;

      const newAvatar = `https://file.apetavers.com/api/files/admin/20241228/2c40e35d-58c2-4d1b-a23a-b1147900aa4a--150.png`;

      await usersCollection.updateOne(
        { _id: user._id },
        { $set: { avatar: newAvatar } }
      );

      count++;
      if (count % 1000 === 0) console.log(`Đã cập nhật ${count} users`);
    }

    console.log(`✅ Đã cập nhật avatar cho ${count} users (user50 → user10000)`);
  } catch (err) {
    console.error('❌ Lỗi khi cập nhật avatar:', err);
  } finally {
    await client.close();
  }
}

updateAvatars();
