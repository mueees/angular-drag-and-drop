import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
// Components
import { AppComponent } from './app.component';
import { DDModule } from './libs/dd/dd.module';

@NgModule({
  imports: [
    BrowserModule,
    DDModule
  ],
  declarations: [
    AppComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
