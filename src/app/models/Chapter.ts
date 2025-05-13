export interface Chapter {
  _id:string,
  title:string,
  chapterNumber:number,
  book: { title:string },
  confirmedVersion:{_id:string,content:string},
  createdAt:string,
  updatedAt:string,
  chapterDeadline:string,
  createdBy:{_id:string,name:string}

}
