import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ErrorMessage } from '../models/error-message.model';

@Component({
  selector: 'app-error-message',
  templateUrl: './error-message.component.html',
  styleUrls: ['./error-message.component.scss'],
})
export class ErrorMessageComponent {

  errorMessage: string;

  constructor(@Inject(MAT_DIALOG_DATA) public data: ErrorMessage, public dialogRef: MatDialogRef<ErrorMessageComponent>) { }

  /// ferme la boite de dialogue
  close(): void {
    this.dialogRef.close();
  }

}
