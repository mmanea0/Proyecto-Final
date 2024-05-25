import {User} from "../auth/interfaces/user";
import {Capitulo} from "./anime";

export interface BlibliotecaCapitulo {

  id:number;
  usuario_id:User;
  capitulo_id:Capitulo;

}
