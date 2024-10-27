export const resolveUrl = (url) => /^https?:/.test(url) ? url : `${process.env.REACT_APP_BACKEND_ORIGIN}${url}`;

export const makeApiRequestAndCheckStatus = async (endpoint, method, body) => {
    try {
        const response = await fetch(resolveUrl(endpoint), {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });
        if (!response.ok) {
            throw new Error(`Failed to ${method} at ${endpoint}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Error during ${method} request to ${endpoint}:`, error);
    }
};