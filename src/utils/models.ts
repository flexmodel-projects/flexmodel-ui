import {BasicFieldTypes} from "~/types";

export const displayFieldType = (field: any) => {
  const type: string = field.type;
  if (type.startsWith('relation')) {
    return field.targetEntity;
  } else if (type === 'id') {
    return 'ID';
  } else {
    return BasicFieldTypes.filter((f: any) => f.name === type)[0]?.label;
  }
}
