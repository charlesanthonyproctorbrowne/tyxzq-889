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

export type Contacts200DataItem = {
  id?: number;
  name?: string;
};

export type Contacts200 = {
  data: Contacts200DataItem[];
};

/**
 * Direct API call to fetch contact directory
 * Retrieves customer contact information for communication and reference
 */
export const contacts = (
  options?: AxiosRequestConfig
): Promise<AxiosResponse<Contacts200>> => {
  return axios.get(`/contacts`, options);
};

/**
 * Generates a stable query key for contacts data caching
 * Ensures consistent contact list caching across components
 */
export const getContactsQueryKey = () => {
  return [`/contacts`] as const;
};

/**
 * Configures React Query options for contacts data fetching
 * Centralizes contact query configuration for reusable patterns
 */
export const getContactsQueryOptions = <
  TData = Awaited<ReturnType<typeof contacts>>,
  TError = AxiosError<unknown>
>(options?: {
  query?: Partial<
    UseQueryOptions<Awaited<ReturnType<typeof contacts>>, TError, TData>
  >;
  axios?: AxiosRequestConfig;
}) => {
  const { query: queryOptions, axios: axiosOptions } = options ?? {};

  const queryKey = queryOptions?.queryKey ?? getContactsQueryKey();

  const queryFn: QueryFunction<Awaited<ReturnType<typeof contacts>>> = ({
    signal,
  }) => contacts({ signal, ...axiosOptions });

  return { queryKey, queryFn, ...queryOptions } as UseQueryOptions<
    Awaited<ReturnType<typeof contacts>>,
    TError,
    TData
  > & { queryKey: DataTag<QueryKey, TData, TError> };
};

export type ContactsQueryResult = NonNullable<
  Awaited<ReturnType<typeof contacts>>
>;
export type ContactsQueryError = AxiosError<unknown>;

/**
 * React hook for fetching contacts with automatic caching
 * Provides access to customer contact directory for dashboard display
 */
export function useContacts<
  TData = Awaited<ReturnType<typeof contacts>>,
  TError = AxiosError<unknown>
>(
  options: {
    query: Partial<
      UseQueryOptions<Awaited<ReturnType<typeof contacts>>, TError, TData>
    > &
      Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof contacts>>,
          TError,
          Awaited<ReturnType<typeof contacts>>
        >,
        'initialData'
      >;
    axios?: AxiosRequestConfig;
  },
  queryClient?: QueryClient
): DefinedUseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
};
export function useContacts<
  TData = Awaited<ReturnType<typeof contacts>>,
  TError = AxiosError<unknown>
>(
  options?: {
    query?: Partial<
      UseQueryOptions<Awaited<ReturnType<typeof contacts>>, TError, TData>
    > &
      Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof contacts>>,
          TError,
          Awaited<ReturnType<typeof contacts>>
        >,
        'initialData'
      >;
    axios?: AxiosRequestConfig;
  },
  queryClient?: QueryClient
): UseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
};
export function useContacts<
  TData = Awaited<ReturnType<typeof contacts>>,
  TError = AxiosError<unknown>
>(
  options?: {
    query?: Partial<
      UseQueryOptions<Awaited<ReturnType<typeof contacts>>, TError, TData>
    >;
    axios?: AxiosRequestConfig;
  },
  queryClient?: QueryClient
): UseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
};

export function useContacts<
  TData = Awaited<ReturnType<typeof contacts>>,
  TError = AxiosError<unknown>
>(
  options?: {
    query?: Partial<
      UseQueryOptions<Awaited<ReturnType<typeof contacts>>, TError, TData>
    >;
    axios?: AxiosRequestConfig;
  },
  queryClient?: QueryClient
): UseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
} {
  const queryOptions = getContactsQueryOptions(options);

  const query = useQuery(queryOptions, queryClient) as UseQueryResult<
    TData,
    TError
  > & { queryKey: DataTag<QueryKey, TData, TError> };

  query.queryKey = queryOptions.queryKey;

  return query;
}

/**
 * Generates mock contact data for testing and development
 * Creates realistic contact records with names and IDs for UI testing
 */
export const getContactsResponseMock = (
  overrideResponse: Partial<Contacts200> = {}
): Contacts200 => ({
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
 * Creates MSW mock handler for contacts endpoint
 * Enables consistent contact data mocking for component testing
 */
export const getContactsMockHandler = (
  overrideResponse?:
    | Contacts200
    | ((
        info: Parameters<Parameters<typeof http.get>[1]>[0]
      ) => Promise<Contacts200> | Contacts200)
) => {
  return http.get('*:3333/contacts', async (info) => {
    return new HttpResponse(
      JSON.stringify(
        overrideResponse !== undefined
          ? typeof overrideResponse === 'function'
            ? await overrideResponse(info)
            : overrideResponse
          : getContactsResponseMock()
      ),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  });
};
