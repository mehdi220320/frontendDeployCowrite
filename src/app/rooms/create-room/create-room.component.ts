import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {RoomsService} from '../../services/rooms.service';

@Component({
  selector: 'app-create-room',
  standalone: false,
  templateUrl: './create-room.component.html',
  styleUrl: './create-room.component.css'
})
export class CreateRoomComponent implements OnInit{
  userId:any="";
  room: {
    name: string;
    description: string;
    visibility:string

  } = {
    name: '',
    description: '',
    visibility:'public'
  };

  imagePreview: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;
  isLoading = false;
  errorMessage = '';

  constructor(private roomService: RoomsService,private router: Router) {}

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      if (!file.type.match(/image\/(jpeg|png|jpg)/)) {
        this.errorMessage = 'Only JPG/PNG images are allowed';
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        this.errorMessage = 'Image must be less than 5MB';
        return;
      }

      this.selectedFile = file;
      this.errorMessage = '';

      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  onRegister(): void {
    if (!this.selectedFile) {
      this.errorMessage = 'Please select a thumbnail image';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const formData = new FormData();
    formData.append('name', this.room.name);
    formData.append('createdBy', this.userId);
    formData.append('description', this.room.description);
    formData.append('visibility', this.room.visibility);
    formData.append('coverImage', this.selectedFile);

    this.roomService.createRoom(formData).subscribe({
      next: (response) => {
        console.log("room added successfully", response);
        this.isLoading = false;
        this.resetForm();
        this.router.navigate(['/room/'+response._id]);
      },
      error: (error) => {
        console.error("Error adding movie", error);
        this.errorMessage = error.message+" userId ahawa :  "+ this.userId || 'Failed to add room. Please try again.';
        this.isLoading = false;
      }
    });
  }

  private resetForm(): void {
    this.room = {
      name: '',
      description: '',
      visibility:'public'
    };
    this.selectedFile = null;
    this.imagePreview = null;
  }
  removeImage(): void {
    this.selectedFile = null;
    this.imagePreview = null;
    const fileInput = document.getElementById('thumbnail') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }}

  ngOnInit(): void {
    if(localStorage.getItem('user_id')){this.userId=localStorage.getItem('user_id')}
  }

}
