const Blog = require('../models/Blog');
const cloudinary = require('cloudinary').v2;

// Get all published blogs
exports.getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ isPublished: true })
      .sort({ createdAt: -1 })
      .select('-content');
    res.json(blogs);
  } catch (error) {
    console.error('Error fetching blogs:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all blogs for admin
exports.getAllBlogsAdmin = async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.json(blogs);
  } catch (error) {
    console.error('Error fetching admin blogs:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get single blog by slug
exports.getBlogBySlug = async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug, isPublished: true });
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    
    // Increment views
    blog.views += 1;
    await blog.save();
    
    res.json(blog);
  } catch (error) {
    console.error('Error fetching blog:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get blog by ID (admin)
exports.getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    res.json(blog);
  } catch (error) {
    console.error('Error fetching blog by ID:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create blog
exports.createBlog = async (req, res) => {
  try {
    console.log('Request body:', req.body);
    console.log('Request file:', req.file);
    
    const { title, metaTitle, metaDescription, author, content, tags, isPublished } = req.body;
    
    // Validate required fields
    if (!title || !metaTitle || !metaDescription || !content) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }
    
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a featured image' });
    }
    
    // Calculate reading time (average 200 words per minute)
    const wordCount = content.replace(/<[^>]*>/g, '').split(/\s+/).length;
    const readingTime = Math.max(3, Math.ceil(wordCount / 200));
    
    // Process tags
    let tagsArray = [];
    if (tags) {
      tagsArray = tags.split(',').map(tag => tag.trim()).filter(tag => tag);
    }
    
    // Create slug from title
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    
    const blog = new Blog({
      title,
      slug,
      metaTitle,
      metaDescription,
      author: author || 'Admin',
      featuredImage: req.file.path,
      featuredImagePublicId: req.file.filename,
      content,
      readingTime,
      tags: tagsArray,
      isPublished: isPublished === 'true' || isPublished === true
    });
    
    await blog.save();
    res.status(201).json(blog);
  } catch (error) {
    console.error('Error creating blog:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update blog
exports.updateBlog = async (req, res) => {
  try {
    const { title, metaTitle, metaDescription, author, content, tags, isPublished } = req.body;
    const blog = await Blog.findById(req.params.id);
    
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    
    if (req.file) {
      // Delete old image from cloudinary
      try {
        await cloudinary.uploader.destroy(blog.featuredImagePublicId);
      } catch (err) {
        console.error('Error deleting old image:', err);
      }
      blog.featuredImage = req.file.path;
      blog.featuredImagePublicId = req.file.filename;
    }
    
    // Calculate reading time
    const contentToUse = content || blog.content;
    const wordCount = contentToUse.replace(/<[^>]*>/g, '').split(/\s+/).length;
    const readingTime = Math.max(3, Math.ceil(wordCount / 200));
    
    // Process tags
    let tagsArray = blog.tags;
    if (tags) {
      tagsArray = tags.split(',').map(tag => tag.trim()).filter(tag => tag);
    }
    
    blog.title = title || blog.title;
    blog.metaTitle = metaTitle || blog.metaTitle;
    blog.metaDescription = metaDescription || blog.metaDescription;
    blog.author = author || blog.author;
    blog.content = content || blog.content;
    blog.readingTime = readingTime;
    blog.tags = tagsArray;
    blog.isPublished = isPublished !== undefined ? (isPublished === 'true' || isPublished === true) : blog.isPublished;
    
    await blog.save();
    res.json(blog);
  } catch (error) {
    console.error('Error updating blog:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete blog
exports.deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    
    // Delete image from cloudinary
    try {
      await cloudinary.uploader.destroy(blog.featuredImagePublicId);
    } catch (err) {
      console.error('Error deleting image:', err);
    }
    
    await blog.deleteOne();
    res.json({ message: 'Blog deleted successfully' });
  } catch (error) {
    console.error('Error deleting blog:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};