import { Document } from "mongoose";

export interface Profile extends Document {
    id: string;
    name: string;
    nickname: string | undefined;
    home: string;
    airports: Array<String>;
    avatar: string | undefined;
    color: string | undefined;
  }