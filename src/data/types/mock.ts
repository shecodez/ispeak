export interface ApiError {
  message?: string;
  error_description?: string;
}

export interface Credentials {
  username?: string | undefined;
  email: string | undefined;
  password?: string | undefined;
  provider?: 'google' | undefined;
}

export interface Profile {
  id: string; //uid

  avatar_url?: string;
  bio?: string;
  username: string;

  // liked?: []; //id: boardId
  // saved?: []; //id: boardId & listId
  // count following, count followers, count storyboards

  created_at?: string;
  updated_at?: string;
}

// export interface User {
//   id: string;

//   email: string;

//   gems?: number;
//   stripe_customer_id?: string;
//   subscription_plans?: string[];
// }

export interface Board {
  id?: number;

  position?: number;
  title: string;
  subtitle?: string;
  slug?: string;
  image_url?: string;
  image_by?: string;
  excerpt?: string;
  description?: string;
  is_public?: boolean;
  lists?: List[];
  //members?: []; // Member[]
  //tags?: []; // Tag[]

  user_id?: string;
  profiles?: Profile;

  inserted_at?: string;
  updated_at?: string;
}

export interface List {
  id?: number;

  position?: number;
  title: string;
  subtitle?: string;
  slug?: string;
  image_url?: string;
  image_by?: string;
  description?: string;
  publish_date?: string | null;
  gems?: number;
  cards?: Card[];

  user_id?: string;
  board_id?: number;

  inserted_at?: string;
  updated_at?: string;
}

export enum Color {
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

export type NTagColor = {
  color?: string;
  borderColor?: string;
  textColor?: string;
};

export interface Card {
  id?: number;

  position?: number;
  text: string;
  audio_url?: string;
  details?: string;
  label?: string;
  color?: Color; // used for card background color or card label color
  text_color?: Color; //Color.light | Color.dark
  assigned_to?: [];

  user_id?: string;
  list_id?: number;

  inserted_at?: string;
  updated_at?: string;
}

export interface Activity {
  id?: number;

  text: string;

  user_id?: string;
  profiles?: Profile;
  board_id?: number;
  boards?: Board;
  //list_id?: string;
  //card_id?: string;

  created_at?: string;
}

export interface Tag {
  id?: number;

  name: string;
  description?: string;
  count?: number;

  created_at?: string;
  updated_at?: string;
}

export interface Tip {
  id: string;

  media_url?: string;
  message: string;

  created_at?: string;
  updated_at?: string;
}

export interface ContactForm {
  name?: string;
  email: string;
  subject?: string;
  message: string;
}
