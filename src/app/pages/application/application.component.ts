import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // ✅ Import this
import { ApplicationService } from './application.service';
import { Application } from './application.model';

@Component({
  selector: 'app-application',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './application.component.html',
})
export class ApplicationComponent implements OnInit {
  applications: Application[] = [];

  constructor(private applicationService: ApplicationService) {}

  ngOnInit(): void {
    this.applicationService.getApplications().subscribe((data) => {
      this.applications = data;
    });
  }

  onAddApplication() {
    console.log('Add Application clicked');
  }
}
