const mongoose = require('mongoose');
const projectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    project_name: {

        type: String,
        required: true
    },

    domain: {

        type: String, 
        required: true
    },
    description:{
type:String
    },
    files: [Object]

});
projectSchema.index({name: 'text', description: 'text'});
module.exports = mongoose.model('Project', projectSchema);
