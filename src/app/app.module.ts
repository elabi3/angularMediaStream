import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { WebRTCStreamModule } from './webRTC/webRTC-stream.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    WebRTCStreamModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
