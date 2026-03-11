import { Platform } from "react-native";
import Constants from "expo-constants";

const fallbackHost =
  Platform.OS === "android" ? "http://10.0.2.2:4000/graphql" : "http://localhost:4000/graphql";
const normalizeGraphqlUrl = (value: unknown) => {
  if (typeof value !== "string") return undefined;
  const normalized = value.trim();
  return normalized.length ? normalized : undefined;
};
const extraGraphqlUrl = normalizeGraphqlUrl(Constants.expoConfig?.extra?.graphqlUrl);
const manifestExtraGraphqlUrl = normalizeGraphqlUrl(Constants.manifest2?.extra?.graphqlUrl);
const envGraphqlUrl = normalizeGraphqlUrl(process.env.EXPO_PUBLIC_GRAPHQL_URL) || normalizeGraphqlUrl(process.env.GRAPHQL_URL);

export const GRAPHQL_URL = envGraphqlUrl || extraGraphqlUrl || manifestExtraGraphqlUrl || fallbackHost;
