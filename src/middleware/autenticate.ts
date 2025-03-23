import { NextFunction, Response, Request } from "express";
import firebaseAdmin from "../lib/firebase";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function (req: Request, res: Response, next: NextFunction) {
  try {
    const firebaseToken = req.headers.authorization?.split(" ")[1];

    let firebaseUser;
    if (firebaseToken) {
      firebaseUser = await firebaseAdmin.auth.verifyIdToken(firebaseToken);
    }

    if (!firebaseUser) {
      // Unauthorized
      return res.sendStatus(401);
    }

    const user = await prisma.user.findFirst({
      where: {
        firebaseId: firebaseUser.user_id
      }
    });

    req.user = user || undefined;

    next();
  } catch (err) {
    console.log(err);
    // Unauthorized
    res.sendStatus(401);
  }
}