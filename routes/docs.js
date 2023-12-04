var express = require('express');
var router = express.Router();
const swaggerUI = require('swagger-ui-express');
const swaggerFile = require('../swagger_doc.json');

router.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerFile));

module.exports = router;