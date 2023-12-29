import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { forkJoin, map, Observable,switchMap } from 'rxjs';

@Injectable({
    providedIn: 'root'
  })
  export class GiteaService {


//   private apiUrl = 'http://localhost:3000/api/v1';
private apiUrl ='http://localhost:3000/api/v1';
 
  // private username= 'PoonamRani';
  // private password= '172eb9c996e50759f5ae5ea091f81e1bf8f5eb6c'

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
    const url = `${this.apiUrl}/repos/${username}/${repo}/contents/${fullPath}`;
    return this.http.get<any>(url, { headers: this.getHeaders() });
  }


//   getRepoFiles(username: string, repoName: string, filePath: string): Observable<any> {
//     const url = `${this.apiUrl}/repos/${username}/${repoName}/contents/${filePath}`;
//     return this.http.get<any>(url, { headers: this.getHeaders() });
// }


  
  getFileContents(username: string, repoName: string, filePath: string): Observable<any> {
    const url = `${this.apiUrl}/repos/${username}/${repoName}/contents/${filePath}`;
    return this.http.get<any>(url, { headers: this.getHeaders() });
  }


  getFileContent(username: string, repo: string, path: string = ''): Observable<any> {
    const fullPath = path ? `/${path}` : '';
    const url = `${this.apiUrl}/repos/${username}/${repo}/contents/${fullPath}`;
    return this.http.get(url, { headers: this.getHeaders() });
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
  getRepoBranches(username: string, repoName: string): Observable<any[]> {
    const url = `${this.apiUrl}/repos/${username}/${repoName}/branches`;
    return this.http.get<any[]>(url);
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
    const url = `${this.apiUrl}/repos/${username}/${repo}/commits`;
    
    // You can customize the parameters based on your needs
    const params = new HttpParams()
      .set('sha', sha)
      .set('stat', 'true')
      .set('verification', 'true')
      .set('files', 'true');

    return this.http.get(url, { params: params, headers: this.getHeaders() });
  }

  getCommitDetails(owner: string, repo: string, commitHash: string): Observable<any> {
    const url = `${this.apiUrl}/${owner}/${repo}/git/commits/${commitHash}`;
    return this.http.get(url);
  }


  getChangedFileFromCommit(username: string, repo: string, sha: string): Observable<any> {
    const url = `${this.apiUrl}/repos/${username}/${repo}/git/commits/${sha}`;
    const params = new HttpParams()
      .set('stat', 'true') // include diff stats
      .set('verification', 'true') // include verification
      .set('files', 'true'); // include affected files

      return this.http.get(url, { params: params, headers: this.getHeaders() });  
  }



  getUserRepos(username: string): Observable<any[]> {
    const url = `${this.apiUrl}/users/${username}/repos`;
    return this.http.get<any[]>(url);
  }

  // Get branches for a repository
  // getRepoBranches(username: string, repoName: string): Observable<string[]> {
  //   const url = `${this.apiUrl}/repos/${username}/${repoName}/branches`;
  //   return this.http.get<string[]>(url);
  // }

  // Get files and folders for a repository path
  getRepoFiles(username: string, repoName: string, path: string, branch: string): Observable<any[]> {
    const fullPath = path ? `/${path}` : '';
    const url = `${this.apiUrl}/repos/${username}/${repoName}/contents${fullPath}?ref=${branch}`;
    return this.http.get<any[]>(url);
  }

  // Update a file in a repository
  // updateFile(username: string, repoName: string, filePath: string, content: string, branch: string): Observable<any> {
  //   const url = `${this.apiUrl}/repos/${username}/${repoName}/contents/${filePath}`;
  //   const headers = this.getHeaders();
    
  //   const requestBody = {
  //     message: 'Update file', // You can customize the commit message
  //     content: btoa(content), // Base64 encode the content
  //     branch: branch
  //     // You can add more parameters as needed based on the Gitea API documentation
  //   };

  //   return this.http.put<any>(url, requestBody, { headers });
  // }

  updateFile(
    username: string,
    repoName: string,
    filePath: string,
    content: string,
    branch: string,
    headers: HttpHeaders // Pass headers as an argument
  ): Observable<any> {
    const url = `${this.apiUrl}/repos/${username}/${repoName}/contents/${filePath}`;
    const body = {
      content: btoa(content), // Encode content as base64
      branch: branch
    };
    console.log("content",content,)
    return this.http.put(url, body, { headers });
  }


  getLatestCommitSHA(username: string, repoName: string, branch: string): Observable<string> {
    const url = `${this.apiUrl}/${username}/${repoName}/branches/${branch}`;
    return this.http.get<{ commit: { id: string } }>(url).pipe(map(response => response.commit.id));
  }
 

  getBranches(username: string, repoName: string): Observable<any> {
    const url = `${this.apiUrl}/repos/${username}/${repoName}/branches`;
    return this.http.get(url);
  }
  // createUser(user: any) {
  //   const url = `${this.apiUrl}/admin/users`;
  //   return this.http.post(url,user, { headers: this.getHeaders() });
  // }



  deleteBranch(owner: string, repo: string, branch: string): Observable<any> {
    const url = `${this.apiUrl}/repos/${owner}/${repo}/branches/${branch}`;
    const headers = this.getHeaders();
  
    return this.http.delete(url, { headers });
  }


  // deleteFile(owner: string, repo: string, filepath: string, sha: string): Observable<any> {
  //   const url = `${this.apiUrl}/repos/${owner}/${repo}/contents/${filepath}`;
  //   const headers = this.getHeaders();
  //   const body = {
  //     author: {
  //       name: 'Your Name',
  //       email: 'your.email@example.com',
  //     },
  //     sha: sha,
  //     message: 'Delete file: ' + filepath,
  //   };

  //   return this.http.delete(url, { headers, body });
  // }


  deleteFile(username: string, repoName: string, filepath: string, sha: string): Observable<any> {
    const url = `${this.apiUrl}/repos/${username}/${repoName}/contents/${filepath}`;
    const headers = this.getHeaders();
    const body = {
      author: {
        name: 'Your Name',
        email: 'your.email@example.com',
      },
      sha: sha,
      message: 'Delete file: ' + filepath,
    };
  
    return this.http.request('delete', url, { headers, body });
  }
  
  deleteFolder(owner: string, repo: string, folderPath: string): Observable<any> {
    // Fetch all files in the folder
    return this.getAllFiles(owner, repo, folderPath).pipe(
      switchMap((files) => {
        // Delete each file in the folder
        const deleteObservables = files.map((file: { path: string; sha: string; }) =>
          this.deleteFile(owner, repo, file.path, file.sha)
        );
        return forkJoin(deleteObservables);
      })
    );
  }
  


  deleteRepository(owner: string, repo: string): Observable<any> {
    const url = `${this.apiUrl}/repos/${owner}/${repo}`;
    const headers = this.getHeaders();

    return this.http.delete(url, { headers });
  }
}