const SIGNER_POINTER = 'signer-pointer';

export const saveSignerPointer = (index: number): void => {
  localStorage.setItem(SIGNER_POINTER, `${index}`);
};

export const getSignerPointer = (): number => {
  const item = localStorage.getItem(SIGNER_POINTER);
  return item ? parseInt(item, 10) : 0;
};
