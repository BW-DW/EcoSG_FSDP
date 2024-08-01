module.exports = (sequelize, DataTypes) => {
    const Facility = sequelize.define("Facility", {
        name: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        imageFile: {
            type: DataTypes.STRING(20)
        },
        location: {  // New field
            type: DataTypes.STRING(50),
            allowNull: false
        },
        facilityType: {  // New field
            type: DataTypes.STRING(50),
            allowNull: false
        }
    }, {
        tableName: 'facilities'
    });

    Facility.associate = (models) => {
        Facility.belongsTo(models.User, {
            foreignKey: "userId",
            as: 'user'
        });
    };

    return Facility;
}
