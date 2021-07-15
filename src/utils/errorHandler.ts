const chainErrors: {[key: string]: string} = {
  "INVALID_TO": "Invalid to address",
  "PAIR_EXISTS": "Pool pair already exist",
  "ZERO_ADDRESS": "Zero address  was passed",
  "IDENTICAL_ADDRESSES": "Equal addresses picked",
  "INSUFFICIENT_A_AMOUNT": "Insufficient first token amount",
  "INSUFFICIENT_B_AMOUNT": "Insufficient first token amount",
  "INSUFFICIENT_LIQUIDITY": "Insufficient liquidity",
  "INSUFFICIENT_INPUT_AMOUNT": "Insufficient input amount",
  "INSUFFICIENT_OUTPUT_AMOUNT": "Insufficient output amount",
  "INSUFFICIENT_LIQUIDITY_MINTED": "Insufficient liquidity minted",
  "INSUFFICIENT_LIQUIDITY_BURNED": "Insufficient liquidity burned",
}

const errorHandler = (error: any): string => {
  if (error.message) {
    return error.message;
  }
  const message: string = error;

  const errorKey = Object
    .keys(chainErrors)
    .find((errorKey) => message.includes(errorKey));
  
  if (!errorKey) {
    return message;
  }

  return chainErrors[errorKey];
}
export default errorHandler;