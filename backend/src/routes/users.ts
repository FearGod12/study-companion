import { Router } from 'express';
import { UserController } from '../controllers/users.js';
import isAuthenticated from '../middlewares/loginRequired.js';
import { upload } from '../middlewares/file-upload.js';

const router = Router();

router.post('/users', UserController.createUser);
router.post('/users/verify-email', UserController.verifyEmail);
router.post('/users/login', UserController.login);
router.get('/users/me', isAuthenticated, UserController.getMe);
router.patch('/users/me', isAuthenticated, UserController.updateUser);
router.patch(
  '/users/me/avatar',
  isAuthenticated,
  upload.single('avatar'), // Add multer middleware
  UserController.updateAvatar
);
router.post('/users/reset-password', UserController.resetPassword);

router.post('/users/request-password-reset', UserController.requestPasswordReset);
// fetch users transactions
router.get('/users/transactions', isAuthenticated, UserController.getTransactions);

export default router;

/**
 * @swagger
 *
 * paths:
 *   /users:
 *     post:
 *       summary: Create a new user
 *       tags:
 *         - Users
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - firstName
 *                 - lastName
 *                 - email
 *                 - password
 *                 - confirmPassword
 *                 - category
 *                 - address
 *               properties:
 *                 firstName:
 *                   type: string
 *                 lastName:
 *                   type: string
 *                 phoneNumber:
 *                   type: string
 *                 email:
 *                   type: string
 *                   format: email
 *                 password:
 *                   type: string
 *                   format: password
 *                 confirmPassword:
 *                   type: string
 *                   format: password
 *                 category:
 *                   type: string
 *                   enum: [GRADUATE, UNDERGRADUATE, OLEVEL]
 *                 address:
 *                   type: string
 *       responses:
 *         '201':
 *           description: User created successfully
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/UserResponse'
 *         '400':
 *           description: Bad request
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/ErrorResponse'
 *
 *   /users/verify-email:
 *     post:
 *       summary: Verify user email
 *       tags:
 *         - Users
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - email
 *                 - token
 *               properties:
 *                 email:
 *                   type: string
 *                   format: email
 *                 token:
 *                   type: string
 *       responses:
 *         '200':
 *           description: Email verified successfully
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/UserResponse'
 *         '400':
 *           description: Bad request
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/ErrorResponse'
 *
 *   /users/login:
 *     post:
 *       summary: User login
 *       tags:
 *         - Users
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - email
 *                 - password
 *               properties:
 *                 email:
 *                   type: string
 *                   format: email
 *                 password:
 *                   type: string
 *                   format: password
 *       responses:
 *         '200':
 *           description: User logged in successfully
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   success:
 *                     type: boolean
 *                   message:
 *                     type: string
 *                   data:
 *                     type: object
 *                     properties:
 *                       access_Token:
 *                         type: string
 *         '400':
 *           description: Bad request
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/ErrorResponse'
 *
 *   /users/me:
 *     get:
 *       summary: Get current logged-in user information
 *       tags:
 *         - Users
 *       security:
 *         - bearerAuth: []
 *       responses:
 *         '200':
 *           description: User account retrieved successfully
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/UserResponse'
 *         '401':
 *           description: Unauthorized
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/ErrorResponse'
 *
 * components:
 *   schemas:
 *     UserResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         message:
 *           type: string
 *         data:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *             firstName:
 *               type: string
 *             lastName:
 *               type: string
 *             email:
 *               type: string
 *             emailVerified:
 *               type: boolean
 *             phoneNumber:
 *               type: string
 *             address:
 *               type: string
 *             category:
 *               type: string
 *             avatar:
 *               type: string
 *             createdAt:
 *               type: string
 *               format: date-time
 *             updatedAt:
 *               type: string
 *               format: date-time
 *
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         message:
 *           type: string
 *         data:
 *           type: object
 *           nullable: true
 *
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * /users/me/avatar:
 *   patch:
 *     summary: Update user avatar
 *     description: Upload a new avatar image for the user
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - avatar
 *             properties:
 *               avatar:
 *                 type: string
 *                 format: binary
 *                 description: Image file (jpg, jpeg, png, gif)
 *     responses:
 *       '200':
 *         description: User avatar updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserResponse'
 *       '400':
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '401':
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /users/request-password-reset:
 *   post:
 *     summary: Request password reset
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Reset Password Process Initiated Successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /users/reset-password:
 *   post:
 *     summary: Reset user's password
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *               password:
 *                 type: string
 *               confirmPassword:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password Reset Successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   nullable: true
 *       400:
 *         description: Bad request - Invalid input data or token
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /users/me:
 *   patch:
 *     summary: Update the current user's profile
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 description: Updated first name of the user
 *                 example: "John"
 *               lastName:
 *                 type: string
 *                 description: Updated last name of the user
 *                 example: "Doe"
 *               phoneNumber:
 *                 type: string
 *                 description: Updated phone number
 *                 example: "+1234567890"
 *               category:
 *                 type: string
 *                 description: User's educational category
 *                 enum: ['OLEVEL', 'UNDERGRADUATE', 'GRADUATE']
 *                 example: "undergraduate"
 *               address:
 *                 type: string
 *                 description: Updated user address
 *                 example: "123 Main St, Anytown, USA"
 *     responses:
 *       200:
 *         description: User profile updated successfully
 *         content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/UserResponse'
 *       400:
 *         description: Invalid input or validation error
 *       401:
 *         description: Unauthorized - authentication required
 */

/**
 * @swagger
 * /users/transactions:
 *   get:
 *     summary: Get user's transactions
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Transactions retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       amount:
 *                         type: number
 *                       currency:
 *                         type: string
 *                       reference:
 *                         type: string
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       invoiceCode:
 *                         type: string
 */
