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
  userame: string;
  email?: string;

  //favorites?: [];
  //liked?: [];
  //saved?: [];

  gems?: number;
  stripe_customer_id?: string;
  subscription_plans?: string[];

  inserted_at?: string; // timestamp
  updated_at?: string; // timestamp
}

export interface Board {
  id?: number;

  position: number;
  title: string;
  slug?: string;
  image_url?: string;
  description?: string;
  is_public?: boolean;
  lists?: List[];
  //members?: []; // Member[]
  //tags?: []; // Tag[]

  user_id?: string;

  inserted_at?: string; // timestamp
  updated_at?: string; // timestamp
}

export interface List {
  id?: number;

  position: number;
  title: string;
  slug?: string;
  //image_url?: string;
  description?: string;
  publish_date?: string | null;
  gems?: number;
  cards?: Card[];

  user_id?: string;
  board_id?: number;

  inserted_at?: string; // timestamp
  updated_at?: string; // timestamp
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

export interface Card {
  id?: number;

  position: number;
  text: string;
  audio_url?: string;
  details?: string;
  label?: string;
  color?: Color; // used for card background color or card label color
  text_color?: Color; //Color.light | Color.dark
  assigned_to?: [];

  user_id?: string;
  list_id?: number;

  inserted_at?: string; // timestamp
  updated_at?: string; // timestamp
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
