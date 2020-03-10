import { APP_LOADING, SET_CURRENT_PAGE_TITLE } from '../actions/types.action';

export default function (state = { isLoading: false }, action) {
	switch (action.type) {
		case APP_LOADING:
			return {
				...state,
				isLoading: action.isLoading
			};
		case SET_CURRENT_PAGE_TITLE:
			return {
				...state,
				currentPageTitle: action.title,
				currentPageIcon: action.icon
			}
		default:
			return state;
	}
}