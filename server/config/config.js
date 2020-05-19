// ================================
// Puerto
// ================================
process.env.PORT = process.env.PORT || 3000;

// ================================
// Entorno
// ================================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// ================================
// Entorno
// ================================

let urlDB;

if(process.env.NODE_ENV === 'dev'){
    urlDB = 'mongodb://localhost:27017/cafe'
}
else{
    urlDB = 'mongodb+srv://carlox98:pK2ng0CdMP4I1Gte@cluster0-yzlox.mongodb.net/cafe'
}

process.env.URLDB = urlDB;