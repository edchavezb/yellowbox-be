import { Router } from "express";
import authenticate from "../../middleware/autenticate"

const routes = Router();

// Get the authenticated user's data
routes.get("/me", authenticate, async (req, res) => {
  res.status(200).json({ appUser: req.user });
});




export default routes;
