import { ReactionType } from "@prisma/client";

export const getIconFromReactionType = (type: ReactionType) => {
  switch(type) {
    case ReactionType.LIKE:
      return '👍';
    case ReactionType.DISLIKE:
      return '👎';
    default:
      return '';
  }
}