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
import {AnimeComponent} from "./pages/anime/anime.component";
import {VerCapituloComponent} from "./pages/ver-capitulo/ver-capitulo.component";
import { AdminGuard } from './auth/guards/admin.guard';
import {ResultadoBusquedaComponent} from "./pages/resultado-busqueda/resultado-busqueda.component";
import {authGuard} from "./auth/guards/auth.guard";
import {HomeAdminComponent} from "./pages/admin/home/home.component";
import {UnauthorizedComponent} from "./errors/unauthorized/unauthorized.component";

export const routes: Routes = [
  {path: '', component:HomeComponent, pathMatch: 'full'},
  {path: 'siguiendo', component: SiguiendoComponent, title: 'Siguiendo',canActivate: [authGuard]},
  {path: 'explorar', component: ExplorarComponent, title: 'Explorar'},
  {path: 'futuros-estrenos', component: FuturosEstrenosComponent, title: 'Futuros Estrenos'},
  {path: 'pendiente', component: PendienteComponent, title: 'Pendiente',canActivate: [authGuard]},
  {path: 'favorito', component: FavoritoComponent, title: 'Favoritos',canActivate: [authGuard]},
  {path: 'completado', component: CompletadoComponent, title: 'Completado',canActivate: [authGuard]},
  {path: 'abandonado', component: AbandonadoComponent, title: 'Abandonado',canActivate: [authGuard]},
  {path: 'anime/:id', component: AnimeComponent, title: 'Anime'},
  {path: 'anime/:animeId/capitulo/:capituloId', component: VerCapituloComponent, title: 'Capitulos'},
  {path: 'resultado',component : ResultadoBusquedaComponent,title: 'Resultado de la busqueda'},
  {path:'login-callback',component:LoginCallbackComponent},
  {path:'admin',component:HomeAdminComponent,canActivate: [AdminGuard]},
  {path: 'unauthorized',component: UnauthorizedComponent},
  { path: '**', component: NotFoundComponent},



];
