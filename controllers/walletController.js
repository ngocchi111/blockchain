const walletModel = require('../models/walletModel');

exports.create = (req, res) =>{
    res.render('wallets/create', {bgColor: '#004c90',})
}

exports.softwareC = (req, res) =>{
    res.render('wallets/create/software', {bgColor: '#ccffff',})
}

exports.keystoreC = (req, res) =>{
    res.render('wallets/create/keystore', {bgColor: '#ccffff',})
}

exports.fileDownloadC = async (req, res) =>{
    const id = makeString(10)+'.'+makeString(15);
    const password = req.body.password;
    await walletModel.add(id, password);
    res.render('wallets/create/fileDownload', {bgColor: '#ccffff',file: id})
}

exports.doneC = (req, res) =>{
    res.render('wallets/create/done', {bgColor: '#ccffff',})
}

exports.access = (req, res) =>{
    res.render('wallets/access', {bgColor: '#004c90',})
}

exports.softwareA = (req, res) =>{
    res.render('wallets/access/software', {bgColor: '#ccffff',})
}

exports.keystoreA = (req, res) =>{
    res.render('wallets/access/keystore', {bgColor: '#ccffff',})
}

exports.loginA = async(req, res) =>{
    const t = await walletModel.checkId(req.body.nameFile);
    if (t)
    res.render('wallets/access/login', {bgColor: '#ccffff', nameFile: req.body.nameFile})
    else
    res.redirect('/wallet/access/keystore');
}

exports.postA = async(req, res) =>{
    const t = await walletModel.checkPassword(req.body.nameFile, req.body.password);
    if (t)
    {
        res.cookie('user', t);
        res.redirect('/wallet')
    }
    else
    res.redirect('/wallet/access/software/keystore');
}

exports.send = async(req, res) =>{
    const users = await walletModel.listUser();
    if (req.cookies.user) {
        for (user of users)
            if (user.username === req.cookies.user.username)
                await users.splice(users.indexOf(user), 1);
        res.render('wallets/send', {user: req.cookies.user, users: users})
    }
    else 
        res.redirect('/wallet/create')
}

exports.postSend = async(req, res) =>{
    if (req.cookies.user) {
        await walletModel.send(req.body.from, req.body.to, req.body.amount);
        res.redirect('/wallet')
    }
    else 
        res.redirect('/wallet/create')
}

exports.manager = async(req, res) =>{
    if (req.cookies.user) {
        const history = await walletModel.history();
        const users = await walletModel.listUser();
        console.log(users);
        res.render('wallets/manager', {users: users, history: history})
    }
    else 
        res.redirect('/wallet/create')
}

function makeString(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * 
 charactersLength));
   }
   return result;
}