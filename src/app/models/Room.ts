export interface Room{
  _id:string;
  name: string;
  code: string;
  createdBy:{_id:string,name:string} ;
  users: { _id:string,
            name:string }[];
  pendingMembers: { _id:string,
                    name:string }[];
  description:string;
  coverImage: {
    path: string,
    contentType: string,
  };
  visibility: string;
}
