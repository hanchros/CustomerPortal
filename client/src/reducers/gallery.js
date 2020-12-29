import {
  FETCH_GALLERYLIST,
  SET_CURRENT_GALLERY,
  FETCH_GALLERY_SEARCH_LIST,
} from "../actions/types";

const INITIAL_STATE = {
  gallerys: [],
  currentGallery: {},
  searchTxt: "",
  total: 0,
};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case FETCH_GALLERYLIST:
      let gallerys = [...state.gallerys, ...action.gallerys]
      return { ...state, gallerys, total: action.total };
    case SET_CURRENT_GALLERY:
      return { ...state, currentGallery: action.gallery || {} };
    case FETCH_GALLERY_SEARCH_LIST:
      return {
        ...state,
        gallerys: action.gallerys,
        searchTxt: action.searchTxt,
      };
    default:
      return state;
  }
}
