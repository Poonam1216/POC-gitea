import { HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { map, Observable } from 'rxjs';
import { GiteaService } from './gitea.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'gitea';
  repoName: string = '';
  filePath: string = '';
  fileContent: string = '';
  createdRepoMessage: string = '';
  fetchedFileContent: string = '';
  username:string = '';
  allRepos:any = '';
  allFiles: any = '';
  currentPath: string = '';
  updateFile: any;
  fileName: any;
  updateFileName: string = '';
  allBranches: any;
  branch: any;
  branchDetails: any;
  branchFiles: any;
  newBranchName: any;
  createBranchMessage: any;
  oldBranchName: any;
  commitHistory: any;
  commitHash: any;
  commitDetails: any;
  sha: any;
  repoDetails: any;
  publicRepos: any[]=[];
  repoFiles: any[]=[];
  usernameOrRepo: string='';
  selectedBranch: string='';
  selectedRepo: string='';
  branchName:any;
  repos: any[]=[];
  files: any[]=[];
  fileDetails: any;
  selectedRepository: any;
  repositories: any;
  selectedRepoName: string = '';
  selectedRepoFiles: any[] = [];
  selectedFileName: string = '';
  selectedFileContent: any = null;
  branches:{ name: string }[]=[];
  selectedFolderPath: string='';
  folders: any[]=[];
  name:string='';
  details?: string='';
  branchToDelete: string='';
  selectedFile: any;
 
 

  constructor(private giteaService: GiteaService) {}

  createRepository(): void {
    this.giteaService.createRepository(this.repoName).subscribe({
      next: (_response) => {
        this.createdRepoMessage = `Repository "${this.repoName}" created successfully!`;
      },
      error: (error) => {
        console.error('Error creating repository:', error);
        this.createdRepoMessage = 'Error creating repository. Check the console for details.';
      }
    });
  }


  fetchAllRepos(){
    this.giteaService.getAllRepos(this.username).subscribe({
      next:(response)=>{
        this.allRepos = response;
        console.log(response)
      },
      error:(error)=>{
        console.error(error);
      }
    })
  }
  fetchAllFiles(){
    this.giteaService.getAllFiles(this.username, this.repoName, this.filePath).subscribe({
      next:(response)=>{
        this.allFiles = response;
        console.log(response)
      },
      error:(error)=>{
        console.error(error);
      }
    })
  }


  
  loading: boolean = false;

  fetchBranch(): void {
    this.giteaService.getBranch(this.username, this.repoName).subscribe({
      next: (branches) => {
        this.allBranches = branches;
        console.log('Branches:', branches);
      },
      error: (error) => {
        console.error('Error fetching branches:', error);
      }
    });
  }

  fetchBranchDetails(branchName: string): void {
    this.giteaService.getBranchDetails(this.username, this.repoName, branchName).subscribe({
      next: (branchDetails: any) => {
        this.branchDetails = branchDetails;
        console.log('Branch details:', branchDetails);
  
        // Use getBranchFiles to fetch files in the branch
        this.giteaService.getBranchFiles(this.username, this.repoName, branchName).subscribe({
          next: (files: any) => {
            this.branchFiles = files;
            console.log('Branch files:', files);
          },
          error: (error: any) => {
            console.error('Error fetching branch files:', error);
          }
        });
      },
      error: (error: any) => {
        console.error('Error fetching branch details:', error);
      }
    });
  }

  createBranch(): void {
    if (!this.newBranchName || !this.username || !this.repoName) {
      console.error('Username, repository name, and new branch name are required.');
      return;
    }
  
    this.giteaService.createBranch(this.username, this.repoName, this.newBranchName, this.oldBranchName).subscribe({
      next: (_response) => {
        this.createBranchMessage = `Branch "${this.newBranchName}" created successfully!`;
      },
      error: (error) => {
        console.error('Error creating branch:', error);
        this.createBranchMessage = 'Error creating branch. Check the console for details.';
      }
    });
  }
  
  fetchCommitHistory() {
    this.giteaService.getCommitHistory(this.username, this.repoName).subscribe({
      next: (commits) => {
        this.commitHistory = commits;
        console.log('Commit History:', commits);
      },
      error: (error) => {
        console.error('Error fetching commit history:', error);
      }
    });
  }

  fetchCommitDetails() {
    this.giteaService.getChangedFileFromCommit(this.username, this.repoName, this.sha).subscribe({
      next:(data) => {
        this.commitDetails = data;
        console.log('Commit Details:', this.commitDetails);
      },
      error:(error) => {
        console.error('Error fetching commit details:', error);
      }
  });
  }


  fetchUserRepos() {
    // const username = 'PoonamRani'; // Change this to the desired username
    this.giteaService.getAllRepos(this.username).subscribe({
     next: (repos) => {
        this.allRepos = repos;
        this.selectedRepoName = '';
        this.selectedRepoFiles = [];
        this.selectedFileName = '';
        this.selectedFileContent = null;
        // Optionally, you can perform any additional logic with the fetched repos
      },
     error:(error) => {
        console.error('Error fetching user repos:', error);
      }
  });
  }
  fetchRepoFiles(repoName: string) {
    this.selectedRepoName = repoName;
    const defaultBranch = 'master';
    this.selectedFileContent = null;
    this.giteaService.getRepoFiles(this.username, repoName, this.filePath, defaultBranch).subscribe({
      next: (files: any[]) => {
        console.log('Files in repo:', files);
        this.selectedRepoFiles = files;
        this.selectedFileName = '';
      },
      error: (error: any) => {
        console.error(`Error fetching files for repo ${repoName}:`, error);
      }
    });
  }
  

  fetchFileContent(file: any) {

    if(file.type === 'file'){
    this.selectedFileName = file.name;
    this.giteaService.getFileContents(this.username, this.selectedRepoName, file.path).subscribe({
      next: (data) => {
        this.selectedFileContent = atob(data.content);
      },
      error: (error) => {
        console.error(`Error fetching content for file ${file.name}:`, error);
      }
    });
  }else{
     console.log('Selected item is not a file.');
  }
  }


  // fetchRepoFilesInDir(file: any) {
  //   const fullPath = file.type === 'dir'
  //     ? `${this.currentPath}/${file.name}`
  //     : `${this.currentPath}/${file.path}`;
    
  //   console.log('Fetching files for directory:', fullPath);
  
  //   this.giteaService.getRepoFiles(this.username, this.selectedRepoName, fullPath,).subscribe({
  //     next: (files: any[]) => {
  //       this.currentPath = fullPath;  
  //       this.selectedRepoFiles = files;
  //       this.selectedFileName = '';
  //       this.selectedFileContent = null;
  //     },
  //     error: (error: any) => {
  //       console.error(`Error fetching files for directory ${fullPath}:`, error);
  //     }
  //   });
  // }
  
  

  // DiveIn(file: any): void {
  //   if (file.type === 'file') {

  //     this.giteaService.getFileContent(this.username, this.repoName, file.path).subscribe({
  //       next: (response) => {
  //         this.fileContent = atob(response.content); // Decode 
  //       },
  //       error: (error) => {
  //         console.error('Error fetching file content:', error);
  //       }
  //     });
  //   } else if (file.type === 'dir') {
  //     this.giteaService.getAllFiles(this.username, this.repoName, file.path).subscribe({
  //       next: (response) => {
  //         this.allFiles = response;
  //         console.log(response);
  //       },
  //       error: (_error) => {
  //         console.error("Error fetching files for this folder");
  //       }
  //     });
  //   }
  // }



  DiveIn(file: any): void {
    if (file.type === 'file') {
      this.giteaService.getFileContent(this.username, this.repoName, file.path).subscribe({
        next: (response) => {
          this.fileContent = atob(response.content); // Decode 
          this.sha = response.sha;
          this.filePath = file.path; // Set the selected file's path
        },
        error: (error) => {
          console.error('Error fetching file content:', error);
        },
      });
    } else if (file.type === 'dir') {
      this.giteaService.getAllFiles(this.username, this.repoName, file.path).subscribe({
        next: (response) => {
          this.allFiles = response;
          console.log(response);
        },
        error: (_error) => {
          console.error('Error fetching files for this folder');
        },
      });
    }
  }
  
  loadRepositories(): void {
    if (!this.username) {
      console.error('Gitea username is required.');
      return;
    }

    this.giteaService.getUserRepos(this.username).subscribe({
      next: (repos: any[]) => {
        this.repositories = repos;
      },
      error: (error: any) => {
        console.error('Error loading repositories:', error);
      }
    });
  }

  // Load branches for the selected repository
  loadBranches(): void {
    if (!this.selectedRepoName) {
      console.error('Repository name is required.');
      return;
    }
  
    this.giteaService.getRepoBranches(this.username, this.selectedRepoName).subscribe({
      next: (branches: any[]) => {
        console.log('Branches:', branches);
        // Assuming each branch has a 'name' property, adjust accordingly
        this.branches = branches.map(branch => ({ name: branch.name, details: 'Add details here if available' }));
      },
      error: (error: any) => {
        console.error('Error loading branches:', error);
      }
    });
  }
  
  

  loadFolderContents(): void {
    if (!this.selectedRepoName || !this.selectedBranch) {
      console.error('Repository name and branch are required.');
      return;
    }
  
    // Assuming that '/' is a valid folder path, modify this check if needed
    const path = this.selectedFolderPath === '/' ? '' : this.selectedFolderPath;
  
    this.giteaService.getRepoFiles(this.username, this.selectedRepoName, path, this.selectedBranch).subscribe({
      next: (contents: any[]) => {
        // Filter items based on whether they are directories or files
        const folders = contents.filter(item => item.type === 'dir');
        const files = contents.filter(item => item.type === 'file');
  
        // If there are nested folders, fetch their contents
        folders.forEach(folder => {
          this.giteaService.getRepoFiles(this.username, this.selectedRepoName, `${path}/${folder.name}`, this.selectedBranch)
            .subscribe({
              next: (nestedContents: any[]) => {
                // Add nested folder contents to the existing folders and files arrays
                this.folders = [...this.folders, ...nestedContents.filter(item => item.type === 'dir').map(item => `${folder.name}/${item.name}`)];
                this.files = [...this.files, ...nestedContents.filter(item => item.type === 'file')];
              },
              error: (error: any) => {
                console.error(`Error loading contents of folder ${folder.name}:`, error);
              }
            });
        });
      },
      error: (error: any) => {
        console.error('Error loading folder contents:', error);
      }
    });
  }
  




updateFiles() {
  this.giteaService.updateFiles(this.username, this.repoName, this.filePath, this.fileContent, this.branch, this.sha)
    .subscribe(
      (response) => {
        console.log('File updated successfully:', response);
        // Add any additional handling after successful update
      },
      (error) => {
        console.error('Error updating file:', error);
        // Handle error as needed
      }
    );
}






deleteBranch(): void {
  if (this.selectedRepoName && this.selectedBranch) {
    const owner = this.username;
    const repo = this.selectedRepoName;
    const branch = this.selectedBranch;

    this.giteaService.deleteBranch(owner, repo, branch).subscribe(
      (response) => {
        if (response === null) {
          console.log('Branch deleted successfully.');
          // Handle success, if needed
        } else {
          console.log('Unexpected response after deleting branch:', response);
          // Handle unexpected response
        }
      },
      (error) => {
        console.error('Error deleting branch:', error);
        // Handle error, if needed
      }
    );
  }
}



deleteFolder(): void {
  if (this.sha) {
    this.giteaService.deleteFolder(this.username, this.repoName, this.selectedFile.path).subscribe(
      (response) => {
        console.log('Folder deleted successfully:', response);
      },
      (error) => {
        console.error('Error deleting folder:', error);
      }
    );
  } else {
    console.error('Folder SHA is not available. Fetch the folder first.');
  }
}

deleteFile(): void {
  if (this.sha) {
    this.giteaService.deleteFile(this.username, this.repoName, this.filePath, this.sha).subscribe(
      (response) => {
        if (response.content === null) {
          console.log('File deleted successfully.');
          // Additional handling, if needed
        } else {
          console.log('Unexpected response after deleting file:', response);
          // Handle unexpected response
        }
      },
      (error) => {
        console.error('Error deleting file:', error);
        // Handle error, if needed
      }
    );
  } else {
    console.error('File SHA is not available. Fetch the file first.');
  }
}


deleteRepository(): void {
  this.giteaService.deleteRepository(this.username, this.repoName).subscribe(
    (response) => {
      console.log('Repository deleted successfully:', response);
    },
    (error) => {
      console.error('Error deleting repository:', error);
    }
  );
}


}





