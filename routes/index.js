var express = require('express');
const multer = require('multer');
var router = express.Router();
const upload = multer({ dest: 'uploads/' });

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express'});
});

router.post('/upload-audio', upload.single('audio'), (req, res) => {
  console.log('Received audio file:', req.file);
  res.send('File uploaded successfully!');
});
module.exports = router;
