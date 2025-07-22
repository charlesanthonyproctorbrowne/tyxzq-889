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

export type Interactions200DataItem = {
  id?: number;
  agent_id?: number;
  customer_id?: number;
  length_seconds?: number;
  created_at?: string;
};

export type Interactions200 = {
  data: Interactions200DataItem[];
};

/**
 * Direct API call to fetch customer-agent interaction records
 * Retrieves historical interaction data for analytics and reporting
 */
export const interactions = (
  options?: AxiosRequestConfig
): Promise<AxiosResponse<Interactions200>> => {
  return axios.get(`/interactions`, options);
};

/**
 * Generates a stable query key for interactions data caching
 * Enables efficient cache management for interaction history
 */
export const getInteractionsQueryKey = () => {
  return [`/interactions`] as const;
};

/**
 * Configures React Query options for interactions data fetching
 * Centralizes interaction query configuration for consistent behavior
 */
export const getInteractionsQueryOptions = <
  TData = Awaited<ReturnType<typeof interactions>>,
  TError = AxiosError<unknown>
>(options?: {
  query?: Partial<
    UseQueryOptions<Awaited<ReturnType<typeof interactions>>, TError, TData>
  >;
  axios?: AxiosRequestConfig;
}) => {
  const { query: queryOptions, axios: axiosOptions } = options ?? {};

  const queryKey = queryOptions?.queryKey ?? getInteractionsQueryKey();

  const queryFn: QueryFunction<Awaited<ReturnType<typeof interactions>>> = ({
    signal,
  }) => interactions({ signal, ...axiosOptions });

  return { queryKey, queryFn, ...queryOptions } as UseQueryOptions<
    Awaited<ReturnType<typeof interactions>>,
    TError,
    TData
  > & { queryKey: DataTag<QueryKey, TData, TError> };
};

export type InteractionsQueryResult = NonNullable<
  Awaited<ReturnType<typeof interactions>>
>;
export type InteractionsQueryError = AxiosError<unknown>;

/**
 * React hook for fetching interaction data with automatic caching
 * Provides access to customer-agent interaction history for dashboard analytics
 */
export function useInteractions<
  TData = Awaited<ReturnType<typeof interactions>>,
  TError = AxiosError<unknown>
>(
  options: {
    query: Partial<
      UseQueryOptions<Awaited<ReturnType<typeof interactions>>, TError, TData>
    > &
      Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof interactions>>,
          TError,
          Awaited<ReturnType<typeof interactions>>
        >,
        'initialData'
      >;
    axios?: AxiosRequestConfig;
  },
  queryClient?: QueryClient
): DefinedUseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
};
export function useInteractions<
  TData = Awaited<ReturnType<typeof interactions>>,
  TError = AxiosError<unknown>
>(
  options?: {
    query?: Partial<
      UseQueryOptions<Awaited<ReturnType<typeof interactions>>, TError, TData>
    > &
      Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof interactions>>,
          TError,
          Awaited<ReturnType<typeof interactions>>
        >,
        'initialData'
      >;
    axios?: AxiosRequestConfig;
  },
  queryClient?: QueryClient
): UseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
};
export function useInteractions<
  TData = Awaited<ReturnType<typeof interactions>>,
  TError = AxiosError<unknown>
>(
  options?: {
    query?: Partial<
      UseQueryOptions<Awaited<ReturnType<typeof interactions>>, TError, TData>
    >;
    axios?: AxiosRequestConfig;
  },
  queryClient?: QueryClient
): UseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
};

export function useInteractions<
  TData = Awaited<ReturnType<typeof interactions>>,
  TError = AxiosError<unknown>
>(
  options?: {
    query?: Partial<
      UseQueryOptions<Awaited<ReturnType<typeof interactions>>, TError, TData>
    >;
    axios?: AxiosRequestConfig;
  },
  queryClient?: QueryClient
): UseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
} {
  const queryOptions = getInteractionsQueryOptions(options);

  const query = useQuery(queryOptions, queryClient) as UseQueryResult<
    TData,
    TError
  > & { queryKey: DataTag<QueryKey, TData, TError> };

  query.queryKey = queryOptions.queryKey;

  return query;
}

/**
 * Generates mock interaction data for testing and development
 * Creates realistic interaction records with varying durations and timestamps
 */
export const getInteractionsResponseMock = (
  overrideResponse: Partial<Interactions200> = {}
): Interactions200 => ({
  data: Array.from(
    { length: faker.number.int({ min: 1, max: 10 }) },
    (_, i) => i + 1
  ).map(() => ({
    id: faker.helpers.arrayElement([
      faker.number.int({ min: undefined, max: undefined }),
      undefined,
    ]),
    agent_id: faker.helpers.arrayElement([
      faker.number.int({ min: undefined, max: undefined }),
      undefined,
    ]),
    customer_id: faker.helpers.arrayElement([
      faker.number.int({ min: undefined, max: undefined }),
      undefined,
    ]),
    length_seconds: faker.helpers.arrayElement([
      faker.number.int({ min: undefined, max: undefined }),
      undefined,
    ]),
    created_at: faker.helpers.arrayElement([
      faker.date.past().toISOString().split('T')[0],
      undefined,
    ]),
  })),
  ...overrideResponse,
});

/**
 * Creates MSW mock handler for interactions endpoint
 * Provides controlled interaction data for testing dashboard components
 */
export const getInteractionsMockHandler = (
  overrideResponse?:
    | Interactions200
    | ((
        info: Parameters<Parameters<typeof http.get>[1]>[0]
      ) => Promise<Interactions200> | Interactions200)
) => {
  return http.get('*:3333/interactions', async (info) => {
    return new HttpResponse(
      JSON.stringify(
        overrideResponse !== undefined
          ? typeof overrideResponse === 'function'
            ? await overrideResponse(info)
            : overrideResponse
          : getInteractionsResponseMock()
      ),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  });
};
