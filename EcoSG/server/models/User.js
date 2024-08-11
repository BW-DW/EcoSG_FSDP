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
        },
        dob: {  // Add this field
            type: DataTypes.DATEONLY,
            allowNull: true
        },
        donation: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: false,
        },
        role: {
            type: DataTypes.STRING,
            defaultValue: 'customer',
            allowNull: false,
        },
        verified: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false,
        }
    }, {
        tableName: 'users'
    });

    User.associate = (models) => {
        User.hasMany(models.Reward, {
                foreignKey: "userId",
                onDelete: "cascade"
        });
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
