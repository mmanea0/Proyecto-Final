import {User} from "../auth/interfaces/user";
import {Capitulo} from "./anime";

export interface BlibliotecaCapitulo {

  id:number;
  usuario_id:User;
  visto:boolean;
  capitulo_id:Capitulo;

}
