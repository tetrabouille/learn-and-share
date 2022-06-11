import { addAlert } from '@/stores/alert.store';
import { logout } from '@/stores/auth.store';
import { Error } from '@/types/error.type';

const handleError =
  (message: string, key: string, navigate: (r: string) => void) =>
  ({ errors, data }) => {
    if (errors) {
      addAlert(message, 'error');
      console.error(errors);
      return { data, isError: true };
    }

    if (data?.[key]?.userErrors?.length) {
      if (data[key].userErrors.find(({ code }) => code === Error.TOKEN_EXPIRED)) {
        addAlert('Connexion expired', 'error');
        logout();
        navigate('/login');
      } else {
        addAlert(message, 'error');
        console.error(data[key].userErrors);
      }
      return { data, isError: true };
    }

    return { data, isError: false };
  };

export { handleError };
