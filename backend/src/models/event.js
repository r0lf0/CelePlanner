const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');
const Technician = require('./technician'); 

const Event = sequelize.define('Event', {
    title: {
        type: DataTypes.STRING,
        allowNull: false, 
    },
    date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    google_calendar_id: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    event_time: {
        type: DataTypes.TIME,
    },
    setup_required_porters: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    setup_required_stagehands: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    setup_required_electricians: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    setup_required_sound_engineers: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    setup_arrival_time_porters: {
        type: DataTypes.TIME,
    },
    setup_arrival_time_technicians: {
        type: DataTypes.TIME,
    },
    teardown_required_porters: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    teardown_required_stagehands: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    teardown_required_electricians: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    teardown_required_sound_engineers: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    notes: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
}, {
    tableName: 'events',
    timestamps: true,
});

Event.associate = (models) => {
    Event.belongsToMany(models.Technician, { through: 'SetupStagehands', as: 'setup_stagehands' });
    Event.belongsToMany(models.Technician, { through: 'SetupElectricians', as: 'setup_electricians' });
    Event.belongsToMany(models.Technician, { through: 'SetupSoundEngineers', as: 'setup_sound_engineers' });
    Event.belongsToMany(models.Technician, { through: 'EventStageManager', as: 'event_stage_manager' });
    Event.belongsToMany(models.Technician, { through: 'TeardownStagehands', as: 'teardown_stagehands' });
    Event.belongsToMany(models.Technician, { through: 'TeardownElectricians', as: 'teardown_electricians' });
    Event.belongsToMany(models.Technician, { through: 'TeardownSoundEngineers', as: 'teardown_sound_engineers' });
};

module.exports = Event;
