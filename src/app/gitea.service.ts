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
  private password = '96659cbb8e0f7ecce6f67c843c9304427dc9af05';
  getBranchDetails: any;


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

  getAllRepos(username:string){
    const url = `${this.apiUrl}/users/${username}/repos`
     return this.http.get(url, { headers: this.getHeaders() });
  }

  getAllFiles(username: string, repo: string, path: string = ''): Observable<any> {
    const fullPath = path ? `/${path}` : '';
    const url = `${this.apiUrl}/repos/${username}/${repo}/contents${fullPath}`;
    return this.http.get(url, { headers: this.getHeaders() });
  }

  getFileContent(username: string, repo: string, path: string = ''): Observable<any> {
    const fullPath = path ? `/${path}` : '';
    const url = `${this.apiUrl}/repos/${username}/${repo}/contents${fullPath}`;
    return this.http.get(url, { headers: this.getHeaders() });
  }


  updateFiles(username: string, repo: string, path: string = '', content: string = '', sha: string): Observable<any> {
    const fullPath = path ? `/${path}` : '';
    const url = `${this.apiUrl}/repos/${username}/${repo}/contents${fullPath}`;
    
    const requestBody = {
      message: 'Update file',
      content: content,
      sha: sha
    };
    return this.http.put(url, requestBody, { headers: this.getHeaders() });
  }
  

  createFile(username: string, repo: string, path: string, content: string): Observable<any> {
    const fullPath = path ? `/${path}` : '';
    const url = `${this.apiUrl}/${username}/${repo}/contents${fullPath}`;

    const requestBody = {
      message: 'Create file',
      content: content,
    };

    return this.http.post(url, requestBody, { headers: this.getHeaders() });
  }
  

  getBranch(owner: string, repo: string): Observable<any> {
    const url = `${this.apiUrl}/repos/${owner}/${repo}/branches`;
    return this.http.get<any>(url);
  }
}