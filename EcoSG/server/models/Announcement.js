module.exports = (sequelize, DataTypes) => {
    const Announcement = sequelize.define("Announcement", {
        subject: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        type: {
            type: DataTypes.ENUM('default', 'important', 'urgent'),
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        for: {
            type: DataTypes.ENUM('staff', 'customer'),
            allowNull: false
        }
    }, {
        tableName: 'announcements'
    });

    Announcement.associate = (models) => {
        Announcement.belongsTo(models.User, {
            foreignKey: "userId",
            as: 'user'
        });
    };

    return Announcement;
};