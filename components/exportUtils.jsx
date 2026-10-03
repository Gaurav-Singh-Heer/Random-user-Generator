// Helpers to turn a list of randomuser.me user objects into downloadable
// files (JSON / CSV) entirely in the browser.

// A unique id for a user — the API's login.uuid, with email as a fallback.
export const userId = (user) => user?.login?.uuid ?? user?.email;

const flattenUser = (user) => ({
    name: `${user.name.first} ${user.name.last}`,
    gender: user.gender,
    email: user.email,
    phone: user.phone,
    age: user.dob.age,
    city: user.location.city,
    state: user.location.state,
    country: user.location.country,
    nat: user.nat,
});

const triggerDownload = (content, filename, type) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};

export const exportAsJSON = (users, filename = "users.json") => {
    triggerDownload(JSON.stringify(users, null, 2), filename, "application/json");
};

export const exportAsCSV = (users, filename = "users.csv") => {
    if (!users.length) return;
    const rows = users.map(flattenUser);
    const headers = Object.keys(rows[0]);
    const escape = (val) => `"${String(val).replace(/"/g, '""')}"`;
    const csv = [
        headers.join(","),
        ...rows.map((row) => headers.map((h) => escape(row[h])).join(",")),
    ].join("\n");
    triggerDownload(csv, filename, "text/csv");
};
