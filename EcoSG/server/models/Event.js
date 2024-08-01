module.exports = (sequelize, DataTypes) => {
    const Event = sequelize.define("Event", {
        title: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        type: {
            type: DataTypes.STRING, // Add this line
            allowNull: true // Set to `false` if required
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        organisers: {
            type: DataTypes.STRING,
            allowNull: true
        },
        status: {
            type: DataTypes.STRING,
            allowNull: true
        },
        date: {
            type: DataTypes.DATEONLY,
            allowNull: true
        },
        time: {
            type: DataTypes.TIME,
            allowNull: true
        },
        duration: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        location: {
            type: DataTypes.STRING,
            allowNull: true
        },
        maxPax: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        facilities: {
            type: DataTypes.STRING,
            allowNull: true
        },
        manpower: {
            type: DataTypes.STRING,
            allowNull: true
        }
    }, {
        tableName: 'events'
    });

    Event.associate = (models) => {
        Event.belongsTo(models.User, {
            foreignKey: "userId",
            as: 'user'
        });
        Event.belongsToMany(models.User, {
            through: 'EventParticipant',
            as: 'participants',
            foreignKey: 'eventId'
        });
    };

    return Event;
}
