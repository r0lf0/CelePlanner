const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');
const Event = require('./event'); 

const Technician = sequelize.define('Technician', {
    first_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    last_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    display_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    tableName: 'technicians',
    timestamps: true,
});

Technician.associate = (models) => {
    Technician.belongsToMany(models.Event, { through: 'SetupStagehands', as: 'setup_stagehands' });
    Technician.belongsToMany(models.Event, { through: 'SetupElectricians', as: 'setup_electricians' });
    Technician.belongsToMany(models.Event, { through: 'SetupSoundEngineers', as: 'setup_sound_engineers' });
    Technician.belongsToMany(models.Event, { through: 'EventStageManager', as: 'event_stage_manager' });
    Technician.belongsToMany(models.Event, { through: 'TeardownStagehands', as: 'teardown_stagehands' });
    Technician.belongsToMany(models.Event, { through: 'TeardownElectricians', as: 'teardown_electricians' });
    Technician.belongsToMany(models.Event, { through: 'TeardownSoundEngineers', as: 'teardown_sound_engineers' });
};

module.exports = Technician;