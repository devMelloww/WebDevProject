// src/routes/profiles.ts
import express, { Request, Response } from "express";
import profiles from "../services/profile-svc";
import { Profile } from "../models/profile";

const router = express.Router();

// Get a profile by user id
router.get("/:userid", (req: Request, res: Response) => {
  const { userid } = req.params;

  profiles
    .get(userid)
    .then((profile: Profile | null) => {
      if (profile) {
        res.json(profile);
      } else {
        res.status(404).end();
      }
    })
    .catch((err) => res.status(500).send(err));
});

// Create a new profile
router.post("/profiles", (req: Request, res: Response) => {
  const newProfile = req.body;

  profiles
    .create(newProfile)
    .then((profile: Profile) => res.status(201).send(profile))
    .catch((err) => res.status(500).send(err));
});

// Get all profiles
router.get("/", (req: Request, res: Response) => {
  profiles
    .index()
    .then((list: Profile[]) => res.json(list))
    .catch((err) => res.status(500).send(err));
});

router.put("/:userid", (req: Request, res: Response) => {
  const { userid } = req.params;
  const newProfile = req.body;

  profiles.update(userid, newProfile)
    .then((profile: Profile) => res.json(profile))
    .catch((err) => {
      console.error('Error updating profile:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    });
});

export default router;
