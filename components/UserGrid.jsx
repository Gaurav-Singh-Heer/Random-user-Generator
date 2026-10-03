import React from "react";
import UserCard from "./userCard";
import { userId } from "./exportUtils";

// Renders the list of users as a responsive grid. While loading it shows
// skeleton placeholders instead of a bare "Loading…" string.
const UserGrid = ({ users, loading, favorites, onToggleFavorite }) => {
    if (loading) {
        return (
            <div className="user-grid">
                {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="user-card skeleton" />
                ))}
            </div>
        );
    }

    if (!users.length) {
        return <p className="empty-state">No users match your filters.</p>;
    }

    return (
        <div className="user-grid">
            {users.map((user) => (
                <UserCard
                    key={userId(user)}
                    data={user}
                    isFavorite={favorites.includes(userId(user))}
                    onToggleFavorite={() => onToggleFavorite(user)}
                />
            ))}
        </div>
    );
};

export default UserGrid;
