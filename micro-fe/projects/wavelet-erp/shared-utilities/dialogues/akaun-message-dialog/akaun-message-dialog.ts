import { Component} from '@angular/core';
import {MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './akaun-message-dialog.html',
  styleUrls: ['./akaun-message-dialog.scss']
})
export class AkaunMessageDialogComponent {
  public headerMessage: string;
  public confirmMessage: string;
  constructor(public dialogRef: MatDialogRef<AkaunMessageDialogComponent>) {}
  onNoClick(): void {
    this.dialogRef.close();
  }
}
