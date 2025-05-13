export interface Book {
  _id:string,
  title:string,
  type:string,
  room:string,
  createdBy:{_id:string,name:string}
  chapters:{_id:string,chapterNumber:string,updatedAt:string}[],
  lastChapterDeclared:string,
  createdAt:string,
  updatedAt:string,
  __v:string,
  completed:boolean,
  description:string,
  coverImage: {
    path: string,
    contentType: string,
  }
}
