import type { Types } from 'aptos';

export const getTypeArgsFromStructTag = (structTagString: Types.MoveStructTag) => {
  return structTagString.split('<')[1].split('>')[0].split(', ');
};
