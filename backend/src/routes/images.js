const express = require('express');
const router = express.Router();
const multer = require('multer');
const auth = require('../middleware/auth');
const Project = require('../models/Project');
const Image = require('../models/Image');
const { uploadToS3, deleteFromS3 } = require('../config/s3');

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Upload image to project
router.post('/:projectId', auth, upload.single('image'), async (req, res) => {
  try {
    const project = await Project.findOne({
      where: { id: req.params.projectId, userId: req.user.id }
    });

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided' });
    }

    const key = `projects/${project.id}/${Date.now()}-${req.file.originalname}`;
    const url = await uploadToS3(req.file, key);

    const image = await Image.create({
      url,
      key,
      projectId: project.id
    });

    res.status(201).json(image);
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(400).json({ message: error.message });
  }
});

// Get all images for a project
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

    const images = await Image.findAll({
      where: { projectId: project.id }
    });

    res.json(images);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete image
router.delete('/:projectId/:imageId', auth, async (req, res) => {
  try {
    const project = await Project.findOne({
      where: { id: req.params.projectId, userId: req.user.id }
    });

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const image = await Image.findOne({
      where: { id: req.params.imageId, projectId: project.id }
    });

    if (!image) {
      return res.status(404).json({ message: 'Image not found' });
    }

    await deleteFromS3(image.key);
    await image.destroy();

    res.json({ message: 'Image deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 