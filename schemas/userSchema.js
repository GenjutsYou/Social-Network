module.exports = function(userSchema) {
  userSchema.virtual('friendCount').get(function() {
    return this.friends.length;
  });
};
