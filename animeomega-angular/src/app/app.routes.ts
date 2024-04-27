import {Routes} from '@angular/router';
import {SiguiendoComponent} from "./pages/siguiendo/siguiendo.component";
import {HomeComponent} from "./pages/home/home.component";
import {ExplorarComponent} from "./pages/explorar/explorar.component";
import {FuturosEstrenosComponent} from "./pages/futuros-estrenos/futuros-estrenos.component";
import {PendienteComponent} from "./pages/pendiente/pendiente.component";
import {FavoritoComponent} from "./pages/favorito/favorito.component";
import {AbandonadoComponent} from "./pages/abandonado/abandonado.component";
import {CompletadoComponent} from "./pages/completado/completado.component";
import {NotFoundComponent} from "./errors/not-found/not-found.component";
import {LoginCallbackComponent} from "./admin/login-callback/login-callback.component";

export const routes: Routes = [
  {path: '', component:HomeComponent, pathMatch: 'full'},
 // { path: '**', component: NotFoundComponent},
  {path: 'siguiendo', component: SiguiendoComponent, title: 'Siguiendo'},
  {path: 'explorar', component: ExplorarComponent, title: 'Explorar'},
  {path: 'futuros-estrenos', component: FuturosEstrenosComponent, title: 'Futuros Estrenos'},
  {path: 'pendiente', component: PendienteComponent, title: 'Pendiente'},
  {path: 'favorito', component: FavoritoComponent, title: 'Favoritos'},
  {path: 'completado', component: CompletadoComponent, title: 'Completado'},
  {path: 'abandonado', component: AbandonadoComponent, title: 'Abandonado'},
  {path:'login-callback',component:LoginCallbackComponent},
];
