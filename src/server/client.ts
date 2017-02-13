import { Branch } from './branch';

/**
 * @brief Model for a single Client
 * 
 * It's following these specifications:
 * > Um correntista é identificado pelo seu id, CPF, número da conta corrente e código da agência.
 * 
 */
export interface Client {
  id?    : number; // single unique number for a client (internal purposes)
  name   : string; // client name (at least two names)
  cpf    : string; // CPF (nine numbers)
  branch : Branch; // agência (pt_BR)
  account: number; // unique
  registerdate: Date;
  lastlogindate: Date;
}