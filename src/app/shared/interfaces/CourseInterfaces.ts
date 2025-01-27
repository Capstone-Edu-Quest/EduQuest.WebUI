export interface ICourse {
  id: string;
  name: string;
  author: any; // TODO: User interface
  description: string;
  duration: number;
  image: string;
  price: number;
  createdDate: string;
  lastUpdated: string;
  rating: number;
  numberOfRating: number;
  isCompleted: boolean;
  progress: number; // %
  tags: ITag[];
}

export interface ITag {
  id: string;
  name: string;
  description: string;
}

export interface ICourseCart {
  courses: ICourse[];
  total: number;
}
