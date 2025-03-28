import { NextFunction, Response, Request } from "express";
import firebaseAdmin from "../lib/firebase";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function attachCurrentUser(req: Request, res: Response, next: NextFunction) {
  try {
    const firebaseToken = req.headers.authorization?.split(" ")[1];

    let firebaseUser;
    if (firebaseToken) {
      try {
        firebaseUser = await firebaseAdmin.auth.verifyIdToken(firebaseToken);
      } catch (err) {
        console.log("Invalid Firebase token:", err);
      }
    }

    if (firebaseUser) {
      const user = await prisma.user.findFirst({
        where: {
          firebaseId: firebaseUser.user_id,
        },
      });

      req.user = user || undefined;
    } else {
      req.user = undefined;
    }

    next();
  } catch (err) {
    console.log("Error in addUserToRequest middleware:", err);
    next(); // Continue without blocking the request
  }
}