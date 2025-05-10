const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Project = require('../models/Project');
const Comment = require('../models/Comment');
const User = require('../models/User');

// Get all comments for a project
router.get('/:projectId', async (req, res) => {
  try {
    const project = await Project.findOne({
      where: { id: req.params.projectId }
    });

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check if project is private and user is not the owner
    if (!project.isPublic && (!req.user || project.userId !== req.user.id)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const comments = await Comment.findAll({
      where: { projectId: project.id },
      include: [
        { model: User, attributes: ['email'] }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add comment to project
router.post('/:projectId', auth, async (req, res) => {
  try {
    const project = await Project.findOne({
      where: { id: req.params.projectId }
    });

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check if project is private and user is not the owner
    if (!project.isPublic && project.userId !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { content } = req.body;
    const comment = await Comment.create({
      content,
      projectId: project.id,
      userId: req.user.id
    });

    // Include user email in response
    const commentWithUser = await Comment.findOne({
      where: { id: comment.id },
      include: [
        { model: User, attributes: ['email'] }
      ]
    });

    res.status(201).json(commentWithUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete comment
router.delete('/:projectId/:commentId', auth, async (req, res) => {
  try {
    const comment = await Comment.findOne({
      where: {
        id: req.params.commentId,
        projectId: req.params.projectId,
        userId: req.user.id
      }
    });

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    await comment.destroy();
    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 