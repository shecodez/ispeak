import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL as string,
  import.meta.env.VITE_SUPABASE_ANON_KEY as string
);

export async function count(table: string) {
  try {
    const { error, count } = await supabase.from(table).select('*', { count: 'exact', head: true });
    if (error) throw error;

    return count;
  } catch (e: any) {
    console.error(e.error_description || e.message);
    return 0;
  }
}

const downloadImage = async (bucketName: string, fileName: string) => {
  try {
    const { data, error } = await supabase.storage.from(bucketName).download(fileName);
    if (error) throw error;

    return URL.createObjectURL(data);
  } catch (e: any) {
    console.error(e.error_description || e.message);
    return null;
  }
};

/*export default {
  get user() {
    return userSession.value?.user;
  },

  signIn(email: string, password?: string) {
    return supabase.auth.signIn({ email, password });
  },
  signInWithGoogle() {
    // const { user, session, error } = await supabase.auth.signIn({
    //   provider: 'google'
    // });
    return supabase.auth.signIn({ provider: 'google' });
  },
  signOut() {
    // const { error } = await supabase.auth.signOut();
    return supabase.auth.signOut();
  },
  signUp(email: string, password: string) {
    return supabase.auth.signUp({ email, password });
  },

  //---------------------------------------------------------------------------------
  boards: {
    async all() {
      const { body, error } = await supabase.from('boards').select('*').order('position');

      return { data: body as Board[], error };
    },

    async getById(id: number) {
      const { body, error } = await supabase
        .from('boards')
        .select(
          'id, title, lists ( id, position, title, slug, description, publish_date, gems, cards ( id, position, text, hint, bg_color, text_color ))'
        )
        .eq('id', id)
        .order('position')
        .order('position', { foreignTable: 'lists' })
        .order('position', { foreignTable: 'lists.cards' })
        .single();

      return { data: body as Board, error };
    },

    async create(board: Board) {
      const { body, error } = await supabase.from('boards').insert(board);
      const data: Board = body ? { ...body[0], lists: [] } : null;

      return { data, error };
    },

    async update(board: Board) {
      const { body, error } = await supabase
        .from('boards')
        .update({
          title: board.title,
          slug: board.slug,
          image_url: board.image_url,
          description: board.description,
          is_public: board.is_public,
        })
        .match({ id: board.id });
      const data: Board = body ? { ...body[0] } : null;

      return { data, error };
    },

    async delete(board: Board) {
      return await supabase.from('boards').delete().eq('id', board.id);
    },

    /**
     * Update each List positon in given Board (postgressql fn)
     * @param board
     * @returns boolean or error
     *
    async sort(board: Board) {
      const { body, error } = await supabase.rpc('sort_board', {
        board_id: board.id,
        list_ids: board.lists?.map((list) => list.id),
      });

      return { data: body, error };
    },
  },
  //---------------------------------------------------------------------------------
  lists: {
    async create(board: Board, list: List) {
      const { body, error } = await supabase.from('lists').insert({ ...list, board_id: board.id });
      const data: List = body ? { ...body[0], cards: [] } : null;

      return { data, error };
    },

    async update(list: List) {
      const { body, error } = await supabase
        .from('lists')
        .update({
          title: list.title,
          slug: list.slug,
          description: list.description,
          publish_date: list.publish_date,
          gems: list.gems, 
        })
        .match({ id: list.id });
      const data: List = body ? { ...body[0] } : null;

      return { data, error };
    },

    async delete(list: List) {
      return await supabase.from('lists').delete().eq('id', list.id);
    },

    /**
     *  Update each Card positon in given List (postgressql fn)
     * @param list
     * @returns boolean or error
     *
    async sort(list: List) {
      const { body, error } = await supabase.rpc('sort_list', {
        new_list_id: list.id,
        card_ids: list.cards?.map((card) => card.id),
      });

      return { data: body, error };
    },
  },
  //---------------------------------------------------------------------------------
  cards: {
    async create(list: List, card: Card) {
      const { body, error } = await supabase.from('cards').insert({ ...card, list_id: list.id });
      const data: Card = body ? { ...body[0] } : null;

      return { data, error };
    },

    async update(card: Card) {
      const { body, error } = await supabase
        .from('cards')
        .update({ text: card.text, hint: card.hint, bg_color: card.bg_color, text_color: card.text_color })
        .match({ id: card.id });
      const data: Card = body ? { ...body[0] } : null;

      return { data, error };
    },

    async delete(card: Card) {
      return await supabase.from('cards').delete().eq('id', card.id);
    },
  },
};*/
