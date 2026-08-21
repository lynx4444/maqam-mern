import fs from 'fs';
import path from 'path';
import Grave from '../models/Grave.js';

// @desc    Get all graves or search
// @route   GET /api/graves
// @access  Public
export const getGraves = async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};

    if (search && search.trim() !== '') {
      const regex = new RegExp(search.trim(), 'i');
      query = {
        $or: [
          { name: regex },
          { ic_number: regex },
          { plot_number: regex },
          { date_of_death: regex },
        ],
      };
    }

    const graves = await Grave.find(query).sort({ createdAt: -1 });
    res.json(graves);
  } catch (error) {
    console.error('Fetch graves error:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// @desc    Search graves for map finder
// @route   GET /api/graves/search
// @access  Public
export const searchGraves = async (req, res) => {
  try {
    const { query: searchQuery } = req.query;

    if (!searchQuery || searchQuery.trim() === '') {
      const allGraves = await Grave.find({});
      return res.json(allGraves);
    }

    const regex = new RegExp(searchQuery.trim(), 'i');
    const results = await Grave.find({
      $or: [
        { name: regex },
        { ic_number: regex },
        { plot_number: regex },
        { date_of_death: regex },
      ],
    });

    res.json(results);
  } catch (error) {
    console.error('Search graves error:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// @desc    Get single grave by ID
// @route   GET /api/graves/:id
// @access  Public
export const getGraveById = async (req, res) => {
  try {
    const grave = await Grave.findById(req.params.id);
    if (!grave) {
      return res.status(404).json({ message: 'Grave record not found' });
    }
    res.json(grave);
  } catch (error) {
    console.error('Get grave by ID error:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// @desc    Create new grave
// @route   POST /api/graves
// @access  Private/Admin
export const createGrave = async (req, res) => {
  try {
    const { name, ic_number, date_of_death, plot_number, gps_lat, gps_lng, notes } = req.body;

    if (!name || !date_of_death || !plot_number || !gps_lat || !gps_lng) {
      return res.status(400).json({
        message: 'Name, Date of Death, Plot Number, Latitude, and Longitude are required.',
      });
    }

    let photoPath = null;
    if (req.file) {
      photoPath = `/uploads/${req.file.filename}`;
    }

    const grave = await Grave.create({
      name,
      ic_number: ic_number || '',
      date_of_death,
      plot_number,
      gps_lat: gps_lat.toString().trim(),
      gps_lng: gps_lng.toString().trim(),
      photo: photoPath,
      notes: notes || '',
      createdBy: req.user ? req.user._id : null,
    });

    res.status(201).json(grave);
  } catch (error) {
    console.error('Create grave error:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// @desc    Update grave
// @route   PUT /api/graves/:id
// @access  Private/Admin
export const updateGrave = async (req, res) => {
  try {
    const grave = await Grave.findById(req.params.id);
    if (!grave) {
      return res.status(404).json({ message: 'Grave record not found' });
    }

    const { name, ic_number, date_of_death, plot_number, gps_lat, gps_lng, notes } = req.body;

    if (name) grave.name = name;
    if (ic_number !== undefined) grave.ic_number = ic_number;
    if (date_of_death) grave.date_of_death = date_of_death;
    if (plot_number) grave.plot_number = plot_number;
    if (gps_lat) grave.gps_lat = gps_lat.toString().trim();
    if (gps_lng) grave.gps_lng = gps_lng.toString().trim();
    if (notes !== undefined) grave.notes = notes;

    // Handle new photo upload
    if (req.file) {
      // If old photo exists in uploads, delete it
      if (grave.photo && grave.photo.startsWith('/uploads/')) {
        const oldPath = path.join(process.cwd(), grave.photo);
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }
      grave.photo = `/uploads/${req.file.filename}`;
    }

    const updatedGrave = await grave.save();
    res.json(updatedGrave);
  } catch (error) {
    console.error('Update grave error:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// @desc    Delete grave
// @route   DELETE /api/graves/:id
// @access  Private/Admin
export const deleteGrave = async (req, res) => {
  try {
    const grave = await Grave.findById(req.params.id);
    if (!grave) {
      return res.status(404).json({ message: 'Grave record not found' });
    }

    // Delete photo file if present
    if (grave.photo && grave.photo.startsWith('/uploads/')) {
      const filePath = path.join(process.cwd(), grave.photo);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await Grave.findByIdAndDelete(req.params.id);
    res.json({ message: 'Grave record deleted successfully' });
  } catch (error) {
    console.error('Delete grave error:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};
