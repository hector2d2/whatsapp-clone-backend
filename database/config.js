const moongose = require('mongoose');

const dbConeection = async() => {
    try {
        await moongose.connect(process.env.DB_CNN,{
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        });
        console.log('Db online');
    } catch (err) {
        console.log(err);
        throw new Error('Error in the database, talk with the admin')
    }
}

module.exports = {
    dbConeection
}