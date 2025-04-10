import {Component, Input, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {StatusService} from '../../../services/status.service';
import {StatusChange} from '../../../models/status-change';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  standalone: true,
  selector: 'app-status-history-panel',
  imports: [CommonModule],
  templateUrl: './status-history-panel.component.html',
})
export class StatusHistoryPanelComponent implements OnInit {
  @Input() applicationId!: number;
  history: StatusChange[] = [];
  loading = true;

  constructor(private statusService: StatusService,
              public activeModal: NgbActiveModal) {
  }

  ngOnInit(): void {
    this.statusService.getStatusHistory(this.applicationId)
      .subscribe(data => {
        this.history = data;
        this.loading = false;
      });
  }
}
