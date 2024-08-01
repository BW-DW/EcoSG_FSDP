module.exports = (sequelize, DataTypes) => {
    const EventParticipant = sequelize.define("EventParticipant", {
        eventId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Event',
                key: 'id'
            }
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'User',
                key: 'id'
            }
        }
    }, {
        tableName: 'event_participants'
    });

    return EventParticipant;
}
