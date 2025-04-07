import { Component, OnInit, inject } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Application } from '../application.model';
import { EnterpriseService, Enterprise } from '../../../enterprise.service';

interface ApplicationFormModel extends Partial<Application> {
  newEnterpriseName: string;
}

@Component({
  standalone: true,
  selector: 'app-add-application-modal',
  imports: [CommonModule, FormsModule],
  templateUrl: './add-application.component.html'
})
export class AddApplicationComponent implements OnInit {
  activeModal = inject(NgbActiveModal);
  enterpriseService = inject(EnterpriseService);

  enterprises: Enterprise[] = [];
  addingNewEnterprise = false;

  application: ApplicationFormModel = {
    name: '',
    notes: '',
    enterpriseId: null,
    newEnterpriseName: ''
  };

  ngOnInit(): void {
    this.enterpriseService.getEnterprises().subscribe({
      next: (data) => (this.enterprises = data),
      error: (err) => console.error('Failed to load enterprises', err)
    });
  }

  submit(): void {
    if (this.addingNewEnterprise && this.application.newEnterpriseName.trim()) {
      this.enterpriseService.createEnterprise(this.application.newEnterpriseName).subscribe({
        next: (newEnterprise) => {
          this.application.enterpriseId = newEnterprise.enterpriseId;
          this.application.newEnterpriseName = '';
          this.activeModal.close(this.application);
        },
        error: (err) => console.error('Failed to create enterprise', err)
      });
    } else {
      this.activeModal.close(this.application);
    }
  }
}
