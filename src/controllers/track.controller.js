const mongoose = require("mongoose");
const { TrackModel } = require("../models/track.model");
const { CourseModel } = require("../models/course.model");

class TrackController {
  async create(req, res) {
    try {
      const courseSlug = req.params.slug;
      const course = await CourseModel.findOne({
        slug: courseSlug,
      })

      const track = new TrackModel({
        ...req.body,
        course: course._id
      });
      await track.save()


      course.tracks.push(track._id);
      await course.save();


      await TrackModel
        .findById({
          _id: track._id
        })
        .populate('course')
        .exec(function (err, fullTrack) {
          if (err) throw Error('Error When Populate Course For Track');
          return res.json({
            fullTrack
          })
        })
    } catch (err) {
      console.log(err.message)
      return res.status(500).json({
        msg: "Bad response"
      })
    }

  }

  async getTrackById(req, res) {
    const { id } = req.params;

    try {
      const track = await TrackModel
        .findById(id)
        .populate('course')
        .populate('comments')
        .exec(function (err, track) {
          if (err) throw Error('Error When Populate Course For Track');

          return res.json({
            track
          })
        });


    } catch (err) {
      console.log(err.message);
      return res.status(500).json({
        msg: "Error When Get Track By ID"
      });
    }
  }

  async editTrackById(req, res) {
    const { id } = req.params;
    const newTrackData = req.body;

    try {
      const track = await TrackModel 
        .findByIdAndUpdate(id, newTrackData, {
          returnOriginal: false
        })

      return res.json({
        track 
      })


    } catch (err) {
      console.log(err.message);
      return res.status(500).json({
        msg: "Error When Edit Track By Id"
      });
    }
  }

  async deleteTrackById(req, res) {
    const { id }= req.params;

    try{
      const track = await TrackModel.findByIdAndDelete(id);
      
      return res.json({
        track 
      })


    } catch (err) {
      console.log(err.message);
      return res.status(500).json({
        msg: "Error When Delete Track By Id"
      });
    } 
  }
}

module.exports = new TrackController;