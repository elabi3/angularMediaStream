import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { MediaStreamModule } from './mediaStream/media-stream.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    MediaStreamModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
