const noteModel = require('../models/NotesModel.js');
const express = require('express');
const noteRoutes = express.Router();

//TODO - Create a new Note
//http://mongoosejs.com/docs/api.html#document_Document-save
noteRoutes.post('/notes', async (req, res) => {
    // Validate request
    if(!req.body.content) {
        return res.status(400).send({
            message: "Note content can not be empty"
        });
    }
    try {
        const note = new noteModel(req.body.content);
        const savedNote = await note.save();
        res.status(201).send(savedNote);
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
});

//TODO - Retrieve all Notes
//http://mongoosejs.com/docs/api.html#find_find
noteRoutes.get('/notes', async (req, res) => {
    try {
        const notes = await noteModel.find();
        res.send(notes);
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
});

//TODO - Retrieve a single Note with noteId
//http://mongoosejs.com/docs/api.html#findbyid_findById
noteRoutes.get('/notes/:noteId', async (req, res) => {
    try {
        const note = await noteModel.findById(req.params.noteId);
        if (!note) {
            return res.status(404).send({ message: "Note not found" });
        }
        res.send(note);
    } catch (err) {
        res.status(400).send({ message: "Invalid note id" });
    }
});

//TODO - Update a Note with noteId
//http://mongoosejs.com/docs/api.html#findbyidandupdate_findByIdAndUpdate
noteRoutes.put('/notes/:noteId', async (req, res) => {
    // Validate request
    if (!req.body.content) {
        return res.status(400).send({
            message: "Note content can not be empty"
        });
    }

    try {
        const note = await noteModel.findByIdAndUpdate(
            req.params.noteId,
            { ...req.body.content, dateUpdated: Date.now() },
            { new: true, runValidators: true }
        );
        if (!note) {
            return res.status(404).send({ message: "Note not found" });
        }
        res.send(note);
    } catch (err) {
        res.status(400).send({ message: err.message });
    }
});

//TODO - Delete a Note with noteId
//http://mongoosejs.com/docs/api.html#findbyidandremove_findByIdAndRemove
noteRoutes.delete('/notes/:noteId', async (req, res) => {
    try {
        const note = await noteModel.findByIdAndDelete(req.params.noteId);
        if (!note) {
            return res.status(404).send({ message: "Note not found" });
        }
        res.send({ message: "Note deleted successfully" });
    } catch (err) {
        res.status(400).send({ message: "Invalid note id" });
    }
});

module.exports = noteRoutes;
