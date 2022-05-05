const express = require('express');
const router = express.Router();
const walletController = require('../controllers/walletController')

/* GET users listing. */
router.get('/', (req,res)=>{
    if (req.cookies.user) 
        res.render('wallets/home', {balance: req.cookies.user.balance})
    else 
        res.redirect('/wallet/create')
});
router.get('/create', walletController.create);
router.get('/create/software', walletController.softwareC);
router.post('/create/software/fileDownload', walletController.fileDownloadC);
router.get('/create/software/keystore', walletController.keystoreC);
router.get('/create/software/done', walletController.doneC);

router.get('/access', walletController.access);
router.get('/access/software', walletController.softwareA);
router.get('/access/software/keystore', walletController.keystoreA);
router.post('/access/software/login', walletController.loginA);
router.post('/access/software/post', walletController.postA);

router.get('/logout', (req, res)=>{
    res.clearCookie('user');
    res.redirect('/')
})

router.get('/send', walletController.send);
router.post('/send', walletController.postSend);

router.get('/manager', walletController.manager);

module.exports = router;
