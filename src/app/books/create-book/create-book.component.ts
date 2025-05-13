import { Component } from '@angular/core';
import {AngularEditorConfig} from '@kolkov/angular-editor';
import {ActivatedRoute,Router} from '@angular/router';
import {BooksService} from '../../services/books.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-create-book',
  standalone: false,
  templateUrl: './create-book.component.html',
  styleUrl: './create-book.component.css'
})
export class CreateBookComponent {
  errorMessage="";
  userId:any="";
  roomId="";
  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;

  config: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '30rem',
    minHeight: '5rem',
    placeholder: 'Enter text here...',
    translate: 'yes',
    defaultParagraphSeparator: 'p',
    defaultFontName: 'Arial',
    fonts: [
      { name: 'Arial', class: 'arial' },
      { name: 'Times New Roman', class: 'times-new-roman' },
      { name: 'Georgia', class: 'georgia' },
      { name: 'Verdana', class: 'verdana' },
      { name: 'Courier New', class: 'courier-new' },
      { name: 'Trebuchet MS', class: 'trebuchet-ms' },
      { name: 'Tahoma', class: 'tahoma' },
      { name: 'Comic Sans MS', class: 'comic-sans-ms' },
      { name: 'Impact', class: 'impact' },
      { name: 'Garamond', class: 'garamond' },
      { name: 'Palatino Linotype', class: 'palatino-linotype' },
      { name: 'Helvetica', class: 'helvetica' },
      { name: 'Franklin Gothic Medium', class: 'franklin-gothic-medium' },
      { name: 'Baskerville', class: 'baskerville' },
      { name: 'Roboto', class: 'roboto' },
      { name: 'Open Sans', class: 'open-sans' },
      { name: 'Lato', class: 'lato' },
      { name: 'Montserrat', class: 'montserrat' },
      { name: 'Poppins', class: 'poppins' },
      { name: 'Raleway', class: 'raleway' },
      { name: 'Source Sans Pro', class: 'source-sans-pro' },
      { name: 'Nunito', class: 'nunito' },
      { name: 'Merriweather', class: 'merriweather' },
      { name: 'Quicksand', class: 'quicksand' },
      { name: 'Ubuntu', class: 'ubuntu' },
      { name: 'Playfair Display', class: 'playfair-display' },
      { name: 'Oswald', class: 'oswald' },
      { name: 'PT Sans', class: 'pt-sans' }
    ]


  };
  book = {
    title: '',
    type: '',
    description: '',
    HtmlContent: '',
    coverImage: null as File | null
  };
  ngOnInit(): void {
    if(localStorage.getItem('user_id')){
      this.userId=localStorage.getItem('user_id')
    };
    this.route.params.subscribe(params => {
      this.roomId = params['id'];
      console.log(this.roomId);
    });
  }
  constructor(private bookservice:BooksService,
              private  route:ActivatedRoute,
              private router: Router,
              private location: Location) {}
  reloadCurrentRoute() {
    const currentUrl = this.location.path();
    this.location.replaceState(currentUrl);
    window.location.reload();
  }
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
  onRegister() {
    if (!this.selectedFile) {
      this.errorMessage = 'Please select a cover image';
      return;
    }

    const formData = new FormData();
    formData.append('title', this.book.title);
    formData.append('description', this.book.description);
    formData.append('firstChapterContent', this.book.HtmlContent);
    formData.append('createdBy', this.userId);
    formData.append('roomId', this.roomId);
    formData.append('type', this.book.type);
    formData.append('coverImage', this.selectedFile);

    console.log("Sending data with file:", this.selectedFile.name);

    this.bookservice.createBook(formData).subscribe({
      next: (response) => {
        console.log("Created successfully", response);
        this.reloadCurrentRoute();
      },
      error: (err) => {
        console.error("Error creating book:", err);
        this.errorMessage = err.error?.message || 'Failed to create book';
      }
    });
  }
  onCancel() {

  }
}
