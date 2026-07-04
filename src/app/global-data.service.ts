import { Injectable } from '@angular/core';

const STORAGE_KEY = 'currentUser';

@Injectable({
  providedIn: 'root'
})
export class GlobalDataService {
  private userData: any = this.readFromStorage();

  setUser(data: any) {
    this.userData = data;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  getUser() {
    return this.userData;
  }

  clearUser() {
    this.userData = null;
    localStorage.removeItem(STORAGE_KEY);
  }

  isLoggedIn(): boolean {
    return !!this.userData;
  }

  private readFromStorage(): any {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  }
}
