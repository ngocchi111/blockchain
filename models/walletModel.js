const {db} = require('../db/db');
const bcrypt = require('bcrypt');
const { use } = require('../routes');

exports.add = async (id, password)=>{
    console.log(id);
    console.log(password);
    const userCollection = db().collection('user');
    const users = await userCollection.find().toArray();
    let pr = '';
    if (users.length > 0) 
        pr = users[users.length - 1].username;
    await bcrypt.genSalt(10, function(err, salt){
        bcrypt.hash(id, salt ,async function (err, hashID) {
            await bcrypt.genSalt(10, function(err, salt){
                bcrypt.hash(password, salt , function (err, hash) {
                    const user = {
                        username: hashID,
                        password: hash,
                        status: 'active',
                        balance: 0,
                        prev: pr
                    }
                    userCollection.insertOne(user);
        })
    })
        });
    })
}


exports.checkPassword = async (id, password)=>{
    console.log(id);
    console.log(password)
    const userCollection = db().collection('user');
    const users = await userCollection.find().toArray();
    console.log(users)
    let checkPassword = false;
    for (user of users){
        if (await bcrypt.compare(id, user.username))
            if (await bcrypt.compare(password, user.password))
                checkPassword = user;
    }
    return checkPassword;
}

exports.checkId = async (id)=>{
    console.log(id);
    const userCollection = db().collection('user');
    const users = await userCollection.find().toArray();
    console.log(users)
    let check = false;
    for (user of users){
        if (await bcrypt.compare(id, user.username))
                check = user;
    }
    return check;
}

exports.send = async (from, to, amount)=>{
    const hisCollection = db().collection('history');
    await hisCollection.insertOne({from: from, to:to, amount:amount, day: Date.now()});
    const userCollection = db().collection('user');
    const users = await userCollection.find().toArray();
    let f_u = null;
    let t_u = null;
    for (user of users){
        if (from  === user.username)
            f_u = user;
        if (to  === user.username)
            t_u = user;
    }
    userCollection.updateOne({username: from}, {$set: {balance: parseInt(f_u.balance)- amount}})
    userCollection.updateOne({username: to}, {$set: {balance: parseInt(t_u.balance)+ amount}})
    
}

exports.listUser = async ()=>{
    const userCollection = db().collection('user');
    const users = await userCollection.find().toArray();
    return users
}

exports.history = async ()=>{
    const userCollection = db().collection('history');
    const users = await userCollection.find().toArray();
    return users
}