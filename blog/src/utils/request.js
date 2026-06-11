export const request = (url, method, data) => {
	return fetch(url, {
		headers: {
			'Content-type': 'application/json',
		},
		method: method || 'GET',
		credentials: 'include',
		body: data ? JSON.stringify(data) : undefined,
	}).then((res) => res.json());
};
