import { Router } from "express";
import verifyToken from "../middlewares/AuthMiddleware.js";
import { getContactforDMList, searchContacts } from "../controllers/ContactsController.js";
const contactsRoutes=Router();

contactsRoutes.post("/search",verifyToken,searchContacts)
contactsRoutes.get("/get-contact-for-dm",verifyToken,getContactforDMList)

export default contactsRoutes;

