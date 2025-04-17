import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Task} from '../../../models/task';

@Component({
  selector: 'app-task-detail-panel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './task-detail-panel.component.html'
})
export class TaskDetailPanelComponent {
  @Input() task: Task | null = null;
  @Input() statuses: string[] = [];
  @Input() isNew: boolean = false;

  @Output() statusChange = new EventEmitter<string>();
  @Output() create = new EventEmitter<Task>();
  @Output() cancel = new EventEmitter<void>();

  onStatusChange(): void {
    if (this.task) {
      this.statusChange.emit(this.task.status);
    }
  }

  onCreate(): void {
    if (this.task) {
      this.create.emit(this.task);
    }
  }

  onCancel() {
    this.cancel.emit();
  }

  get taskDueDate(): string | null {
    if (!this.task?.taskDueDate) return null;
    const date = new Date(this.task.taskDueDate);
    return date.toISOString().split('T')[0];
  }

  set taskDueDate(value: string | null) {
    if (this.task && value) {
      this.task.taskDueDate = new Date(value).toISOString();
    }
  }
}
