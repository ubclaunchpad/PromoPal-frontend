import 'firebase/auth';

import firebase from 'firebase/app';

const config = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

class FirebaseService {
  private auth: firebase.auth.Auth;

  constructor() {
    if (!firebase.apps.length) {
      firebase.initializeApp(config);
    } else {
      firebase.app(); // if already initialized, use that one
    }
    this.auth = firebase.auth();
  }

  public getAuth(): firebase.auth.Auth {
    return this.auth;
  }

  // *** Auth API ***
  public async doSignInWithEmailAndPassword(
    email: string,
    password: string,
    staySignedIn: boolean
  ): Promise<firebase.auth.UserCredential> {
    if (staySignedIn) {
      await this.auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);
    } else {
      await this.auth.setPersistence(firebase.auth.Auth.Persistence.SESSION);
    }
    return this.auth.signInWithEmailAndPassword(email, password);
  }

  public doSignOut(): Promise<void> {
    return this.auth.signOut();
  }

  public async doReauthenticateUser(password: string): Promise<firebase.auth.UserCredential> {
    const firebaseUser = this.auth.currentUser;
    // TODO: Redirect to 404 page if a user or user email does not exist
    if (firebaseUser === null) {
      return Promise.reject(new Error('No user is logged in.'));
    }
    if (firebaseUser.email === null) {
      return Promise.reject(new Error('User email does not exist.'));
    }
    const credential = firebase.auth.EmailAuthProvider.credential(firebaseUser.email, password);
    return firebaseUser.reauthenticateWithCredential(credential);
  }

  public async doEmailUpdate(password: string, newEmail: string): Promise<void> {
    return this.doReauthenticateUser(password)
      .then(() => {
        const firebaseUser = this.auth.currentUser;
        if (firebaseUser?.email === newEmail) {
          return;
        }
        return firebaseUser?.updateEmail(newEmail);
      })
      .catch((err: Error) => {
        return Promise.reject(err);
      });
  }

  public async doPasswordUpdate(oldPassword: string, newPassword: string): Promise<void> {
    return this.doReauthenticateUser(oldPassword)
      .then(() => {
        return this.auth.currentUser?.updatePassword(newPassword);
      })
      .catch((err: Error) => {
        return Promise.reject(err);
      });
  }

  public doPasswordReset(email: string): void {
    // TODO: Hide 400 error when an account with the specified email does not exist
    this.auth.sendPasswordResetEmail(email).catch(() => {
      // This catch block is empty because the user should not know if
      // an account with the specified email exists
    });
  }

  public async doDeleteUser(password: string): Promise<void> {
    return this.doReauthenticateUser(password)
      .then(() => {
        return this.auth.currentUser?.delete();
      })
      .catch((err: Error) => {
        return Promise.reject(err);
      });
  }
}

export default new FirebaseService();
