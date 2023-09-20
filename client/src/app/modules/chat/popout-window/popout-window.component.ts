import { Component, EventEmitter, ElementRef, HostListener, Input, OnDestroy, Output, Renderer2, ViewChild } from '@angular/core';

@Component({
  selector: 'app-popout-window',
  templateUrl: './popout-window.component.html',
  styleUrls: ['./popout-window.component.scss'],
})
export class PopoutWindowComponent implements OnDestroy {

  // Code sourced from :
  // https://github.com/Shemesh/angular-popout-window/blob/master/projects/popout-window/src/lib/popout-window.component.ts
  // TODO: Test event listening for keyboard event for enter key
  @ViewChild('innerWrapper') private innerWrapper: ElementRef;

  @Input() windowWidth: number;
  @Input() windowHeight: number;
  @Input() windowLeft: number;
  @Input() windowTop: number;
  @Input() windowTitle: string;
  @Input() windowStyle: string;
  @Input() windowStyleUrl: string;
  @Input() suppressCloneStyles = false;
  @Input() get isPoppedOut(): boolean {
    return this.isOut;
  }

  @Output() isOutEvent = new EventEmitter<boolean>();

  private popoutWindow: Window;
  private isOut = false;

  @HostListener('window:beforeunload')
  private beforeunloadHandler(): void {
    this.close();
  }

  constructor(
    private renderer2: Renderer2,
    private elementRef: ElementRef,
  ) {}

  ngOnDestroy(): void {
    this.beforeunloadHandler();
    this.close();
  }

  private close(): void {
    if (this.popoutWindow) {
      this.popoutWindow.close();
      this.popoutWindow = null as unknown as Window;
      this.isOut = false;
      this.isOutEvent.emit(this.isOut);
    }
  }

  popIn(): void {
    this.renderer2.appendChild(this.elementRef.nativeElement, this.innerWrapper.nativeElement);
    this.close();
  }

  popOut(): void {
    if (!this.popoutWindow) {
      const elmRect = this.innerWrapper.nativeElement.getBoundingClientRect();

      const navHeight = window.outerHeight - window.innerHeight;
      const navWidth = window.outerWidth - window.innerWidth;

      const winLeft = this.windowLeft || window.screenX + navWidth + elmRect.left;
      const winTop = this.windowTop || window.screenY + navHeight + elmRect.top - 60;

      this.popoutWindow = window.open(
        '',
        `popoutWindow${Date.now()}`,
        `width=${this.windowWidth > 99 ? this.windowWidth : elmRect.width},
        height=${this.windowHeight > 99 ? this.windowHeight : elmRect.height + 1},
        left=${winLeft},
        top=${winTop}`,
      ) as Window;

      this.popoutWindow.document.title = this.windowTitle ? this.windowTitle : window.document.title;
      this.popoutWindow.document.body.style.margin = '0';

      if (!this.suppressCloneStyles) {
        document.head.querySelectorAll('style').forEach((node) => {
          this.popoutWindow.document.head.appendChild(node.cloneNode(true));
        });

        document.head.querySelectorAll('link[rel="stylesheet"]').forEach((node) => {
          this.popoutWindow.document.head.insertAdjacentHTML('beforeend',
            `<link rel="stylesheet" type="${(node as HTMLLinkElement).type}" href="${(node as HTMLLinkElement).href}">`);
        });

        (document as any).fonts.forEach((node: any) => {
          (this.popoutWindow.document as any).fonts.add(node);
        });
      }

      if (this.windowStyleUrl) {
        this.popoutWindow.document.head.insertAdjacentHTML('beforeend',
          `<link rel="stylesheet" type="text/css" href="${window.location.origin}/${this.windowStyleUrl}">`);
      }

      if (this.windowStyle) {
        this.popoutWindow.document.head.insertAdjacentHTML('beforeend', `<style>${this.windowStyle}</style>`);
      }

      this.renderer2.appendChild(this.popoutWindow.document.body, this.innerWrapper.nativeElement);
      this.isOut = true;

      this.popoutWindow.addEventListener('unload', () => {
        this.popIn();
      });
    } else {
      this.popoutWindow.focus();
    }
  }
}