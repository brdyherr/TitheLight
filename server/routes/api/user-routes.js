const router = require('express').Router();
const {
  createUser,
  getSingleUser,
  saveBook,
  deleteBook,
  login,
  saveTithe,
  deleteTithe,
  updateTithe,
  updateUser
} = require('../../controllers/user-controller');

// import middleware
const { authMiddleware } = require('../../utils/auth');

// put authMiddleware anywhere we need to send a token for verification of user
router.route('/').post(createUser).put(authMiddleware, saveBook);

router.route('/login').post(login);

router.route('/me').get(authMiddleware, getSingleUser);

router.route('/books/:bookId').delete(authMiddleware, deleteBook);

router.route('/tithes/:titheId').delete(authMiddleware, deleteTithe);
router.route('/tithes-update').post(authMiddleware, updateTithe);
router.route('/update-user').post(authMiddleware, updateUser);

router.route('/tithes').put(authMiddleware, saveTithe);

router.route('/tithe').post(saveTithe);

module.exports = router;
