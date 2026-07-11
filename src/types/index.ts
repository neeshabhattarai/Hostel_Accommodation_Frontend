export interface Feature {
  icon: string;
  title: string;
  desc: string;
}
 
export interface Room {
  type: string;
  price: string;
  per: string;
  tag: string;
  tagColor: string;
  imgBg: string;
  emoji: string;
  desc: string;
  features: string[];
}
 
export interface Testimonial {
  name: string;
  country: string;
  text: string;
  avatar: string;
  color: string;
}
 
export interface Stat {
  value: string;
  label: string;
}
 