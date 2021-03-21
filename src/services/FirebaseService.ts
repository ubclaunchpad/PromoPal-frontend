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

class Firebase {
  auth: firebase.auth.Auth;

  constructor() {
    if (!firebase.apps.length) {
      firebase.initializeApp(config);
    } else {
      firebase.app(); // if already initialized, use that one
    }
    this.auth = firebase.auth();
  }

  // *** Auth API ***
  // Creates a user and signs the user in
  doCreateUserWithEmailAndPassword = (email: string, password: string) => {
    return this.auth.createUserWithEmailAndPassword(email, password);
  };

  doSignInWithEmailAndPassword = (email: string, password: string, staySignedIn: boolean) => {
    if (staySignedIn) {
      this.auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);
    } else {
      this.auth.setPersistence(firebase.auth.Auth.Persistence.SESSION);
    }
    return this.auth.signInWithEmailAndPassword(email, password);
  };

  doSignOut = () => this.auth.signOut();

  doPasswordReset = (email: string) => {
    // TODO: Hide 400 error when an account with the specified email does not exist
    this.auth.sendPasswordResetEmail(email).catch(() => {
      // This catch block is empty because the user should not know if
      // an account with the specified email exists
    });
  };

  doReauthenticateUser = (password: string) => {
    const authUser = this.auth.currentUser;
    // TODO: Redirect to 404 page if a user or user email does not exist
    if (authUser === null) {
      return Promise.reject(new Error('No user is logged in.'));
    }
    if (authUser.email === null) {
      return Promise.reject(new Error('User email does not exist.'));
    }
    const credential = firebase.auth.EmailAuthProvider.credential(authUser.email, password);
    return authUser.reauthenticateWithCredential(credential);
  };

  doPasswordUpdate = (oldPassword: string, newPassword: string) => {
    return this.doReauthenticateUser(oldPassword)
      ?.then(() => {
        return this.auth.currentUser?.updatePassword(newPassword);
      })
      .catch((err: Error) => {
        return Promise.reject(err);
      });
  };
}

export default Firebase;
