import { useQuery } from '@tanstack/react-query';
import type {
  DataTag,
  DefinedInitialDataOptions,
  DefinedUseQueryResult,
  QueryClient,
  QueryFunction,
  QueryKey,
  UndefinedInitialDataOptions,
  UseQueryOptions,
  UseQueryResult,
} from '@tanstack/react-query';
import axios from 'axios';
import type { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { faker } from '@faker-js/faker';
import { HttpResponse, http } from 'msw';

export type Time200 = {
  current_time: string;
};

/**
 * Direct API call to fetch current server time
 * Provides server time synchronization without React dependencies
 */
export const time = (
  options?: AxiosRequestConfig
): Promise<AxiosResponse<Time200>> => {
  return axios.get(`/time`, options);
};

/**
 * Generates a stable query key for time data caching
 * Typically used for debugging or synchronization purposes
 */
export const getTimeQueryKey = () => {
  return [`/time`] as const;
};

/**
 * Configures React Query options for time data fetching
 * Enables custom caching strategies for time-sensitive data
 */
export const getTimeQueryOptions = <
  TData = Awaited<ReturnType<typeof time>>,
  TError = AxiosError<unknown>
>(options?: {
  query?: Partial<
    UseQueryOptions<Awaited<ReturnType<typeof time>>, TError, TData>
  >;
  axios?: AxiosRequestConfig;
}) => {
  const { query: queryOptions, axios: axiosOptions } = options ?? {};

  const queryKey = queryOptions?.queryKey ?? getTimeQueryKey();

  const queryFn: QueryFunction<Awaited<ReturnType<typeof time>>> = ({
    signal,
  }) => time({ signal, ...axiosOptions });

  return { queryKey, queryFn, ...queryOptions } as UseQueryOptions<
    Awaited<ReturnType<typeof time>>,
    TError,
    TData
  > & { queryKey: DataTag<QueryKey, TData, TError> };
};

export type TimeQueryResult = NonNullable<Awaited<ReturnType<typeof time>>>;
export type TimeQueryError = AxiosError<unknown>;

/**
 * React hook for fetching server time with automatic caching
 * Useful for time synchronization and debugging timestamp issues
 */
export function useTime<
  TData = Awaited<ReturnType<typeof time>>,
  TError = AxiosError<unknown>
>(
  options: {
    query: Partial<
      UseQueryOptions<Awaited<ReturnType<typeof time>>, TError, TData>
    > &
      Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof time>>,
          TError,
          Awaited<ReturnType<typeof time>>
        >,
        'initialData'
      >;
    axios?: AxiosRequestConfig;
  },
  queryClient?: QueryClient
): DefinedUseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
};
export function useTime<
  TData = Awaited<ReturnType<typeof time>>,
  TError = AxiosError<unknown>
>(
  options?: {
    query?: Partial<
      UseQueryOptions<Awaited<ReturnType<typeof time>>, TError, TData>
    > &
      Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof time>>,
          TError,
          Awaited<ReturnType<typeof time>>
        >,
        'initialData'
      >;
    axios?: AxiosRequestConfig;
  },
  queryClient?: QueryClient
): UseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
};
export function useTime<
  TData = Awaited<ReturnType<typeof time>>,
  TError = AxiosError<unknown>
>(
  options?: {
    query?: Partial<
      UseQueryOptions<Awaited<ReturnType<typeof time>>, TError, TData>
    >;
    axios?: AxiosRequestConfig;
  },
  queryClient?: QueryClient
): UseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
};

export function useTime<
  TData = Awaited<ReturnType<typeof time>>,
  TError = AxiosError<unknown>
>(
  options?: {
    query?: Partial<
      UseQueryOptions<Awaited<ReturnType<typeof time>>, TError, TData>
    >;
    axios?: AxiosRequestConfig;
  },
  queryClient?: QueryClient
): UseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
} {
  const queryOptions = getTimeQueryOptions(options);

  const query = useQuery(queryOptions, queryClient) as UseQueryResult<
    TData,
    TError
  > & { queryKey: DataTag<QueryKey, TData, TError> };

  query.queryKey = queryOptions.queryKey;

  return query;
}

/**
 * Generates mock time response for testing and development
 * Provides predictable time values for consistent test scenarios
 */
export const getTimeResponseMock = (
  overrideResponse: Partial<Time200> = {}
): Time200 => ({ current_time: faker.string.alpha(20), ...overrideResponse });

/**
 * Creates MSW mock handler for time endpoint
 * Enables controlled time responses in testing environments
 */
export const getTimeMockHandler = (
  overrideResponse?:
    | Time200
    | ((
        info: Parameters<Parameters<typeof http.get>[1]>[0]
      ) => Promise<Time200> | Time200)
) => {
  return http.get('*:3333/time', async (info) => {
    return new HttpResponse(
      JSON.stringify(
        overrideResponse !== undefined
          ? typeof overrideResponse === 'function'
            ? await overrideResponse(info)
            : overrideResponse
          : getTimeResponseMock()
      ),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  });
};
