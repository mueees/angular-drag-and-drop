import {NgModule} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";
// Components
import {AppComponent} from "./app.component";
import {DndModule} from "./libs/dnd/dnd.module";

@NgModule({
    imports: [
        BrowserModule,
        DndModule
    ],
    declarations: [
        AppComponent
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}