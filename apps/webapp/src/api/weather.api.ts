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

export type Weather200DataItem = {
  location?: string;
  temp?: number;
};

export type Weather200 = {
  data: Weather200DataItem[];
};

/**
 * Direct API call to fetch weather data from multiple locations
 * Separated from React Query logic to maintain pure function boundaries
 */
export const weather = (
  options?: AxiosRequestConfig
): Promise<AxiosResponse<Weather200>> => {
  return axios.get(`/weather`, options);
};

/**
 * Generates a stable query key for weather data caching
 * Ensures consistent cache invalidation across the application
 */
export const getWeatherQueryKey = () => {
  return [`/weather`] as const;
};

/**
 * Configures React Query options for weather data fetching
 * Centralizes query configuration to avoid duplication across components
 */
export const getWeatherQueryOptions = <
  TData = Awaited<ReturnType<typeof weather>>,
  TError = AxiosError<unknown>
>(options?: {
  query?: Partial<
    UseQueryOptions<Awaited<ReturnType<typeof weather>>, TError, TData>
  >;
  axios?: AxiosRequestConfig;
}) => {
  const { query: queryOptions, axios: axiosOptions } = options ?? {};

  const queryKey = queryOptions?.queryKey ?? getWeatherQueryKey();

  const queryFn: QueryFunction<Awaited<ReturnType<typeof weather>>> = ({
    signal,
  }) => weather({ signal, ...axiosOptions });

  return { queryKey, queryFn, ...queryOptions } as UseQueryOptions<
    Awaited<ReturnType<typeof weather>>,
    TError,
    TData
  > & { queryKey: DataTag<QueryKey, TData, TError> };
};

export type WeatherQueryResult = NonNullable<
  Awaited<ReturnType<typeof weather>>
>;
export type WeatherQueryError = AxiosError<unknown>;

/**
 * React hook for fetching weather data with automatic caching and error handling
 * Provides type-safe access to weather API with React Query benefits
 */
export function useWeather<
  TData = Awaited<ReturnType<typeof weather>>,
  TError = AxiosError<unknown>
>(
  options: {
    query: Partial<
      UseQueryOptions<Awaited<ReturnType<typeof weather>>, TError, TData>
    > &
      Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof weather>>,
          TError,
          Awaited<ReturnType<typeof weather>>
        >,
        'initialData'
      >;
    axios?: AxiosRequestConfig;
  },
  queryClient?: QueryClient
): DefinedUseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
};
export function useWeather<
  TData = Awaited<ReturnType<typeof weather>>,
  TError = AxiosError<unknown>
>(
  options?: {
    query?: Partial<
      UseQueryOptions<Awaited<ReturnType<typeof weather>>, TError, TData>
    > &
      Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof weather>>,
          TError,
          Awaited<ReturnType<typeof weather>>
        >,
        'initialData'
      >;
    axios?: AxiosRequestConfig;
  },
  queryClient?: QueryClient
): UseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
};
export function useWeather<
  TData = Awaited<ReturnType<typeof weather>>,
  TError = AxiosError<unknown>
>(
  options?: {
    query?: Partial<
      UseQueryOptions<Awaited<ReturnType<typeof weather>>, TError, TData>
    >;
    axios?: AxiosRequestConfig;
  },
  queryClient?: QueryClient
): UseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
};

export function useWeather<
  TData = Awaited<ReturnType<typeof weather>>,
  TError = AxiosError<unknown>
>(
  options?: {
    query?: Partial<
      UseQueryOptions<Awaited<ReturnType<typeof weather>>, TError, TData>
    >;
    axios?: AxiosRequestConfig;
  },
  queryClient?: QueryClient
): UseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
} {
  const queryOptions = getWeatherQueryOptions(options);

  const query = useQuery(queryOptions, queryClient) as UseQueryResult<
    TData,
    TError
  > & { queryKey: DataTag<QueryKey, TData, TError> };

  query.queryKey = queryOptions.queryKey;

  return query;
}

/**
 * Generates mock weather response data for testing and development
 * Allows override of specific response properties while maintaining type safety
 */
export const getWeatherResponseMock = (
  overrideResponse: Partial<Weather200> = {}
): Weather200 => ({
  data: Array.from(
    { length: faker.number.int({ min: 1, max: 10 }) },
    (_, i) => i + 1
  ).map(() => ({
    location: faker.helpers.arrayElement([faker.string.alpha(20), undefined]),
    temp: faker.helpers.arrayElement([
      faker.number.int({ min: undefined, max: undefined }),
      undefined,
    ]),
  })),
  ...overrideResponse,
});

/**
 * Creates MSW mock handler for weather endpoint
 * Enables consistent API mocking in tests and storybook environments
 */
export const getWeatherMockHandler = (
  overrideResponse?:
    | Weather200
    | ((
        info: Parameters<Parameters<typeof http.get>[1]>[0]
      ) => Promise<Weather200> | Weather200)
) => {
  return http.get('*:3333/weather', async (info) => {
    return new HttpResponse(
      JSON.stringify(
        overrideResponse !== undefined
          ? typeof overrideResponse === 'function'
            ? await overrideResponse(info)
            : overrideResponse
          : getWeatherResponseMock()
      ),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  });
};
