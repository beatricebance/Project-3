import {
  Component,
  ComponentFactory,
  ComponentFactoryResolver,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild,
  ViewContainerRef,
} from "@angular/core";
import { MatDrawer } from "@angular/material/sidenav";
import { ParameterComponentService } from "./services/parameter-component/parameter-component.service";
import { ToggleDrawerService } from "./services/toggle-drawer/toggle-drawer.service";
import { PARAMETER_MENU_CONSTANT } from "./constants/parameter-menu-constant";
import { ParameterDirective } from "./directives/parameter.directive";

@Component({
  selector: "app-parameter-menu",
  templateUrl: "./parameter-menu.component.html",
  styleUrls: ["./parameter-menu.component.scss"],
})
export class ParameterMenuComponent implements OnChanges {
  readonly width = PARAMETER_MENU_CONSTANT;

  @Input()
  selectId: number;

  @ViewChild(MatDrawer)
  child: MatDrawer;

  @ViewChild(ParameterDirective, { static: true })
  parameterHost: ParameterDirective;

  constructor(
    private toggleDrawerService: ToggleDrawerService,
    private componentFactoryResolver: ComponentFactoryResolver,
    private parameterComponentService: ParameterComponentService
  ) {}
  /// Fait appel a loadComponent si le id selectionner change
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.selectId) {
      this.loadComponent();
    }
  }

  /// Charger le component pour l'outil en question
  private loadComponent() {
    const componentFactory: ComponentFactory<any> =
      this.componentFactoryResolver.resolveComponentFactory(
        this.parameterComponentService.getComponent(this.selectId)
      );
    const viewContainerRef: ViewContainerRef =
      this.parameterHost.viewContainerRef;

    viewContainerRef.clear();
    viewContainerRef.createComponent(componentFactory);
  }

  /// Recoit si le service de toggle drawer est ouvert
  get isOpened(): boolean {
    return this.toggleDrawerService.isOpened;
  }
}
