module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define("User", {
        name: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        email: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        password: {
            type: DataTypes.STRING(100),
            allowNull: false
        }
    }, {
        tableName: 'users'
    });

    User.associate = (models) => {
        User.hasMany(models.Event, {
            foreignKey: "userId",
            onDelete: "cascade"
        });
        User.belongsToMany(models.Event, {
            through: 'EventParticipant',
            as: 'events',
            foreignKey: 'userId'
        });
    };

    return User;
}
