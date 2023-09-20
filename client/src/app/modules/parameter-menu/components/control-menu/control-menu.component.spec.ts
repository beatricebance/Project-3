import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  waitForAsync,
} from "@angular/core/testing";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { By } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { of } from "rxjs";
import { MaterialModules } from "src/app/app-material.module";
import { CommandInvokerService } from "src/app/modules/workspace";
import { DrawingService } from "src/app/services/drawing/drawing.service";
import { ControlMenuComponent } from "./control-menu.component";

describe("ControlMenuComponent", () => {
  let component: ControlMenuComponent;
  let fixture: ComponentFixture<ControlMenuComponent>;
  const drawingServiceMock = class {
    isSaved = false;
  };

  // let dialogSpy: jasmine.Spy;
  const dialogRefSpyObj = jasmine.createSpyObj({
    afterClosed: of({}),
    afterOpened: of({}),
    open: null,
    close: null,
  });
  dialogRefSpyObj.componentInstance = { body: "" };
  beforeEach(
    waitForAsync(() => {
      let spyCommandInvokerService = jasmine.createSpyObj(
        "CommandInvokerService",
        ["undo", "redo"]
      );
      spyCommandInvokerService = {
        ...spyCommandInvokerService,
        isUndo: true,
        isRedo: true,
      };
      TestBed.configureTestingModule({
        declarations: [ControlMenuComponent],
        imports: [MaterialModules, BrowserAnimationsModule],
        providers: [
          {
            provide: CommandInvokerService,
            useValue: spyCommandInvokerService,
          },
          { provide: MatDialogRef, useValue: dialogRefSpyObj },
          { provide: DrawingService, useClass: drawingServiceMock },
        ],
      });
      spyOn(TestBed.get(MatDialog), "open").and.returnValue(dialogRefSpyObj);
      TestBed.compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ControlMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should call openWelcomeMessage() when button is clicked", fakeAsync(() => {
    spyOn(component, "openWelcomeMessage").and.callThrough();
    const welcomeButton = fixture.debugElement.query(
      By.css("button[id=welcome]")
    );
    welcomeButton.triggerEventHandler("click", null);
    expect(component.openWelcomeMessage).toHaveBeenCalled();
  }));

  it("should call openNewDrawing() when button is clicked", fakeAsync(() => {
    spyOn(component, "openNewDrawing").and.callThrough();
    const drawingButton = fixture.debugElement.query(
      By.css("button[id=drawing]")
    );
    drawingButton.triggerEventHandler("click", null);
    expect(component.openNewDrawing).toHaveBeenCalled();
  }));

  it("should call undo() when button is clicked", fakeAsync(() => {
    const spy = TestBed.get(CommandInvokerService);
    const drawingButton = fixture.debugElement.query(By.css("button[id=undo]"));
    drawingButton.triggerEventHandler("click", null);
    expect(spy.undo).toHaveBeenCalled();
  }));

  it("should call redo() when button is clicked", fakeAsync(() => {
    const spy = TestBed.get(CommandInvokerService);
    const drawingButton = fixture.debugElement.query(By.css("button[id=redo]"));
    drawingButton.triggerEventHandler("click", null);
    expect(spy.redo).toHaveBeenCalled();
  }));
});
