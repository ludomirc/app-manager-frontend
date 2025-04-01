import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ApplicationService} from './application.service';
import {Application} from './application.model';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {AddApplicationModalComponent} from './add-application-modal.component';

@Component({
  selector: 'app-application',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './application.component.html',
})
export class ApplicationComponent implements OnInit {
  applications: Application[] = [];

  constructor(private applicationService: ApplicationService,
              private modalService: NgbModal) {
  }

  ngOnInit(): void {
    this.applicationService.getApplications().subscribe((data) => {
      this.applications = data;
    });
  }

  onAddApplication() {
    const modalRef = this.modalService.open(AddApplicationModalComponent);

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
}
