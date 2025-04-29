import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ApplicationService} from '../../services/application.service';
import {Application} from '../../models/application.model';
import {NgbCollapse, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {AddApplicationComponent} from './add-application/add-application.component';
import {StatusService} from '../../services/status.service';
import {FormsModule} from '@angular/forms';
import {StatusHistoryPanelComponent} from './status-history-panel/status-history-panel.component';

import {Task} from '../../models/task';
import {TaskService} from '../../services/task.service';
import {TaskDetailPanelComponent} from './task-detail-panel/task-detail-panel.component';
import {TaskStatusChange} from '../../models/task-status-change';

enum APPLICATION_SORT_ORDER {
  ASCENDING = 'Ascending',
  DESCENDING = 'Descending',
}

@Component({
  selector: 'app-application',
  standalone: true,
  imports: [CommonModule, FormsModule, NgbCollapse, TaskDetailPanelComponent],
  templateUrl: './application.component.html',
})
export class ApplicationComponent implements OnInit {
  availableStatuses: string[] = [];
  applications: Application[] = [];
  originalApplications: Application[] = [];

  filters = this.getCleanFilter();
  showFilters: boolean = false;

  taskStatuses: string[] = ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'];
  tasksByAppId: { [key: number]: Task[] } = {};
  selectedTask: Task | null = null;

  creatingTaskAppId: number | null = null;
  newTask: Task = this.getEmptyTask();

  applicationSortOrder: APPLICATION_SORT_ORDER = APPLICATION_SORT_ORDER.DESCENDING;

  constructor(
    private applicationService: ApplicationService,
    private statusService: StatusService,
    private modalService: NgbModal,
    private taskService: TaskService
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
      this.applications.forEach(app => this.loadTasksForApplication(app.applicationId!));
      this.applications.sort((a, b) => this.applicationDataComparator(a, b));
    });
  }

  loadTasksForApplication(applicationId: number): void {
    this.taskService.getTasksByApplicationId(applicationId).subscribe((tasks) => {
      this.tasksByAppId[applicationId] = tasks;
    });
  }

  selectTask(task: Task): void {
    this.selectedTask = task;
  }

  updateSelectedTaskStatus(newStatus: string): void {
    if (this.selectedTask) {
      const change: TaskStatusChange = {
        taskId: this.selectedTask.taskId,
        status: newStatus
      };

      this.taskService.recordStatusChange(change).subscribe(() => {
        this.loadTasksForApplication(this.selectedTask!.applicationId);
      });
    }
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

    this.applications.sort((a, b) => this.applicationDataComparator(a, b));
  }

  private applicationDataComparator(app1: Application, app2: Application): number {
    if (!app1.creationDate) return 1;
    if (!app2.creationDate) return -1;
    const compressionResult = app1.creationDate.localeCompare(app2.creationDate);
    return this.applicationSortOrder === APPLICATION_SORT_ORDER.ASCENDING ? compressionResult : -compressionResult;
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

  onAddTask(applicationId: number | undefined): void {
    if (!applicationId) return;

    const now = new Date().toISOString();

    this.creatingTaskAppId = applicationId;
    this.newTask = {
      applicationId,
      name: '',
      note: '',
      status: 'PENDING',
      createdDate: now,
      taskDueDate: now,
      taskId: 0
    };
  }

  saveNewTask(task: Task): void {
    task.taskDueDate = new Date(task.taskDueDate).toISOString();
    this.taskService.createTask(task).subscribe(saved => {
      this.loadTasksForApplication(saved.applicationId);
      this.creatingTaskAppId = null;
    });
  }

  private getEmptyTask(): Task {
    const now = new Date().toISOString();
    return {
      taskId: 0,
      applicationId: 0,
      createdDate: now,
      taskDueDate: now,
      note: '',
      status: 'PENDING',
      name: ''
    };
  }

  closeTaskPanel(): void {
    this.selectedTask = null;
    this.creatingTaskAppId = null;
    this.newTask = this.getEmptyTask();
  }


  onClickChangeOrder() {
    this.applicationSortOrder =
      this.applicationSortOrder === APPLICATION_SORT_ORDER.DESCENDING
        ? APPLICATION_SORT_ORDER.ASCENDING
        : APPLICATION_SORT_ORDER.DESCENDING;

    this.applications.sort((a, b) => this.applicationDataComparator(a, b));
  }
}

