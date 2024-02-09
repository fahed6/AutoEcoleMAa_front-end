import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
@Component({
  selector: 'app-images-dialog',
  templateUrl: './images-dialog.component.html',
  styleUrl: './images-dialog.component.css'
})
export class ImagesDialogComponent implements OnInit{

 
   constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    
  }

 
  }

