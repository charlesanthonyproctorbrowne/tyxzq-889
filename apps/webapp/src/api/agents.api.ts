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

export type Agents200DataItem = {
  id?: number;
  name?: string;
};

export type Agents200 = {
  data: Agents200DataItem[];
};

/**
 * Direct API call to fetch agent directory
 * Retrieves team member information for assignment and performance tracking
 */
export const agents = (
  options?: AxiosRequestConfig
): Promise<AxiosResponse<Agents200>> => {
  return axios.get(`/agents`, options);
};

/**
 * Generates a stable query key for agents data caching
 * Ensures consistent agent list caching across management components
 */
export const getAgentsQueryKey = () => {
  return [`/agents`] as const;
};

/**
 * Configures React Query options for agents data fetching
 * Centralizes agent query configuration for team management features
 */
export const getAgentsQueryOptions = <
  TData = Awaited<ReturnType<typeof agents>>,
  TError = AxiosError<unknown>
>(options?: {
  query?: Partial<
    UseQueryOptions<Awaited<ReturnType<typeof agents>>, TError, TData>
  >;
  axios?: AxiosRequestConfig;
}) => {
  const { query: queryOptions, axios: axiosOptions } = options ?? {};

  const queryKey = queryOptions?.queryKey ?? getAgentsQueryKey();

  const queryFn: QueryFunction<Awaited<ReturnType<typeof agents>>> = ({
    signal,
  }) => agents({ signal, ...axiosOptions });

  return { queryKey, queryFn, ...queryOptions } as UseQueryOptions<
    Awaited<ReturnType<typeof agents>>,
    TError,
    TData
  > & { queryKey: DataTag<QueryKey, TData, TError> };
};

export type AgentsQueryResult = NonNullable<Awaited<ReturnType<typeof agents>>>;
export type AgentsQueryError = AxiosError<unknown>;

/**
 * React hook for fetching agents with automatic caching
 * Provides access to team member directory for assignment and performance tracking
 */
export function useAgents<
  TData = Awaited<ReturnType<typeof agents>>,
  TError = AxiosError<unknown>
>(
  options: {
    query: Partial<
      UseQueryOptions<Awaited<ReturnType<typeof agents>>, TError, TData>
    > &
      Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof agents>>,
          TError,
          Awaited<ReturnType<typeof agents>>
        >,
        'initialData'
      >;
    axios?: AxiosRequestConfig;
  },
  queryClient?: QueryClient
): DefinedUseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
};
export function useAgents<
  TData = Awaited<ReturnType<typeof agents>>,
  TError = AxiosError<unknown>
>(
  options?: {
    query?: Partial<
      UseQueryOptions<Awaited<ReturnType<typeof agents>>, TError, TData>
    > &
      Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof agents>>,
          TError,
          Awaited<ReturnType<typeof agents>>
        >,
        'initialData'
      >;
    axios?: AxiosRequestConfig;
  },
  queryClient?: QueryClient
): UseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
};
export function useAgents<
  TData = Awaited<ReturnType<typeof agents>>,
  TError = AxiosError<unknown>
>(
  options?: {
    query?: Partial<
      UseQueryOptions<Awaited<ReturnType<typeof agents>>, TError, TData>
    >;
    axios?: AxiosRequestConfig;
  },
  queryClient?: QueryClient
): UseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
};

export function useAgents<
  TData = Awaited<ReturnType<typeof agents>>,
  TError = AxiosError<unknown>
>(
  options?: {
    query?: Partial<
      UseQueryOptions<Awaited<ReturnType<typeof agents>>, TError, TData>
    >;
    axios?: AxiosRequestConfig;
  },
  queryClient?: QueryClient
): UseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
} {
  const queryOptions = getAgentsQueryOptions(options);

  const query = useQuery(queryOptions, queryClient) as UseQueryResult<
    TData,
    TError
  > & { queryKey: DataTag<QueryKey, TData, TError> };

  query.queryKey = queryOptions.queryKey;

  return query;
}

/**
 * Generates mock agent data for testing and development
 * Creates realistic agent records with names and IDs for team management testing
 */
export const getAgentsResponseMock = (
  overrideResponse: Partial<Agents200> = {}
): Agents200 => ({
  data: Array.from(
    { length: faker.number.int({ min: 1, max: 10 }) },
    (_, i) => i + 1
  ).map(() => ({
    id: faker.helpers.arrayElement([
      faker.number.int({ min: undefined, max: undefined }),
      undefined,
    ]),
    name: faker.helpers.arrayElement([faker.string.alpha(20), undefined]),
  })),
  ...overrideResponse,
});

/**
 * Creates MSW mock handler for agents endpoint
 * Enables consistent agent data mocking for management component testing
 */
export const getAgentsMockHandler = (
  overrideResponse?:
    | Agents200
    | ((
        info: Parameters<Parameters<typeof http.get>[1]>[0]
      ) => Promise<Agents200> | Agents200)
) => {
  return http.get('*:3333/agents', async (info) => {
    return new HttpResponse(
      JSON.stringify(
        overrideResponse !== undefined
          ? typeof overrideResponse === 'function'
            ? await overrideResponse(info)
            : overrideResponse
          : getAgentsResponseMock()
      ),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  });
};
