import Message from "../models/Message.js";

export const sendMessage = async (req, res) => {
  const { receiver, text } = req.body;

  try {
    const msg = await Message.create({
      sender: req.user,
      receiver,
      text
    });

    res.json(msg);
  } catch (err) {
    res.status(500).json(err);
  }
};

export const getMessages = async (req, res) => {
  const { userId } = req.params;

  try {
    const messages = await Message.find({
      $or: [
        { sender: req.user, receiver: userId },
        { sender: userId, receiver: req.user }
      ]
    }).sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    res.status(500).json(err);
  }
};