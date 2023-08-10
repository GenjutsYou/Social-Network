module.exports = function(thoughtSchema) {
    thoughtSchema.virtual('reactionCount').get(function() {
      return this.reactions.length;
    });
  };
  