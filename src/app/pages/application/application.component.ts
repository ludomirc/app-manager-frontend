import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ApplicationService} from '../../services/application.service';
import {Application} from './application.model';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {AddApplicationComponent} from './add-application/add-application.component';
import {StatusService} from '../../services/status.service';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-application',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './application.component.html',
})
export class ApplicationComponent implements OnInit {
  availableStatuses: string[] = [];
  applications: Application[] = [];

  constructor(private applicationService: ApplicationService,
              private statusService: StatusService,
              private modalService: NgbModal) {
  }

  ngOnInit(): void {
    this.statusService.getAvailableStatuses().subscribe((data) => {
      this.availableStatuses = data;
    });
    this.applicationService.getApplications().subscribe((data) => {
      console.log('Loaded applications:', data);
      this.applications = data;
    });
  }

  onAddApplication() {
    const modalRef = this.modalService.open(AddApplicationComponent);

    modalRef.result.then((newApp) => {
      if (newApp) {
        this.applicationService
          .createApplication(newApp)
          .subscribe((created) => {
            this.applications.push(created);
          });
      }
    }).catch((reason) => {
      console.log('Modal dismissed:', reason);
    });
  }

  onStatusChange(applicationId: number, newStatus: string): void {
    this.statusService.changeStatus(applicationId, newStatus).subscribe(() => {
      const app = this.applications.find(a => a.applicationId === applicationId);
      if (app) {
        app.currentStatus = newStatus;
      }
    });
  }
}
