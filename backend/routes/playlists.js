const express = require('express');
const { Playlist, PlaylistSong, Song } = require('../db/models');
const { asyncHandler, handleValidationErrors } = require('../utils')
const { requireAuth } = require('../auth');
const { check, validationResult } = require('express-validator');

const router = express.Router();

//Authorizes user to connect to see user's playlists
//router.use(requireAuth);

//Check for a non existent playlist
const playlistNotFound = (id) => {
    const err = new Error(`Playlist was not found`);
    err.status = 404
    err.title = "Playlist was not found"
    return err
}


const validatePlaylistErrors = [
    check("name")
        .exists({ checkFalsey: true })
        .withMessage('Please provide a value for message')
        .isLength({ max: 50 })
        .withMessage('Playlist name can not be more than 50 characters')
]

router.use('/:id', asyncHandler(async (req, res, next) => {
    const playlistId = parseInt(req.params.id, 10);
    const playlist = await Playlist.findByPk(playlistId, {
        include: [{ model: Song }]
    })
    if (playlist) {
        res.json({ playlist });
    } else {
        next(playlistNotFound(id));
    }
}))


// UNCOMMENT when form is created

// router.post('/', validatePlaylistErrors, asyncHandler(async (req, res, next) => {
//     const { name, description} = req.body
//     const playlist = await Playlist.create({name,description})
// }))

// router.delete('/:id',validatePlaylistErrors,asyncHandler(async(req,res,next) => {
//         const playlistId = parseInt(req.params.id)
//         const playlist = await Playlist.findByPk(playlistId);
//         if(playlist){
//             playlist.destroy();
//             res.status(204).end();
//         }else{
//             next(playlistNotFound(playlistId));
//         }

// }))

module.exports = router;
