import React from "react";

// Nationalities supported by the randomuser.me API.
const NATIONALITIES = ["US", "GB", "FR", "DE", "ES", "CA", "AU", "IN", "BR", "NO"];

// Controlled panel that drives the API query (gender, nationality, count, seed)
// and the client-side search/sort of the already-fetched results.
const FilterPanel = ({ filters, onChange, onGenerate, loading }) => {
    const update = (key, value) => onChange({ ...filters, [key]: value });

    return (
        <div className="filter-panel">
            <div className="filter-row">
                <label>
                    Gender
                    <select
                        value={filters.gender}
                        onChange={(e) => update("gender", e.target.value)}
                    >
                        <option value="all">All</option>
                        <option value="female">Female</option>
                        <option value="male">Male</option>
                    </select>
                </label>

                <label>
                    Nationality
                    <select
                        value={filters.nat}
                        onChange={(e) => update("nat", e.target.value)}
                    >
                        <option value="">Any</option>
                        {NATIONALITIES.map((n) => (
                            <option key={n} value={n}>{n}</option>
                        ))}
                    </select>
                </label>

                <label>
                    Count
                    <input
                        type="number"
                        min="1"
                        max="50"
                        value={filters.results}
                        onChange={(e) => update("results", Number(e.target.value))}
                    />
                </label>

                <label>
                    Seed
                    <input
                        type="text"
                        placeholder="optional"
                        value={filters.seed}
                        onChange={(e) => update("seed", e.target.value)}
                    />
                </label>

                <button className="generate-btn" onClick={onGenerate} disabled={loading}>
                    {loading ? "Generating…" : "Generate"}
                </button>
            </div>

            <div className="filter-row">
                <input
                    className="search-input"
                    type="search"
                    placeholder="Search name, email, country…"
                    value={filters.search}
                    onChange={(e) => update("search", e.target.value)}
                />

                <label>
                    Sort by
                    <select
                        value={filters.sortBy}
                        onChange={(e) => update("sortBy", e.target.value)}
                    >
                        <option value="none">Default</option>
                        <option value="name">Name</option>
                        <option value="age">Age</option>
                        <option value="country">Country</option>
                    </select>
                </label>
            </div>
        </div>
    );
};

export default FilterPanel;
