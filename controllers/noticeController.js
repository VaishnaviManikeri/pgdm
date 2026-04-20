const Notice = require('../models/Notice');

exports.getAllNotices = async (req, res) => {
  try {
    const notices = await Notice.find().sort({ createdAt: -1 });
    res.json(notices);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getNoticeById = async (req, res) => {
  try {
    const notice = await Notice.findById(req.params.id);
    if (!notice) {
      return res.status(404).json({ message: 'Notice not found' });
    }
    res.json(notice);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createNotice = async (req, res) => {
  try {
    const { title, content, isImportant, date } = req.body;
    const notice = new Notice({
      title,
      content,
      isImportant: isImportant || false,
      date: date || new Date()
    });
    
    await notice.save();
    res.status(201).json(notice);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateNotice = async (req, res) => {
  try {
    const { title, content, isImportant, date } = req.body;
    const notice = await Notice.findById(req.params.id);
    
    if (!notice) {
      return res.status(404).json({ message: 'Notice not found' });
    }
    
    notice.title = title || notice.title;
    notice.content = content || notice.content;
    notice.isImportant = isImportant !== undefined ? isImportant : notice.isImportant;
    notice.date = date || notice.date;
    
    await notice.save();
    res.json(notice);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteNotice = async (req, res) => {
  try {
    const notice = await Notice.findById(req.params.id);
    if (!notice) {
      return res.status(404).json({ message: 'Notice not found' });
    }
    
    await notice.deleteOne();
    res.json({ message: 'Notice deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};