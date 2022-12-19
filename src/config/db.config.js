const mongoose = require('mongoose');
const UserModel = require("../models/user.model");
const bcrypt = require("bcryptjs");

async function initMongoServer() {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/pusher_edu_db', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ Connected database from mongodb.');
  } catch (error) {
    console.error(`❌ Connect database is failed with error which is ${error}`);
  }
}

async function initAdminAccount() {
  const adminUsername = process.env.ADMIN_USERNAME;
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  try {
      // Only 1 admin with role: admin exist on our system
      let admin = await 
        UserModel
        .findOne()
        .or([
          { username: adminUsername }, 
          { email: adminEmail },
          { role: "admin" }
        ])
      
      console.log({
        adminUsername,
        adminEmail,
        adminPassword
      })

      if (admin) {
        console.log("Admin Account Exist. Do Not Recreate Admin Account");
        return;
      }

      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(adminPassword, salt);
      admin = new UserModel({
        username: adminUsername,
        email: adminEmail,
        password: hashPassword,
        role: "admin"
      });
      await admin.save();
      console.log("Create only Admin successfully !!!");

    } catch (err) {
      console.log(err.message);
      console.log("InitAdminAccount: Error in Saving");
    }
}


module.exports = { 
  initMongoServer,
  initAdminAccount 
};
