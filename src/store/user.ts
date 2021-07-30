type User = {
  displayName: string;
  email: string;
  photoURL: string;
};

type UserState = {
  isLoggedIn: boolean;
  data: User;
};

type State = {
  user: UserState;
};

const state = {
  user: {
    isLoggedIn: true,
    data: null,
  },
};

const getters = {
  user(state: State) {
    return state.user;
  },
};

const MutationTypes = {
  SET_LOGGED_IN: 'SET_LOGGED_IN',
  SET_USER: 'SET_USER',
};

const mutations = {
  SET_LOGGED_IN(state: State, value: boolean) {
    state.user.isLoggedIn = value;
  },
  SET_USER(state: State, user: User) {
    state.user.data = user;
  },
};

const ActionTypes = {
  fetchUser: 'fetchUser',
};

const actions = {
  fetchUser({ commit }, user: User) {
    commit(MutationTypes.SET_LOGGED_IN, user !== null);
    if (user) {
      commit(MutationTypes.SET_USER, {
        name: user.displayName,
        email: user.email,
        photoUrl: user.photoURL,
      });
    } else {
      commit(MutationTypes.SET_USER, null);
    }
  },
};
