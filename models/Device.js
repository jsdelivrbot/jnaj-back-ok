var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var slug = require('slug');
var User = mongoose.model('FudeziUser');
var reply = new mongoose.Schema({
  body: String,
  author:{type:mongoose.Schema.Types.ObjectId, ref: 'FudeziUser'},
  article:{type:mongoose.Schema.Types.ObjectId, ref: 'Message'}},
  {timestamps: true});
var message = new mongoose.Schema({
  slug:{type: String, lowercase: true, unique: true},
  subject:String,
  type:{
    type:String,
    enum:['partner','tech','billing','general','vendor_accts','other'],
    default:'general'},
  body: String,
  comments:[{type: mongoose.Schema.Types.ObjectId, ref: 'Comment'}],
  author:{type: mongoose.Schema.Types.ObjectId, ref: 'FudeziUser'}},
  {timestamps: true});
ArticleSchema.plugin(uniqueValidator, {message: 'is already taken'});
ArticleSchema.pre('validate',function(next){
  if(!this.slug){this.slugify();}
  next();});
ArticleSchema.methods.slugify = function() {
  this.slug = slug(this.title) +
  '-' + (Math.random() * Math.pow(36, 6) | 0).toString(36);};
ArticleSchema.methods.updateFavoriteCount = function() {
  var article = this;
  return User.count({favorites: {$in: [article._id]}})
  .then(function(count){
    article.favoritesCount = count;
    return article.save();});};
ArticleSchema.methods.toJSONFor = function(user){
  return {
    slug: this.slug,
    title: this.title,
    description: this.description,
    body: this.body,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
    tagList: this.tagList,
    favorited: user ? user.isFavorite(this._id) : false,
    favoritesCount: this.favoritesCount,
    author: this.author.toProfileJSONFor(user)};};
module.exports = mongoose.model('FudeziConnectionObj',user);