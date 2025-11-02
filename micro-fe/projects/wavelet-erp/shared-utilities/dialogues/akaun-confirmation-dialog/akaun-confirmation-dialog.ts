import { Component} from '@angular/core';
import {MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './akaun-confirmation-dialog.html',
  styleUrls: ['./akaun-confirmation-dialog.scss']
})
export class AkaunConfirmationDialogComponent {
  public confirmMessage: string;
  constructor(public dialogRef: MatDialogRef<AkaunConfirmationDialogComponent>) {}
  onNoClick(): void {
    this.dialogRef.close();
  }
}
