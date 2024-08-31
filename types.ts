export type Question = {
    id?: number;
  title: string;
  text: string;
  thumbs_up: number;
    thumbs_down: number;
    user: User;
};

export type User = {
    id?: number;
    username: string;
    password: string;
};