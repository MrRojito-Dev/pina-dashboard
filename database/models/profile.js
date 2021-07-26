let mongoose = require("mongoose"),
schema = new mongoose.Schema({
    /* Discord data */
    user_name: { type: String },
    user_discriminator: { type: String },
    user_avatarURL: { type: String },
    user_id: { type: String },
    user_createdAt: { type: Date },

    /* Perfil */
    user_description: { type: String },
    user_badges: { type: Array },
    user_level: { type: Number },
    user_xp: { type: Number },
    user_logros: { type: Array },
    user_logros_pendientes: { type: Array },
    user_friends: { type: Array },
    user_date: { type: Date },
    
    /* Economía */
    user_bank: { type: String },
    user_money: { type: Object }, // Dinero y frutas
    user_items: { type: Array }, // Items comunes y Gadgets
    user_activeGadgets: { type: Array },
    user_frutas: { type: Array }, // Frutas descubiertas, desbloqueadas o encontradas
    user_totalGifts: { type: Number }
});

module.exports = mongoose.model('Perfiles', schema);