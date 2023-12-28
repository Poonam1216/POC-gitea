import { Component } from '@angular/core';
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

  // fetchBranch(){
  //   this.giteaService.getBranch(this.username, this.repoName, this.branch).subscribe({
  //     next:(response)=> {
  //       this.allBranches = response;
  //       console.log(response);
  //   },
  //   error:(err)=>{
  //     alert("No Branch Found")  
  //     }
  // })}
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
 
  })
}
  // fetchBranchDetails(branchName: string): void {
  //   // if (!this.branch) {
  //   //   console.error('Branch name is undefined.');
  //   //   return;
  //   // }
  //   this.giteaService.getBranchDetails(this.username, this.repoName, branchName).subscribe({
  //     next: (branchDetails: any) => {
  //       console.log('Branch details:', branchDetails);
  //     },
  //     error: (error: any) => {
  //       console.error(`Error fetching details for branch '${branchName}':`, error);
  //     }
  //   });
  // }

  DiveIn(file: any): void {
    if (file.type === 'file') {

      this.giteaService.getFileContent(this.username, this.repoName, file.path).subscribe({
        next: (response) => {
          this.fileContent = atob(response.content); // Decode 
        },
        error: (error) => {
          console.error('Error fetching file content:', error);
        }
      });
    } else if (file.type === 'dir') {
      this.giteaService.getAllFiles(this.username, this.repoName, file.path).subscribe({
        next: (response) => {
          this.allFiles = response;
          console.log(response);
        },
        error: (error) => {
          console.error("Error fetching files for this folder");
        }
      });
    }
  }

updateFiles(): void {
  const filePath = this.fileName;
  const fullPath = filePath ? `/${filePath}` : '';

  this.giteaService.getFileContent(this.username, this.repoName, fullPath).subscribe({
    next: (response) => {
      const sha = response.sha;
      const content = btoa(this.fileContent); // Encode content to Base64

      if (sha) {
        this.giteaService.updateFiles(this.username, this.repoName, fullPath, content, sha)
          .subscribe({
            next: (updateResponse) => {
              this.updateFileName = updateResponse.name;
              console.log(`File updated successfully: ${this.updateFileName}`);
            },
            error: (updateError) => {
              console.error('Error updating file:', updateError);
            }
          });
      } else {
        // Create a new file
        this.giteaService.createFile(this.username, this.repoName, fullPath, content)
          .subscribe({
            next: (createResponse) => {
              this.updateFileName = createResponse.name;
              console.log(`File created successfully: ${this.updateFileName}`);
            },
            error: (createError) => {
              console.error('Error creating file:', createError);
            }
          });
      }
    },
    error: (error) => {
      console.error('Error fetching file content:', error);
    }
  });
}



}
