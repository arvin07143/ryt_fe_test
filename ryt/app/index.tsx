import { Redirect } from 'expo-router';
import { useAuthentication } from '../hooks/useAuthentication';

export default function Index() {
  const { isAuthenticated } = useAuthentication();

  // Redirect based on authentication state
  if (isAuthenticated) {
    return <Redirect href="/transactions" />;
  }

  return <Redirect href="/login" />;
}
