import Firebase from '../services/FirebaseService';
import { RegistrationData } from '../types/user';

class RegistrationService {
  register(firebase: Firebase, data: RegistrationData) {
    return firebase
      .doCreateUserWithEmailAndPassword(data.email, data.password)
      .then(() => {
        // TODO: Register user in backend
        // https://promopal.atlassian.net/browse/PP-36
        // https://promopal.atlassian.net/browse/PP-38
      })
      .catch((error: Error) => {
        return Promise.reject(error);
      });
  }
}

export default new RegistrationService();
