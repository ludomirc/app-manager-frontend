import {Component, OnInit, inject} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Application} from '../../../models/application.model';
import {EnterpriseService, Enterprise} from '../../../services/enterprise.service';

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

  applicationForm: ApplicationFormModel = {
    name: '',
    notes: '',
    enterpriseId: null,
    newEnterpriseName: ''
  };

  application: Application = {
    name: '',
    notes: '',
    enterpriseId: null
  };

  ngOnInit(): void {
    this.enterpriseService.getEnterprises().subscribe({
      next: (data) => (this.enterprises = data),
      error: (err) => console.error('Failed to load enterprises', err)
    });
  }

  submit(): void {
    this.application = this.mapFormToApplication(this.applicationForm);
    if (this.isRequireToAddNewEnterprise()) {
      this.addNewEnterprise();
    } else {
      this.activeModal.close(this.application);
    }
  }

  private isRequireToAddNewEnterprise() {
    return this.addingNewEnterprise && this.applicationForm.newEnterpriseName.trim();
  }

  private addNewEnterprise() {
    this.enterpriseService.createEnterprise(this.applicationForm.newEnterpriseName).subscribe({
      next: (newEnterprise) => {
        this.application.enterpriseId = newEnterprise.enterpriseId;
        this.activeModal.close(this.application);
      },
      error: (err) => console.error('Failed to create enterprise', err)
    });
  }

  private mapFormToApplication(form: ApplicationFormModel): Application {
    return {
      name: form.name ?? '',
      notes: form.notes ?? '',
      enterpriseId: form.enterpriseId ?? null
    };
  }
}
