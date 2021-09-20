export * as useCards from './useCards';
export * as useBoards from './useBoards';
export * as useLists from './useLists';
export * as useSearch from './useSearch';

import * as actStore from './useActivity';
import * as cardStore from './useCards';
import * as boardStore from './useBoards';
import * as listStore from './useLists';
//import * as profileStore from './useProfiles';

export const db = {
  activity: actStore,
  cards: cardStore,
  boards: boardStore,
  lists: listStore,
  //profiles: profileStore,
};
