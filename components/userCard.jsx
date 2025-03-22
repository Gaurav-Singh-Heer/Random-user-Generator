import React from "react";

const UserCard = (props) => {
    if (!props.data) return <p>Loading user...</p>;

    const user = props.data;

    return (
        <div className="user-card">
            <img className="user-img" src={user.picture.large} alt="User" />
            <h3>{user.name.first} {user.name.last}</h3>
            <p className="email">{user.email}</p>
            <p><strong>Phone:</strong> {user.phone}</p>
            <p><strong>Age:</strong> {user.dob.age}</p>
            <p><strong>Location:</strong> {user.location.city}, {user.location.state}</p>
            <p><strong>Country:</strong> {user.location.country}</p>
        </div>
    );
}

export default UserCard;
