import React, { useEffect, useRef, useState } from 'react';

import { useHistory, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ReefswapPool } from '../../api/rpc/pools';
import { getReefswapRouter } from '../../api/rpc/rpc';
import { approveAmount } from '../../api/rpc/tokens';
import { ButtonStatus } from '../../components/buttons/Button';
import Card, { CardBack, CardHeader, CardTitle } from '../../components/card/Card';
import { CardSettings } from '../../components/card/CardSettings';
import { DownIcon, PlusIcon } from '../../components/card/Icons';
import { ConfirmLabel } from '../../components/label/Labels';
import { LoadingButtonIconWithText } from '../../components/loading/Loading';
import ConfirmationModal from '../../components/modal/ConfirmationModal';
import { useFindOrLoadToken } from '../../hooks/useFindOrLoadToken';
import { useLoadPool } from '../../hooks/useLoadPool';
import { useAppSelector } from '../../store/hooks';
import { defaultSettings, resolveSettings } from '../../store/internalStore';
import errorHandler, { errorToast } from '../../utils/errorHandler';
import {
  calculatePoolRatio, calculatePoolShare, removeUserPoolSupply, removePoolTokenShare, removeSupply, transformAmount, calculateDeadline,
} from '../../utils/math';
import { POOL_URL } from '../../utils/urls';
import { errorStatus } from '../../utils/utils';

interface UrlParams {
  address1: string;
  address2: string;
}

const nameCorrector = (name: string): string => (name === 'Select token' ? '-' : name);

const status = (percentageAmount: number, pool?: ReefswapPool): ButtonStatus => {
  if (!pool) {
    return errorStatus('Invalid Pair');
  } if (pool.userPoolBalance === '0') {
    return errorStatus('Insufficient pool balance');
  } if (percentageAmount === 0) {
    return errorStatus('Enter an amount');
  }

  return { isValid: true, text: 'Confirm remove' };
};

const REMOVE_DEFAULT_SLIPPAGE_TOLERANCE = 5;

const RemoveLiquidity = (): JSX.Element => {
  const history = useHistory();
  const { address1, address2 } = useParams<UrlParams>();
  const networkSettings = useAppSelector((state) => state.settings);
  const { accounts, selectedAccount } = useAppSelector((state) => state.accounts);

  const mounted = useRef(true);
  const [isRemoving, setIsRemoving] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState('');
  const [settings, setSettings] = useState(defaultSettings());
  const [percentageAmount, setPercentageAmount] = useState(0);

  const [token1, isToken1Loading] = useFindOrLoadToken(address1);
  const [token2, isToken2Loading] = useFindOrLoadToken(address2);
  const { pool, isPoolLoading } = useLoadPool(token1, token2);

  const isLoading = isRemoving
  || isToken1Loading
  || isToken2Loading
  || isPoolLoading;

  const { isValid, text } = status(percentageAmount, pool);
  const { percentage, deadline } = resolveSettings(settings, REMOVE_DEFAULT_SLIPPAGE_TOLERANCE);

  const back = (): void => history.push(POOL_URL);

  useEffect(() => () => {
    mounted.current = false;
  }, []);

  const ensureMount = <T, > (fun: (obj: T) => void, obj: T): void => {
    mounted.current && fun(obj);
  };

  const onRemove = async (): Promise<void> => {
    if (!pool || percentageAmount === 0 || selectedAccount === -1) { return; }
    const { signer, evmAddress } = accounts[selectedAccount];

    const reefswapRouter = getReefswapRouter(networkSettings, signer);
    const normalRemovedSupply = removeSupply(percentageAmount, pool.userPoolBalance, 18);
    const removedLiquidity = transformAmount(18, `${normalRemovedSupply}`);

    const minimumTokenAmount1 = removePoolTokenShare(Math.max(percentageAmount - percentage, 0), pool.token1);
    const minimumTokenAmount2 = removePoolTokenShare(Math.max(percentageAmount - percentage, 0), pool.token2);

    Promise.resolve()
      .then(() => { mounted.current = true; })
      .then(() => setIsRemoving(true))
      .then(() => setLoadingStatus('Approving remove'))
      .then(() => approveAmount(pool.poolAddress, networkSettings.routerAddress, removedLiquidity, signer))
      .then(() => setLoadingStatus('Removing supply'))
      .then(() => reefswapRouter.removeLiquidity(
        pool.token1.address,
        pool.token2.address,
        removedLiquidity,
        transformAmount(token1.decimals, `${minimumTokenAmount1}`),
        transformAmount(token2.decimals, `${minimumTokenAmount2}`),
        evmAddress,
        calculateDeadline(deadline),
      ))
      .then(() => toast.success('Liquidity successfully removed'))
      .then(() => mounted.current && back())
      .catch((e) => {
        errorToast(errorHandler(e.message));
      })
      .finally(() => {
        ensureMount(setIsRemoving, false);
        ensureMount(setLoadingStatus, '');
      });
  };

  return (
    <Card>
      <CardHeader>
        <CardBack onBack={back} />
        <CardTitle title="Remove Liquidity" />
        <CardSettings settings={settings} setSettings={setSettings} defaultSlippageTolerance={REMOVE_DEFAULT_SLIPPAGE_TOLERANCE} />
      </CardHeader>
      <div className="alert alert-danger mt-2 border-rad user-select-none" role="alert">
        <b>Tip: </b>
        Removing pool tokens converts your position back into underlying tokens at the current rate, proportional to your share of the pool. Accrued fees are included in the amounts you receive.
      </div>
      <div className="field border-rad p-3">
        <span>Remove Amount</span>
        <h1 className="display-3 user-select-none">
          {percentageAmount}
          {' '}
          %
        </h1>
        <input
          min={0}
          max={100}
          type="range"
          className="form-range"
          value={percentageAmount}
          disabled={!pool}
          onChange={(event) => setPercentageAmount(parseInt(event.target.value, 10))}
        />
        <div className="d-flex justify-content-between mx-3 mt-2">
          <button type="button" className="btn btn-reef border-rad" onClick={() => setPercentageAmount(25)}>25%</button>
          <button type="button" className="btn btn-reef border-rad" onClick={() => setPercentageAmount(50)}>50%</button>
          <button type="button" className="btn btn-reef border-rad" onClick={() => setPercentageAmount(75)}>75%</button>
          <button type="button" className="btn btn-reef border-rad" onClick={() => setPercentageAmount(100)}>Max</button>
        </div>
      </div>
      <div className="d-flex justify-content-center my-2">
        <DownIcon />
      </div>
      <div className="field border-rad p-3">
        <ConfirmLabel title={removePoolTokenShare(percentageAmount, pool?.token1).toFixed(8)} value={nameCorrector(token1.name)} titleSize="title-text" valueSize="title-text" />
        <ConfirmLabel title={removePoolTokenShare(percentageAmount, pool?.token2).toFixed(8)} value={nameCorrector(token2.name)} titleSize="title-text" valueSize="title-text" />
      </div>
      <div className="my-3 mx-4">
        <ConfirmLabel title="Price" value={`1 ${nameCorrector(token1.name)} = ${calculatePoolRatio(pool).toFixed(8)} ${nameCorrector(token2.name)}`} />
        <ConfirmLabel title="" value={`1 ${nameCorrector(token2.name)} = ${calculatePoolRatio(pool, false).toFixed(8)} ${nameCorrector(token1.name)}`} />
      </div>

      <button
        type="button"
        className="btn btn-lg btn-reef border-rad w-100 mt-2"
        disabled={!isValid || isLoading}
        data-bs-toggle="modal"
        data-bs-target="#removeModalToggle"
      >
        {isLoading ? <LoadingButtonIconWithText text={loadingStatus} /> : text}
      </button>

      <ConfirmationModal id="removeModalToggle" title="Remove liquidity" confirmFun={onRemove}>
        <div className="mx-2">
          <label className="text-muted">You will recieve</label>
          <div className="field border-rad p-3">
            <ConfirmLabel
              titleSize="h4"
              valueSize="h6"
              title={removePoolTokenShare(percentageAmount, pool?.token1).toFixed(8)}
              value={nameCorrector(token1.name)}
            />
            <PlusIcon />
            <ConfirmLabel
              titleSize="h4"
              valueSize="h6"
              title={removePoolTokenShare(percentageAmount, pool?.token2).toFixed(8)}
              value={nameCorrector(token2.name)}
            />
          </div>

          <label className="text-muted mt-3">Burned tokens</label>
          <div className="field border-rad p-3">
            <ConfirmLabel
              titleSize="h4"
              valueSize="h6"
              title={removeUserPoolSupply(percentageAmount, pool).toFixed(8)}
              value={`${nameCorrector(token1.name)}/${nameCorrector(token2.name)}`}
            />
          </div>
          <div className="m-3">
            <span className="mini-text text-muted d-inline-block">
              Output is estimated. If the price changes by more than
              {' '}
              {percentage}
              % your transaction will revert.
            </span>
          </div>

          <div className="field border-rad p-3">
            <ConfirmLabel title="Liquidity Provider Fee" value="1.5 REEF" titleSize="mini-text" valueSize="mini-text" />
            <ConfirmLabel title="Rates" value={`1 ${nameCorrector(token1.name)} = ${calculatePoolRatio(pool).toFixed(8)} ${nameCorrector(token2.name)}`} titleSize="mini-text" valueSize="mini-text" />
            <ConfirmLabel title="" value={`1 ${nameCorrector(token2.name)} = ${calculatePoolRatio(pool, false).toFixed(8)} ${nameCorrector(token1.name)}`} titleSize="mini-text" valueSize="mini-text" />
            <ConfirmLabel title="Share of Pool" value={`${calculatePoolShare(pool).toFixed(8)} %`} titleSize="mini-text" valueSize="mini-text" />
          </div>

        </div>
      </ConfirmationModal>
    </Card>
  );
};

export default RemoveLiquidity;
