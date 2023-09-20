import { DrawingService } from 'src/app/modules/workspace';
import {Component, OnInit, Inject, ViewChild, ElementRef} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PostService } from '../services/post.service';
import { DrawingHttpClientService } from 'src/app/modules/backend-communication';

@Component({
  selector: 'app-museum-dialog',
  templateUrl: './museum-dialog.component.html',
  styleUrls: ['./museum-dialog.component.scss']
})
export class MuseumDialog implements OnInit {

  @ViewChild('nameInput', { static: false }) private nameInput: ElementRef<HTMLInputElement>;

  constructor(public dialogRef: MatDialogRef<MuseumDialog>,
    @Inject(MAT_DIALOG_DATA) public name: string,
    private snackBar: MatSnackBar,
    private postService: PostService,
    private drawingService: DrawingService,
    private drawingHttpClient: DrawingHttpClientService,
    ) { }

  ngOnInit(): void {
  }

  onPublishClick(): void {
    const name = this.nameInput.nativeElement.value;
    this.nameInput.nativeElement.value = '';
    const isWhitespace = (name || '').trim().length === 0;
    if (isWhitespace){
      this.snackBar.open('The name can not be empty', 'Close', { duration: 3000 });
      return;
    }
    else{
      this.drawingHttpClient.getDrawing(this.drawingService.drawingId).subscribe((drawing) => {
        this.postService.publishDrawing(this.drawingService.drawingId, drawing).subscribe((response) => {});
      });

      this.dialogRef.close(name);
    }
  }
}
