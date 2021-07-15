import { toast } from 'react-toastify';

const chainErrors: {[key: string]: string} = {
  INVALID_TO: 'Invalid to address',
  PAIR_EXISTS: 'Pool pair already exist',
  ZERO_ADDRESS: 'Zero address  was passed',
  IDENTICAL_ADDRESSES: 'Equal addresses picked',
  INSUFFICIENT_A_AMOUNT: 'Insufficient first token amount',
  INSUFFICIENT_B_AMOUNT: 'Insufficient second token amount',
  INSUFFICIENT_LIQUIDITY: 'Insufficient liquidity',
  INSUFFICIENT_INPUT_AMOUNT: 'Insufficient sell amount',
  INSUFFICIENT_OUTPUT_AMOUNT: 'Insufficient buy amount',
  INSUFFICIENT_LIQUIDITY_MINTED: 'Insufficient liquidity minted',
  INSUFFICIENT_LIQUIDITY_BURNED: 'Insufficient liquidity burned',
};

const errorHandler = (message: string): string => {
  const errorKey = Object
    .keys(chainErrors)
    .find((key) => message.includes(key));

  if (!errorKey) {
    return message;
  }

  return chainErrors[errorKey];
};

export const errorToast = (message: string): void => {
  toast.error(errorHandler(message));
};

export default errorHandler;
