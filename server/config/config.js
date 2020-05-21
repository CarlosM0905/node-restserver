// ================================
// Puerto
// ================================
process.env.PORT = process.env.PORT || 3000;

// ================================
// Entorno
// ================================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// ================================
// Vencimiento del Token
// ================================
process.env.CADUCIDAD_TOKEN = 60*60*24*30;
// ================================
// Seed de autenticacion
// ================================
process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';

let urlDB;

if(process.env.NODE_ENV === 'dev'){
    urlDB = 'mongodb://localhost:27017/cafe'
}
else{
    urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;

// ================================
// Google Client ID
// ================================

process.env.CLIENT_ID = process.env.CLIENT_ID || '885177448612-7es8ao97mif7q75otismmbs5fc58gj1i.apps.googleusercontent.com';