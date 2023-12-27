import { Component } from '@angular/core';
import { GiteaService } from './gitea.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'NewGitea_POC';
  repoName: string = '';
  filePath: string = '';
  createdRepoMessage: string = '';



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
}
