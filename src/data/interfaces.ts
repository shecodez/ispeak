export interface User {
  id: string; //uid
  displayName: string;
  name: string; // if google signin user+guid
  //email: string;
  photoURL: string;
  gems?: number;
  subscriptionPlans?: string[];
  //stripeCustomerId: string;
  liked: []; // sagaId
  favorites: []; // kanbanId
  saved: []; // sagaId + boardId
}

export interface Kanban {
  id: string;
  title: string;
  slug: string; // readonly
  description?: string;
  imageURL?: string;
  isPublic: boolean;
  boards: Board[];
  members?: []; // Member[]
  tags?: []; // Tag[]
  uid: string;
  username: string;
}

export interface Board {
  id: string;
  title: string;
  slug: string; // read only
  description?: string; // richtext
  //imageURL?: string;
  isPublished: boolean;
  isEpic: boolean;
  notes?: [];
  kanbanId: string;
}

export enum NoteColor {
  blue = '#a9e6ff',
  purple = '#eddef2',
  mint = '#b6ffe0',
  yellow = '#fdffa4',
  pink = '#f3ddf3',
  red = '#de7477',
  gray = '#999',
  light = '#f3f3f3',
  dark = '#333',
}

export interface Note {
  id: string;
  text: string;
  audioURL?: string;
  hint?: string;
  //mediaURL?: image / gif / video
  assignedTo: string; // User
  noteColor: NoteColor;
  textColor: NoteColor; // NoteColor.light | NoteColor.dark;
  boardId: string;
}

export interface Tag {
  id: string;
  name: string;
  description?: string;
  count: number;
}

export interface Tip {
  id: string;
  mediaURL?: string;
  message: string;
}

export interface ContactForm {
  name: string;
  email: string;
  subject?: string;
  message: string;
}
