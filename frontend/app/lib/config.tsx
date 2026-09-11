export function getApiUrl(): string {
  if (typeof window !== "undefined") {
    return `${window.location.protocol}//${window.location.hostname}:4080`;
  }
  return "http://localhost:4080"; // fallback during server-side render/build
}