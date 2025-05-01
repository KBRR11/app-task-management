
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { User, AuthResponse } from '../../models/user.model';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private currentUserSubject = new BehaviorSubject<User | null>(null);
    public currentUser$ = this.currentUserSubject.asObservable();
    private tokenKey = 'auth_token';
    private userKey = 'current_user';

    constructor(private http: HttpClient) {
        this.loadStoredUser();
    }

    private loadStoredUser(): void {
        const storedUser = localStorage.getItem(this.userKey);
        if (storedUser) {
            this.currentUserSubject.next(JSON.parse(storedUser));
        }
    }

    public get currentUserValue(): User | null {
        return this.currentUserSubject.value;
    }

    public get token(): string | null {
        return localStorage.getItem(this.tokenKey);
    }

    authenticate(email: string): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${environment.apiUrl}/users/authenticate`, { email })
            .pipe(
                tap(response => this.handleAuthResponse(response)),
                catchError(error => {
                    if (error.status === 404) {
                        // User doesn't exist
                        return throwError(() => ({
                            notFound: true,
                            message: 'Usuario no encontrado.\nTe gustaría crear una nueva cuenta?'
                        }));
                    }
                    return throwError(() => error);
                })
            );
    }

    createUser(email: string): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${environment.apiUrl}/users/find-or-create`, { email })
            .pipe(
                tap(response => this.handleAuthResponse(response))
            );
    }

    private handleAuthResponse(response: AuthResponse): void {
        localStorage.setItem(this.tokenKey, response.token);
        localStorage.setItem(this.userKey, JSON.stringify(response.user));
        this.currentUserSubject.next(response.user);
    }

    logout(): void {
        localStorage.removeItem(this.tokenKey);
        localStorage.removeItem(this.userKey);
        this.currentUserSubject.next(null);
    }

    isLoggedIn(): boolean {
        return !!this.token;
    }
}