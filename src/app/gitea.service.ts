import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
  })
  export class GiteaService {


//   private apiUrl = 'http://localhost:3000/api/v1';
private apiUrl ='http://localhost:3000/api/v1';
  private username = 'poonamgaian';
  private password = '66fb170d73916344855cf3c43be55d799265b762';


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

  getBranchDetails(username: string, repo: string, branch: string): Observable<any> {
    const url = `${this.apiUrl}/repos/${username}/${repo}/branches/${branch}`;
    return this.http.get(url, { headers: this.getHeaders() });
  }

  getBranchFiles(username: string, repo: string, branch: string, path: string = ''): Observable<any> {
    const fullPath = path ? `/${path}` : '';
    const url = `${this.apiUrl}/repos/${username}/${repo}/contents${fullPath}?ref=${branch}`;
    return this.http.get(url, { headers: this.getHeaders() });
  }

  createBranch(username: string, repo: string, newBranchName: string, oldBranchName:string): Observable<any> {
    const url = `${this.apiUrl}/repos/${username}/${repo}/branches`;
    const body = { new_branch_name: newBranchName, old_branch_name: oldBranchName }; 
  
    return this.http.post(url, body, { headers: this.getHeaders() });
  }




  getCommitHistory(username: string, repo: string, sha: string = 'master'): Observable<any> {
    const url = `${this.apiUrl}/repos/${this.username}/${repo}/commits`;
    
    // You can customize the parameters based on your needs
    const params = new HttpParams()
      .set('sha', sha)
      .set('stat', 'true')
      .set('verification', 'true')
      .set('files', 'true');

    return this.http.get(url, { params: params, headers: this.getHeaders() });
  }

  getCommitDetails(username: string, repo: string, sha: string): Observable<any> {
    const url = `${this.apiUrl}/repos/${username}/${repo}/commit/${sha}`;
    return this.http.get(url, { headers: this.getHeaders() });
  }
}