const Career = require('../models/Career');

exports.getAllCareers = async (req, res) => {
  try {
    const careers = await Career.find().sort({ createdAt: -1 });
    res.json(careers);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getActiveCareers = async (req, res) => {
  try {
    const careers = await Career.find({ isActive: true, deadline: { $gte: new Date() } }).sort({ createdAt: -1 });
    res.json(careers);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getCareerById = async (req, res) => {
  try {
    const career = await Career.findById(req.params.id);
    if (!career) {
      return res.status(404).json({ message: 'Career not found' });
    }
    res.json(career);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createCareer = async (req, res) => {
  try {
    const { title, department, location, type, description, requirements, salary, deadline, isActive } = req.body;
    
    const career = new Career({
      title,
      department,
      location,
      type,
      description,
      requirements,
      salary,
      deadline,
      isActive: isActive !== undefined ? isActive : true
    });
    
    await career.save();
    res.status(201).json(career);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateCareer = async (req, res) => {
  try {
    const { title, department, location, type, description, requirements, salary, deadline, isActive } = req.body;
    const career = await Career.findById(req.params.id);
    
    if (!career) {
      return res.status(404).json({ message: 'Career not found' });
    }
    
    career.title = title || career.title;
    career.department = department || career.department;
    career.location = location || career.location;
    career.type = type || career.type;
    career.description = description || career.description;
    career.requirements = requirements || career.requirements;
    career.salary = salary || career.salary;
    career.deadline = deadline || career.deadline;
    career.isActive = isActive !== undefined ? isActive : career.isActive;
    
    await career.save();
    res.json(career);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteCareer = async (req, res) => {
  try {
    const career = await Career.findById(req.params.id);
    if (!career) {
      return res.status(404).json({ message: 'Career not found' });
    }
    
    await career.deleteOne();
    res.json({ message: 'Career deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};