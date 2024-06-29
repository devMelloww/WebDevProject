// src/services/profile-svc.ts
import { Schema, model, Document } from "mongoose";
import { Profile } from "../models/profile";

// Define the schema
const ProfileSchema = new Schema<Profile>(
  {
    id: { type: String, required: true, trim: true },
    name: { type: String, required: true, trim: true },
    nickname: { type: String, trim: true },
    home: { type: String, trim: true },
    airports: [String],
    avatar: String,
    color: String
  },
  { collection: "user_profiles" }
);

// Create the model
const ProfileModel = model<Profile>("Profile", ProfileSchema);

// Retrieve all profiles
function index(): Promise<Profile[]> {
  return ProfileModel.find().lean().exec().then(profiles => profiles as Profile[]);
}

// Retrieve a single profile by id
function get(id: string): Promise<Profile | null> {
  return ProfileModel.findOne({ id }).lean().exec().then(profile => profile as Profile | null);
}

// Create a new profile
function create(profile: Profile): Promise<Profile> {
  const p = new ProfileModel(profile);
  return p.save().then(savedProfile => savedProfile.toObject() as Profile);
}

function update(
  userid: String,
  profile: Profile
): Promise<Profile> {
  return ProfileModel.findOne({ userid })
    .then((found) => {
      if (!found) throw `${userid} Not Found`;
      else
        return ProfileModel.findByIdAndUpdate(
          found._id,
          profile,
          {
            new: true
          }
        );
    })
    .then((updated) => {
      if (!updated) throw `${userid} not updated`;
      else return updated as Profile;
    });
}

// Export the functions
export default { index, get, create, update };
