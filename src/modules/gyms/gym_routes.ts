import express from 'express';
import { addGymHandler, deleteGymHandler, getAllGymsHandler, getGymByIdHandler, updateGymHandler, hideGymHandler, loginGymHandler, refreshGymTokenHandler, getCurrentGymHandler } from './gym_controller.js';
import { checkJwt } from '../../middleware/session.js';

const router = express.Router();

/**
 * @openapi
 * /api/gym/current:
 *   get:
 *     summary: Obtiene la información del gimnasio actual
 *     description: Retorna la información del gimnasio autenticado
 *     tags:
 *       - Gym
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Éxito
 *       401:
 *         description: No autorizado
 */
router.get('/gym/current', checkJwt, getCurrentGymHandler);

/**
 * @openapi
 * /api/gym:
 *   post:
 *     summary: Crea un nuevo gimnasio
 *     description: Añade un nuevo gimnasio con nombre, ubicación y precio.
 *     tags:
 *       - Gym
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nombre del gimnasio
 *               place:
 *                 type: string
 *                 description: Ubicación del gimnasio
 *               price:
 *                 type: number
 *                 description: Precio de uso del gimnasio
 *               email:
 *                 type: string
 *                 description: Correo electrónico del gimnasio
 *               phone:
 *                 type: string
 *                 description: Teléfono del gimnasio
 *               password:
 *                 type: string
 *                 description: Contraseña del gimnasio
 *     responses:
 *       201:
 *         description: Gimnasio añadido exitosamente
 *       400:
 *         description: Error de validación
 */
router.post('/gym', addGymHandler);

/**
 * @openapi
 * /api/gym:
 *   get:
 *     summary: Obtiene una lista de gimnasios con paginación
 *     description: Retorna una lista de gimnasios paginada.
 *     tags:
 *       - Gym
 *     parameters:
 *       - name: page
 *         in: query
 *         required: false
 *         schema:
 *           type: integer
 *           default: 1
 *       - name: pageSize
 *         in: query
 *         required: false
 *         schema:
 *           type: integer
 *           enum: [10, 25, 50]
 *           default: 10
 *     responses:
 *       200:
 *         description: Éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                     description: Nombre del gimnasio
 *                   place:
 *                     type: string
 *                     description: Ubicación del gimnasio
 *                   price:
 *                     type: number
 *                     description: Precio por el uso del gimnasio
 *                   email:
 *                     type: string
 *                     description: Correo electrónico del gimnasio
 *                   phone:
 *                     type: string
 *                     description: Teléfono del gimnasio
 *       400:
 *         description: Tamaño de página inválido
 *       500:
 *         description: Error interno del servidor
 */
router.get('/gym', getAllGymsHandler); // No checkJwt middleware

/**
 * @openapi
 * /api/gym/{id}:
 *   get:
 *     summary: Obtiene un gimnasio por ID
 *     description: Retorna los detalles de un gimnasio específico.
 *     tags:
 *       - Gym
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                   description: Nombre del gimnasio
 *                 place:
 *                   type: string
 *                   description: Ubicación del gimnasio
 *                 price:
 *                   type: number
 *                   description: Precio por uso del gimnasio
 *                 email:
 *                   type: string
 *                   description: Correo electrónico del gimnasio
 *                 phone:
 *                   type: string
 *                   description: Teléfono del gimnasio
 *       404:
 *         description: Gimnasio no encontrado
 */

router.get('/gym/:id', getGymByIdHandler);

/**
 * @openapi
 * /api/gym/{id}:
 *   put:
 *     summary: Actualiza un gimnasio por ID
 *     description: Modifica los detalles de un gimnasio específico.
 *     tags:
 *       - Gym
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nombre del gimnasio
 *               place:
 *                 type: string
 *                 description: Ubicación del gimnasio
 *               price:
 *                 type: number
 *                 description: Precio por uso del gimnasio
 *               email:
 *                 type: string
 *                 description: Correo electrónico del gimnasio
 *               phone:
 *                 type: string
 *                 description: Teléfono del gimnasio
 *               password:
 *                 type: string
 *                 description: Contraseña del gimnasio
 *     responses:
 *       200:
 *         description: Gimnasio actualizado exitosamente
 *       404:
 *         description: Gimnasio no encontrado
 */

router.put('/gym/:id', checkJwt, updateGymHandler); // Require authentication

/**
 * @openapi
 * /api/gym/{id}:
 *   delete:
 *     summary: Elimina un gimnasio por ID
 *     description: Elimina un gimnasio específico.
 *     tags:
 *       - Gym
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Gimnasio eliminado exitosamente
 *       404:
 *         description: Gimnasio no encontrado
 */

router.delete('/gym/:id', checkJwt, deleteGymHandler); // Require authentication

/**
 * @openapi
 * /api/gym/{id}/oculto:
 *   put:
 *     summary: Cambia la visibilidad de un gimnasio por ID
 *     description: Oculta o muestra un gimnasio específico.
 *     tags:
 *       - Gym
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               isHidden:
 *                 type: boolean
 *                 description: Indica si el gimnasio está oculto o visible
 *     responses:
 *       200:
 *         description: Éxito
 *       404:
 *         description: Gimnasio no encontrado
 */
router.put('/gym/:id/oculto', checkJwt, hideGymHandler); // Require authentication

/**
 * @openapi
 * /api/gym/login:
 *   post:
 *     summary: Inicia sesión en un gimnasio
 *     description: Inicia sesión en un gimnasio con un correo electrónico y contraseña.
 *     tags:
 *       - Gym
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Correo electrónico del gimnasio
 *               password:
 *                 type: string
 *                 description: Contraseña del gimnasio
 *     responses:
 *       200:
 *         description: Inicio de sesión completado
 *       404:
 *         description: Gimnasio no encontrado
 */
router.post('/gym/login', loginGymHandler);

/**
 * @openapi
 * /api/gym/refresh:
 *   post:
 *     summary: Refresca el token de acceso para un gimnasio
 *     description: Genera un nuevo token de acceso usando el refresh token.
 *     tags:
 *       - Gym
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: Token refrescado exitosamente
 *       403:
 *         description: Refresh token inválido
 */
router.post('/gym/refresh', refreshGymTokenHandler); // Ensure this route is correctly set up

export default router;
