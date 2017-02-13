import {Client} from './client';
export interface Transaction {
  origin: Client; 
  destiny: Client;
  date: Date;
  amount: number;
}