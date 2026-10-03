// Builds a randomuser.me request URL from an options object and fetches it.
// Backwards compatible: getRandomUser() with no args behaves like before
// (returns a single user in `results`).
const BASE_URL = "https://randomuser.me/api/";

export const buildUserUrl = ({ results = 1, gender, nat, seed } = {}) => {
    const params = new URLSearchParams();
    params.set("results", String(results));
    if (gender && gender !== "all") params.set("gender", gender);
    if (nat) params.set("nat", nat);          // e.g. "us" or "us,gb,fr"
    if (seed) params.set("seed", seed);       // reproducible result sets
    return `${BASE_URL}?${params.toString()}`;
};

export const getRandomUser = async (options = {}) => {
    const response = await fetch(buildUserUrl(options), { method: "GET" });
    if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
    }
    return response.json();
};
