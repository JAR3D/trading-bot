import { IGetPairKLine, IGetPairPrice } from '../interfaces';

const getPairPrice = ({ value }: IGetPairPrice): Promise<{ data: any }> => {
  return Promise.resolve({ data: undefined })
}
const getPairKLine = (obj: IGetPairKLine): Promise<{ data: any }> => {
  return Promise.resolve({ data: undefined })
}

export {
  getPairKLine,
  getPairPrice
}

