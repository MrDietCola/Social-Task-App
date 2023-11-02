const router = require('express').Router();
const { Task, Comments } = require('../../models');
const withAuth = require('../../utils/auth');

router.post('/', async (req, res) => {
    try {
        const commentData = await Comments.create({
            ...req.body,
            author_id: req.session.user.id
        })

        res.status(200).json(commentData);
    } catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
});

module.exports = router;