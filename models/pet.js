"use strict";

const mongoose = require('mongoose'),
        Schema = mongoose.Schema;

const mongoosePaginate = require('mongoose-paginate');

mongoosePaginate.paginate.options = {
  limit: 3 // how many records on each page
};

const PetSchema = new Schema({
    name            : { type: String, required: true }
  , birthday        : { type: String, required: true }
  , species         : { type: String, required: true }
  , picUrl          : { type: String }
  , picUrlSq        : { type: String }
  , avatarUrl       : { type: String, required: true } 
  , favoriteFood    : { type: String, required: true } 
  , description     : { type: String, minlength: 140, required: true } 
  , price           : { type: Number, required: true }
}, 
{
  timestamps: true
});

// Without weigths  
// PetSchema.index({ name: 'text', species: 'text', favoriteFood: 'text', description: 'text' });
// With weigths 
// PetSchema.index({ name: 'text', species: 'text', favoriteFood: 'text', description: 'text' }, { name: 'My text index', weigths: { name: 1, species: 1, favoriteFood: 1, description: 1}});

PetSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('Pet', PetSchema);