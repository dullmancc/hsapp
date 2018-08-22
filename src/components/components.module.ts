import { NgModule } from '@angular/core';
import { MySlidesComponent } from './my-slides/my-slides';
import { MyworkComponent } from './mywork/mywork';
import { AddMateComponent } from './add-mate/add-mate';
import { StackPanelComponent } from './stack-panel/stack-panel';
@NgModule({
	declarations: [MySlidesComponent,
    MyworkComponent,
    AddMateComponent,
    StackPanelComponent],
	imports: [],
	exports: [MySlidesComponent,
    MyworkComponent,
    AddMateComponent,
    StackPanelComponent]
})
export class ComponentsModule {}
