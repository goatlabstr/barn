import { useState, useEffect, useCallback } from "react";
import { AxiosResponse } from "axios";

type useApiReturnData = {
  data: any;
  loading: boolean;
  hasError: boolean;
  error: {} | null;
};

type useApiReturnType = [useApiReturnData, () => void];

const useApi = (
  func: (...params: any[]) => Promise<AxiosResponse>,
  ...params: any[]
) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<any | null>(null);
  const [hasError, setHasError] = useState<boolean>(false);
  const returnDataObject: useApiReturnData = {
    data,
    loading,
    hasError,
    error,
  };

  function init() {
    setLoading(true);
    setHasError(false);
    setError(null);
    setData(null);
  }

  //Somehow it errors when used instead callApi()
  const memoizedCallApi = useCallback(async () => {
    init();
    try {
      const result = await func(...params);
      setData(result.data);
    } catch (e) {
      setHasError(true);
      setError(e);
    }
    setLoading(false);
  }, [func, params]);

  async function callApi() {
    init();
    try {
      const result = await func(...params);
      setData(result.data);
    } catch (e) {
      setHasError(true);
      setError(e);
    }
    setLoading(false);
  }

  useEffect(() => {
    callApi();
  }, []);

  const returnTuple: useApiReturnType = [returnDataObject, callApi];
  return returnTuple;
};

export default useApi;
