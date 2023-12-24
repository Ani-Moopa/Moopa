export interface Sessions {
  user: User;
  expires: string;
}

export interface User {
  name: string;
  picture: Picture;
  sub: string;
  token: string;
  id: number;
  image: Image;
  list: string[];
  version: string;
  iat: number;
  exp: number;
  jti: string;
}

export interface Picture {
  large: string;
  medium: string;
  __typename: string;
}

export interface Image {
  large: string;
  medium: string;
  __typename: string;
}
