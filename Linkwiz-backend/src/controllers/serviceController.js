import Service from "../models/Service.js";
import User from "../models/User.js";

export const createService = async (req, res) => {
  try {
    const service = await Service.create({
      user: req.user,
      title: req.body.title,
      description: req.body.description,
      price: req.body.price,
      tags: req.body.tags
    });

    await User.findByIdAndUpdate(
      req.user,
      {
        $push: {
          services: service._id
        }
      }
    );

    res.json(service);

  } catch (err) {
    res.status(500).json(err);
  }
};

export const getAllServices = async (req, res) => {
  const q = req.query.q || "";

  const services = await Service.find({
    title: { $regex: q, $options: "i" }
  }).populate("user");

  res.json(services);
};

export const getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id).populate("user");
    res.json(service);
  } catch (err) {
    res.status(500).json(err);
  }
};

export const updateService = async (req, res) => {
  try {
    const updated = await Service.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json(err);
  }
};

export const deleteService = async (req, res) => {
  try {
    await Service.findByIdAndDelete(req.params.id);
    res.json({ message: "Service deleted" });
  } catch (err) {
    res.status(500).json(err);
  }
};