import { NgModule } from '@angular/core';
import { MySlidesComponent } from './my-slides/my-slides';
import { MyworkComponent } from './mywork/mywork';
@NgModule({
	declarations: [MySlidesComponent,
    MyworkComponent],
	imports: [],
	exports: [MySlidesComponent,
    MyworkComponent]
})
export class ComponentsModule {}
