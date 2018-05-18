import { NgModule } from '@angular/core';
import { MySlidesComponent } from './my-slides/my-slides';
import { MyworkComponent } from './mywork/mywork';
import { AddMateComponent } from './add-mate/add-mate';
@NgModule({
	declarations: [MySlidesComponent,
    MyworkComponent,
    AddMateComponent],
	imports: [],
	exports: [MySlidesComponent,
    MyworkComponent,
    AddMateComponent]
})
export class ComponentsModule {}
