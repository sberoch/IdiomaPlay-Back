const normalizeDirection = {
  asc: 'ASC',
  desc: 'DESC',
};

export const getOrder = (orderStr: string) => {
  const [key, direction] = orderStr.split(':');
  return { [key]: normalizeDirection[direction] };
};
