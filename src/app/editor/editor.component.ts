import {Component, OnInit} from '@angular/core';
import {AngularEditorConfig} from '@kolkov/angular-editor';
import {ActivatedRoute} from '@angular/router';
import {ChapterService} from '../services/chapter.service';
import { Location } from '@angular/common';
import {TextService} from '../services/text.service';

@Component({
  selector: 'app-editor',
  standalone: false,
  templateUrl: './editor.component.html',
  styleUrl: './editor.component.css'
})
export class EditorComponent implements OnInit{
  lastUserContent = '';

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
  HtmlContent='';
  refContent?:any;


  constructor(private route:ActivatedRoute,private chapterService:ChapterService,private location: Location,
            private textservice:TextService) {
  }
  reloadCurrentRoute() {
    const currentUrl = this.location.path();
    this.location.replaceState(currentUrl);
    window.location.reload();
  }

  chapterId=""
  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.chapterId=params['chapterId']
      console.log("mel editor : "+this.chapterId)
    });
  }
  onRegister() {
    const data={chapterId:this.chapterId,content:this.HtmlContent,createdBy:localStorage.getItem('user_id')};
    this.chapterService.AddChapterVersion(data).subscribe({
      next:(response)=>{
        console.log(response);
        this.reloadCurrentRoute()
      },error:(err)=>{console.log(err)}
    })

  }
  backContent='';
  isReformulating = false;

  refCom() {
    const plainText = this.getPlainText(this.HtmlContent);
    if (!this.backContent) {
      this.backContent = plainText;
    }
    this.isReformulating = true;

    this.textservice.ref({ text: plainText }).subscribe({
      next: (response) => {
        this.HtmlContent = response.result;

        // Start fade out after 2 seconds
        setTimeout(() => {
          this.isReformulating = false;
        }, 2000);
      },
      error: (error) => {
        console.error(error);
        setTimeout(() => {
          this.isReformulating = false;
        }, 5000);
      }
    });
  }
  getPlainText(html: string): string {
    const temp = document.createElement('div');
    temp.innerHTML = html;
    return temp.textContent || temp.innerText || '';
  }

  back() {
    this.HtmlContent = this.lastUserContent || this.backContent;
  }
  onUserChange() {
    if (!this.isReformulating) {
      this.lastUserContent = this.HtmlContent;
    }
  }

}
