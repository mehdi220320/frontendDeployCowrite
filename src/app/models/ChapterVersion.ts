export interface ChapterVersion {
  _id:string,
  chapter:string,
  createdBy:{name:string,_id:string},
  votes:number,
  voters:{_id:string,name:string}
  content:string,
  createdAt:string,
  updatedAt:string,
}
