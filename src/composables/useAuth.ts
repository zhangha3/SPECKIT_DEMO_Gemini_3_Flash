import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { AuthService } from '@/services/authService';
import type { User } from '@/models/user';

const currentUser = ref<User | null>(AuthService.getCurrentUser());

export function useAuth() {
  const router = useRouter();
  
  const isAuthenticated = computed(() => !!currentUser.value);

  async function login(username: string, password: string) {
    const user = await AuthService.login(username, password);
    if (user) {
      currentUser.value = user;
      return true;
    }
    return false;
  }

  function logout() {
    AuthService.logout();
    currentUser.value = null;
    router.push('/login');
  }

  return {
    currentUser,
    isAuthenticated,
    login,
    logout
  };
}
