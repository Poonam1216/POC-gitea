import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
  })
  export class GiteaService {
//   private apiUrl = 'http://localhost:3000/api/v1';
private apiUrl ='http://localhost:3000/api/v1';
  private username = 'poonamgaian';
  private password = 'poonamgaian';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Basic ${btoa(`${this.username}:${this.password}`)}`,
    });
  }



  createRepository(repoName: string): Observable<any> {
    const url = `${this.apiUrl}/user/repos`;
    const payload = { name: repoName };
    
    console.log('Request URL:', url);
    console.log('Request Payload:', payload);
  
    return this.http.post(url, payload, { headers: this.getHeaders() });
  }
  
}