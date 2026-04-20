const Gallery = require('../models/Gallery');
const cloudinary = require('cloudinary').v2;

exports.getAllImages = async (req, res) => {
  try {
    const images = await Gallery.find().sort({ createdAt: -1 });
    res.json(images);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getImageById = async (req, res) => {
  try {
    const image = await Gallery.findById(req.params.id);
    if (!image) {
      return res.status(404).json({ message: 'Image not found' });
    }
    res.json(image);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createImage = async (req, res) => {
  try {
    const { title, description, category } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload an image' });
    }
    
    const image = new Gallery({
      title,
      description,
      category,
      imageUrl: req.file.path,
      publicId: req.file.filename
    });
    
    await image.save();
    res.status(201).json(image);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateImage = async (req, res) => {
  try {
    const { title, description, category } = req.body;
    const image = await Gallery.findById(req.params.id);
    
    if (!image) {
      return res.status(404).json({ message: 'Image not found' });
    }
    
    if (req.file) {
      // Delete old image from cloudinary
      await cloudinary.uploader.destroy(image.publicId);
      image.imageUrl = req.file.path;
      image.publicId = req.file.filename;
    }
    
    image.title = title || image.title;
    image.description = description || image.description;
    image.category = category || image.category;
    
    await image.save();
    res.json(image);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteImage = async (req, res) => {
  try {
    const image = await Gallery.findById(req.params.id);
    if (!image) {
      return res.status(404).json({ message: 'Image not found' });
    }
    
    // Delete from cloudinary
    await cloudinary.uploader.destroy(image.publicId);
    await image.deleteOne();
    
    res.json({ message: 'Image deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};