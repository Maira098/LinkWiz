import Exchange from "../models/Exchange.js";
import Service from "../models/Service.js";

//
// 1. SEND EXCHANGE REQUEST
//
export const sendExchangeRequest = async (req, res) => {
  const { provider, serviceOffered, serviceRequested, message } = req.body;

  try {
    // verify that services exist
    const offered = await Service.findById(serviceOffered);
    const requested = await Service.findById(serviceRequested);

    if (!offered || !requested)
      return res.status(404).json({ message: "Services not found" });

    const exchange = await Exchange.create({
      requester: req.user,
      provider,
      serviceOffered,
      serviceRequested,
      message
    });

    res.json({ message: "Exchange request sent", exchange });
  } catch (err) {
    res.status(500).json(err);
  }
};

//
// 2. GET MY SENT REQUESTS
//
export const getSentRequests = async (req, res) => {
  try {
    const requests = await Exchange.find({ requester: req.user })
      .populate("provider")
      .populate("serviceOffered")
      .populate("serviceRequested");

    res.json(requests);
  } catch (err) {
    res.status(500).json(err);
  }
};

//
// 3. GET MY RECEIVED REQUESTS
//
export const getReceivedRequests = async (req, res) => {
  try {
    const requests = await Exchange.find({ provider: req.user })
      .populate("requester")
      .populate("serviceOffered")
      .populate("serviceRequested");

    res.json(requests);
  } catch (err) {
    res.status(500).json(err);
  }
};

//
// 4. ACCEPT EXCHANGE REQUEST
//
export const acceptRequest = async (req, res) => {
  try {
    const exchange = await Exchange.findById(req.params.id);

    if (!exchange)
      return res.status(404).json({ message: "Exchange not found" });

    if (exchange.provider.toString() !== req.user)
      return res.status(403).json({ message: "Not authorized" });

    exchange.status = "accepted";
    await exchange.save();

    res.json({ message: "Exchange accepted", exchange });
  } catch (err) {
    res.status(500).json(err);
  }
};

//
// 5. REJECT EXCHANGE REQUEST
//
export const rejectRequest = async (req, res) => {
  try {
    const exchange = await Exchange.findById(req.params.id);

    if (!exchange)
      return res.status(404).json({ message: "Exchange not found" });

    if (exchange.provider.toString() !== req.user)
      return res.status(403).json({ message: "Not authorized" });

    exchange.status = "rejected";
    await exchange.save();

    res.json({ message: "Exchange rejected", exchange });
  } catch (err) {
    res.status(500).json(err);
  }
};

//
// 6. MARK AS COMPLETED
//
export const completeExchange = async (req, res) => {
  try {
    const exchange = await Exchange.findById(req.params.id);

    if (!exchange)
      return res.status(404).json({ message: "Exchange not found" });

    if (
      exchange.provider.toString() !== req.user &&
      exchange.requester.toString() !== req.user
    )
      return res.status(403).json({ message: "Not authorized" });

    exchange.status = "completed";
    await exchange.save();

    res.json({ message: "Exchange completed", exchange });
  } catch (err) {
    res.status(500).json(err);
  }
};
export const getExchangeById = async (req, res) => {
  try {
    const exchange = await Exchange.findById(req.params.id)
      .populate("provider")
      .populate("requester")
      .populate("serviceOffered")
      .populate("serviceRequested");

    if (!exchange) {
      return res.status(404).json({
        message: "Exchange not found",
      });
    }

    res.json(exchange);
  } catch (err) {
    res.status(500).json(err);
  }
};