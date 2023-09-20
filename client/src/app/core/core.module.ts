import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertMessageComponent } from './alert-message/alert-message.component';
import { ErrorMessageComponent } from './error-message/error-message.component';
import { throwIfAlreadyLoaded } from './guard/import-guard';

@NgModule({
  declarations: [
    AlertMessageComponent,
    ErrorMessageComponent
  ],
  imports: [
    CommonModule
  ]
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    throwIfAlreadyLoaded(parentModule, 'CoreModule');
  }
}
