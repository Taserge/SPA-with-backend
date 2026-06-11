import { useEffect } from 'react';
import { useStore } from 'react-redux';

export const useResetForm = (reset) => {
	const store = useStore();

	useEffect(() => {
		let currentWaslogout = store.getState().app.wasLogout;

		return store.subscribe(() => {
			let previousWasLogout = currentWaslogout;
			currentWaslogout = store.getState().app.wasLogout;

			if (currentWaslogout !== previousWasLogout) {
				reset();
			}
		});
	}, [reset, store]);
};
