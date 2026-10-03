import React, { useState } from "react";

const UserCard = (props) => {
    const [copied, setCopied] = useState("");

    if (!props.data) return <p>Loading user...</p>;

    const user = props.data;
    const { isFavorite = false, onToggleFavorite } = props;

    const fullName = `${user.name.first} ${user.name.last}`;

    const copy = (label, text) => {
        navigator.clipboard?.writeText(text).then(() => {
            setCopied(label);
            setTimeout(() => setCopied(""), 1200);
        });
    };

    return (
        <div className="user-card">
            {onToggleFavorite && (
                <button
                    className={`fav-btn ${isFavorite ? "active" : ""}`}
                    onClick={onToggleFavorite}
                    aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
                    title={isFavorite ? "Remove from favorites" : "Add to favorites"}
                >
                    {isFavorite ? "★" : "☆"}
                </button>
            )}

            <img className="user-img" src={user.picture.large} alt={fullName} />
            <h3>{fullName}</h3>

            <p className="email" onClick={() => copy("email", user.email)} title="Click to copy">
                {user.email}
            </p>
            <p onClick={() => copy("phone", user.phone)} title="Click to copy">
                <strong>Phone:</strong> {user.phone}
            </p>
            <p><strong>Age:</strong> {user.dob.age}</p>
            <p><strong>Location:</strong> {user.location.city}, {user.location.state}</p>
            <p><strong>Country:</strong> {user.location.country}</p>

            {copied && <span className="copied-toast">Copied {copied}!</span>}
        </div>
    );
};

export default UserCard;
