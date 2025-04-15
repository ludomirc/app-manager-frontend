import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ApplicationService} from '../../services/application.service';
import {Application} from '../../models/application.model';
import {NgbCollapse, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {AddApplicationComponent} from './add-application/add-application.component';
import {StatusService} from '../../services/status.service';
import {FormsModule} from '@angular/forms';
import {StatusHistoryPanelComponent} from './status-history-panel/status-history-panel.component';

@Component({
  selector: 'app-application',
  standalone: true,
  imports: [CommonModule, FormsModule, NgbCollapse],
  templateUrl: './application.component.html',
})
export class ApplicationComponent implements OnInit {
  availableStatuses: string[] = [];
  applications: Application[] = [];
  originalApplications: Application[] = [];

  filters = this.getCleanFilter();
  showFilters: boolean = false;

  constructor(
    private applicationService: ApplicationService,
    private statusService: StatusService,
    private modalService: NgbModal
  ) {
  }

  ngOnInit(): void {
    this.statusService.getAvailableStatuses().subscribe((data) => {
      this.availableStatuses = data;
    });
    this.applicationService.getApplications().subscribe((data) => {
      console.log('Loaded applications:', data);
      this.originalApplications = data;
      this.applications = [...data];
    });
  }

  applyFilters(): void {
    this.applications = this.originalApplications.filter(app => {
      const matchesName = !this.filters.name || app.name?.toLowerCase().includes(this.filters.name.toLowerCase());
      const matchesEnterprise = !this.filters.enterprise || app.enterpriseName?.toLowerCase().includes(this.filters.enterprise.toLowerCase());
      const matchesStatus = !this.filters.status || app.currentStatus === this.filters.status;
      const matchesDate = !this.filters.date || (
        app.creationDate &&
        new Date(app.creationDate).toISOString().slice(0, 10) === this.filters.date
      );

      return matchesName && matchesEnterprise && matchesStatus && matchesDate;
    });
  }

  onAddApplication() {
    const modalRef = this.modalService.open(AddApplicationComponent);
    modalRef.result.then((newApp) => {
      if (newApp) {
        this.applicationService.createApplication(newApp).subscribe((created) => {
          this.originalApplications.push(created);
          this.applyFilters();
        });
      }
    }).catch((reason) => {
      console.log('Modal dismissed:', reason);
    });
  }

  onStatusChange(applicationId: number, newStatus: string): void {
    this.statusService.changeStatus(applicationId, newStatus).subscribe(() => {
      const app = this.originalApplications.find(a => a.applicationId === applicationId);
      if (app) {
        app.currentStatus = newStatus;
      }
      this.applyFilters();
    });
  }

  onAppStatusHistory(applicationId: number) {
    const modalRef = this.modalService.open(StatusHistoryPanelComponent, {size: 'md'});
    modalRef.componentInstance.applicationId = applicationId;
  }

  clearFilters() {
    this.filters = this.getCleanFilter();
    this.applyFilters();
  }

  private getCleanFilter() {
    return {
      name: '',
      enterprise: '',
      status: '',
      date: ''
    };
  }
}
